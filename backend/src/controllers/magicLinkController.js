const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const MagicToken = require('../models/MagicToken');
const { sendMagicLinkEmail } = require('../utils/email');

// Rate limit: max 3 magic links per hour per email
async function checkRateLimit(email) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const count = await MagicToken.countDocuments({ clientEmail: email, createdAt: { $gte: oneHourAgo } });
  return count >= 3;
}

// Sample reports (in production, these come from your DB)
const SAMPLE_REPORTS = {
  'mis_q1_2025': { title: 'MIS Report Q1 2025', type: 'mis_report', data: { revenue: 450000, expenses: 280000, profit: 170000, gstLiability: 45000, tdsDeducted: 12000 } },
  'tax_comp_2024': { title: 'Tax Computation FY 2024-25', type: 'tax_computation', data: { grossIncome: 1200000, deductions: 150000, taxableIncome: 1050000, taxPayable: 118500, advanceTaxPaid: 100000, balanceTax: 18500 } },
  'gst_summary_q2': { title: 'GST Summary Q2 2025', type: 'gst_summary', data: { outwardSupplies: 850000, igstCollected: 45000, cgstCollected: 22500, sgstCollected: 22500, itcClaimed: 35000, netPayable: 55000 } },
};

// POST /api/magic-link/request — client requests access to a report
const requestMagicLink = async (req, res, next) => {
  try {
    const { clientEmail, clientName, reportId, reportType } = req.body;
    if (!clientEmail || !reportId || !reportType) {
      return res.status(400).json({ success: false, message: 'Email, reportId and reportType are required' });
    }

    // Rate limit check
    const limited = await checkRateLimit(clientEmail);
    if (limited) {
      return res.status(429).json({ success: false, message: 'Too many requests. Max 3 magic links per hour. Please wait.' });
    }

    // Verify report exists
    if (!SAMPLE_REPORTS[reportId]) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Invalidate any existing unused tokens for same email+report
    await MagicToken.updateMany(
      { clientEmail, reportId, usedAt: null, invalidatedAt: null },
      { $set: { invalidatedAt: new Date() } }
    );

    // Generate cryptographically secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await MagicToken.create({
      tokenHash,
      clientEmail,
      clientName: clientName || clientEmail.split('@')[0],
      reportType,
      reportId,
      expiresAt,
      deliveryMethod: 'email',
      ipCreated: req.ip,
    });

    // Build the magic link (rawToken sent to client, hash stored in DB)
    const magicLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/report?token=${rawToken}&reportId=${reportId}`;

    // Send email (non-blocking)
    if (process.env.EMAIL_USER) {
      sendMagicLinkEmail({ email: clientEmail, name: clientName, link: magicLink, reportTitle: SAMPLE_REPORTS[reportId].title, expiresIn: '15 minutes' }).catch(() => {});
    }

    res.json({
      success: true,
      message: `A secure access link has been sent to ${clientEmail}. It expires in 15 minutes.`,
      // In development, return link directly so you can test
      ...(process.env.NODE_ENV === 'development' && { devLink: magicLink, devNote: 'This link is only shown in development mode' }),
    });
  } catch (err) { next(err); }
};

// POST /api/magic-link/validate — validate token and return scoped JWT
const validateMagicLink = async (req, res, next) => {
  try {
    const { token, reportId } = req.body;
    if (!token || !reportId) {
      return res.status(400).json({ success: false, message: 'Token and reportId required' });
    }

    // Hash the raw token to look up in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const magicToken = await MagicToken.findOne({
      tokenHash,
      reportId,
      usedAt: null,
      invalidatedAt: null,
    });

    if (!magicToken) {
      return res.status(401).json({ success: false, message: 'Invalid or expired link. Please request a new one.' });
    }

    if (magicToken.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Link has expired (15 min limit). Please request a new one.' });
    }

    // Consume token atomically — mark as used
    await MagicToken.findByIdAndUpdate(magicToken._id, { usedAt: new Date(), ipUsed: req.ip });

    // Issue a short-lived scoped JWT (30 min, read-only, single report)
    const scopedJWT = jwt.sign(
      { clientEmail: magicToken.clientEmail, clientName: magicToken.clientName,
        reportId, reportType: magicToken.reportType, scope: 'report_read', type: 'magic' },
      process.env.JWT_SECRET || 'ca_firm_secret',
      { expiresIn: '30m' }
    );

    // Return report data + scoped token
    const report = SAMPLE_REPORTS[reportId];
    res.json({
      success: true,
      message: 'Access granted',
      token: scopedJWT,
      report: { ...report, id: reportId, accessedBy: magicToken.clientEmail, accessedAt: new Date() },
      expiresIn: '30 minutes',
    });
  } catch (err) { next(err); }
};

// GET /api/admin/magic-links — admin view all issued tokens
const getMagicLinks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await MagicToken.countDocuments();
    const tokens = await MagicToken.find({})
      .select('-tokenHash') // never expose hash
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit);
    res.json({ success: true, data: tokens, pagination: { total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// DELETE /api/admin/magic-links/revoke/:email — revoke all tokens for a client
const revokeTokens = async (req, res, next) => {
  try {
    const result = await MagicToken.updateMany(
      { clientEmail: req.params.email, usedAt: null, invalidatedAt: null },
      { $set: { invalidatedAt: new Date() } }
    );
    res.json({ success: true, message: `Revoked ${result.modifiedCount} active tokens for ${req.params.email}` });
  } catch (err) { next(err); }
};

module.exports = { requestMagicLink, validateMagicLink, getMagicLinks, revokeTokens };
