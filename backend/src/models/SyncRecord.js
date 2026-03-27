const mongoose = require('mongoose');

const syncRecordSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientName: { type: String },
  source: {
    type: String,
    enum: ['zoho', 'quickbooks', 'tally', 'manual'],
    required: true,
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true,
  },
  eventType: { type: String },
  externalId: { type: String },
  internalId: { type: String },
  payload: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ['success', 'failed', 'conflict', 'skipped', 'pending'],
    default: 'pending',
  },
  conflictData: {
    field: String,
    internalValue: mongoose.Schema.Types.Mixed,
    externalValue: mongoose.Schema.Types.Mixed,
    resolvedBy: String,
    resolution: String,
  },
  errorMessage: { type: String },
  retryCount: { type: Number, default: 0 },
  syncedAt: { type: Date, default: Date.now },
}, { timestamps: true });

syncRecordSchema.index({ clientId: 1, source: 1, createdAt: -1 });
module.exports = mongoose.model('SyncRecord', syncRecordSchema);
