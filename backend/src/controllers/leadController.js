const { sendWhatsApp, templates } = require('../utils/whatsapp');
const Lead = require('../models/Lead');
const { sendLeadNotification, sendLeadAcknowledgement } = require('../utils/email');

/**
 * POST /api/leads
 * Submit a new lead (public)
 */
const createLead = async (req, res, next) => {
  try {
    const { name, phone, email, service, message } = req.body;

    // Basic validation
    if (!name || !phone || !email || !service) {
      return res.status(400).json({ success: false, message: 'Name, phone, email and service are required' });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      service,
      message,
      ipAddress: req.ip,
      source: req.headers.referer ? 'website' : 'api',
    });

    // Send emails (non-blocking)
    sendLeadNotification(lead).catch(() => {});
    sendLeadAcknowledgement(lead).catch(() => {});

    // Send WhatsApp acknowledgement to client
    const waNum = req.body.whatsapp || req.body.phone;
    if (waNum) {
      sendWhatsApp(waNum, templates.leadAcknowledgement(lead.name, lead.service)).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! We will contact you shortly.',
      lead: { id: lead._id, name: lead.name, service: lead.service },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/leads
 * Get all leads with filters (admin only)
 */
const getLeads = async (req, res, next) => {
  try {
    const { status, service, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (service) filter.service = service;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/leads/:id
 */
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/leads/:id
 * Update lead status/notes (admin only)
 */
const updateLead = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead updated', data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/leads/:id
 */
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/leads/stats
 */
const getLeadStats = async (req, res, next) => {
  try {
    const [total, byStatus, byService] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$service', count: { $sum: 1 } } }]),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Lead.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      data: { total, todayCount, byStatus, byService },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads, getLead, updateLead, deleteLead, getLeadStats };
