const mongoose = require('mongoose');

const magicTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true, index: true },
  clientEmail: { type: String, required: true },
  clientName: { type: String },
  reportType: {
    type: String,
    enum: ['mis_report', 'tax_computation', 'balance_sheet', 'gst_summary', 'tds_summary'],
    required: true,
  },
  reportId: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  usedAt: { type: Date, default: null },
  invalidatedAt: { type: Date, default: null },
  deliveryMethod: { type: String, enum: ['email', 'sms'], default: 'email' },
  ipCreated: { type: String },
  ipUsed: { type: String },
}, { timestamps: true });

magicTokenSchema.index({ clientEmail: 1, createdAt: -1 });
module.exports = mongoose.model('MagicToken', magicTokenSchema);
