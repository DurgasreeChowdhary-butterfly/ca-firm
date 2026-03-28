const mongoose = require('mongoose');

const complianceQuerySchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  clientPhone: { type: String, trim: true },
  clientWhatsapp: { type: String, trim: true },
  clientEmail: { type: String, trim: true },
  query: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['GST', 'ITR', 'TDS', 'Audit', 'Company Law', 'General'],
    default: 'General',
  },
  answer: { type: String },
  citations: [{
    source: String,
    section: String,
    date: String,
    url: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'answered', 'escalated'],
    default: 'pending',
  },
  answeredBy: { type: String, default: 'AI Engine' },
  caReviewNote: { type: String },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

complianceQuerySchema.index({ category: 1, createdAt: -1 });
module.exports = mongoose.model('ComplianceQuery', complianceQuerySchema);
