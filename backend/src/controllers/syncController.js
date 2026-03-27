const SyncRecord = require('../models/SyncRecord');
const crypto = require('crypto');

// Simulate incoming data from accounting software
const DEMO_ZOHO_DATA = [
  { invoice_id: 'ZHO-2025-001', amount: 85000, date: '2025-04-10', client: 'ABC Pvt Ltd', type: 'invoice', gst: 15300 },
  { invoice_id: 'ZHO-2025-002', amount: 120000, date: '2025-04-15', client: 'XYZ Traders', type: 'invoice', gst: 21600 },
  { invoice_id: 'ZHO-2025-003', amount: 45000, date: '2025-04-20', client: 'Sharma & Co', type: 'expense', gst: 8100 },
];

// Verify HMAC signature from Zoho/QB webhooks
function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto.createHmac('sha256', secret || 'webhook_secret')
    .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
    .digest('hex');
  return signature === expected;
}

// Conflict resolution: determine which value wins
function resolveConflict(internalRecord, externalRecord) {
  if (internalRecord.caReviewed) return { winner: 'internal', action: 'push_to_external' };
  if (new Date(externalRecord.modified) > new Date(internalRecord.updatedAt)) return { winner: 'external', action: 'update_internal' };
  if (internalRecord.amount !== externalRecord.amount) return { winner: 'manual', action: 'flag_conflict' };
  return { winner: 'external', action: 'update_internal' };
}

// POST /api/sync/zoho/webhook — receive Zoho Books events
const zohoWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-zoho-signature'] || '';
    // In production: verify signature
    // const valid = verifyWebhookSignature(req.body, signature, process.env.ZOHO_WEBHOOK_SECRET);

    const { event_type, data, clientId } = req.body;

    // Idempotency check
    if (data?.invoice_id) {
      const existing = await SyncRecord.findOne({ externalId: data.invoice_id, source: 'zoho' });
      if (existing) return res.json({ success: true, status: 'duplicate_skipped' });
    }

    await SyncRecord.create({
      clientId: clientId || 'unknown',
      source: 'zoho',
      direction: 'inbound',
      eventType: event_type || 'data.received',
      externalId: data?.invoice_id,
      payload: data,
      status: 'success',
      syncedAt: new Date(),
    });

    res.json({ success: true, message: 'Zoho webhook received and logged' });
  } catch (err) { next(err); }
};

// POST /api/sync/tally/push — receive data from Tally local agent
const tallyPush = async (req, res, next) => {
  try {
    const { clientId, clientName, vouchers = [] } = req.body;
    if (!clientId) return res.status(400).json({ success: false, message: 'clientId required' });

    const results = [];
    for (const voucher of vouchers) {
      const existing = await SyncRecord.findOne({ externalId: voucher.VOUCHERNUMBER, source: 'tally' });
      if (existing) { results.push({ voucherNo: voucher.VOUCHERNUMBER, status: 'skipped_duplicate' }); continue; }

      await SyncRecord.create({
        clientId, clientName,
        source: 'tally',
        direction: 'inbound',
        eventType: 'voucher.pushed',
        externalId: voucher.VOUCHERNUMBER || `TALLY-${Date.now()}`,
        payload: voucher,
        status: 'success',
        syncedAt: new Date(),
      });
      results.push({ voucherNo: voucher.VOUCHERNUMBER, status: 'synced' });
    }

    res.json({ success: true, message: `Processed ${vouchers.length} vouchers`, results });
  } catch (err) { next(err); }
};

// POST /api/sync/demo/trigger — demo: simulate a full sync cycle
const triggerDemoSync = async (req, res, next) => {
  try {
    const { clientId = 'DEMO-001', clientName = 'Demo Client', source = 'zoho' } = req.body;

    // Simulate receiving data from Zoho
    const created = [];
    for (const invoice of DEMO_ZOHO_DATA) {
      const existing = await SyncRecord.findOne({ externalId: invoice.invoice_id });
      if (!existing) {
        const record = await SyncRecord.create({
          clientId, clientName, source, direction: 'inbound',
          eventType: 'invoice.synced', externalId: invoice.invoice_id,
          payload: invoice, status: 'success', syncedAt: new Date(),
        });
        created.push(record);
      }
    }

    res.json({
      success: true,
      message: `Demo sync complete. ${created.length} new records synced from ${source}.`,
      synced: created.length,
      data: created,
    });
  } catch (err) { next(err); }
};

// GET /api/admin/sync/records — admin view all sync records
const getSyncRecords = async (req, res, next) => {
  try {
    const { source, status, clientId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (source) filter.source = source;
    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
    const total = await SyncRecord.countDocuments(filter);
    const records = await SyncRecord.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit);
    res.json({ success: true, data: records, pagination: { total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// GET /api/admin/sync/stats — sync health dashboard
const getSyncStats = async (req, res, next) => {
  try {
    const [total, bySource, byStatus, conflicts] = await Promise.all([
      SyncRecord.countDocuments(),
      SyncRecord.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
      SyncRecord.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      SyncRecord.countDocuments({ status: 'conflict' }),
    ]);
    const last24h = await SyncRecord.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    res.json({ success: true, data: { total, bySource, byStatus, conflicts, last24h } });
  } catch (err) { next(err); }
};

// PUT /api/admin/sync/:id/resolve — resolve a conflict manually
const resolveConflictRecord = async (req, res, next) => {
  try {
    const { resolution, resolvedBy } = req.body;
    const record = await SyncRecord.findByIdAndUpdate(req.params.id, {
      status: 'success',
      'conflictData.resolution': resolution,
      'conflictData.resolvedBy': resolvedBy || req.admin?.name,
    }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, message: 'Conflict resolved', data: record });
  } catch (err) { next(err); }
};

module.exports = { zohoWebhook, tallyPush, triggerDemoSync, getSyncRecords, getSyncStats, resolveConflictRecord };
