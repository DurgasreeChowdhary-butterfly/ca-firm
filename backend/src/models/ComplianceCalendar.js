const mongoose = require('mongoose');

const calendarEntrySchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientProfile: {
    entityType: { type: String, enum: ['individual', 'partnership', 'pvt_ltd', 'llp', 'huf', 'firm'], default: 'individual' },
    turnover: { type: Number, default: 0 },
    state: { type: String, default: 'MH' },
    hasGST: { type: Boolean, default: false },
    isComposition: { type: Boolean, default: false },
    qrmpOptIn: { type: Boolean, default: false },
    auditRequired: { type: Boolean, default: false },
    tdsApplicable: { type: Boolean, default: false },
    advanceTaxApplicable: { type: Boolean, default: false },
  },
  dueDates: [{
    complianceType: String,   // "GSTR-1", "GSTR-3B", "ITR", "TDS_RETURN", etc.
    category: String,         // "GST", "ITR", "TDS", "ROC"
    period: String,           // "Apr 2025", "Q1 FY2025-26"
    dueDate: Date,
    originalDueDate: Date,    // before any extension
    isExtended: { type: Boolean, default: false },
    extensionNote: String,
    urgency: String,          // "overdue" | "critical" | "urgent" | "upcoming" | "future"
    status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' },
    completedAt: Date,
    completedNote: String,
  }],
  financialYear: { type: String, default: '2025-26' },
  lastCalculated: { type: Date, default: Date.now },
}, { timestamps: true });

calendarEntrySchema.index({ clientEmail: 1, financialYear: 1 });
module.exports = mongoose.model('ComplianceCalendar', calendarEntrySchema);
