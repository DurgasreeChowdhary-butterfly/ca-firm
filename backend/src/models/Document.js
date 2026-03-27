const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  clientName: { type: String, required: true, trim: true },
  clientEmail: { type: String, required: true, trim: true },
  clientPhone: { type: String, trim: true },
  originalFileName: { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },
  documentType: {
    type: String,
    enum: ['bank_statement', 'gst_invoice', 'form_16', 'itr_acknowledgement',
           'tds_certificate', 'balance_sheet', 'salary_slip', 'other'],
    default: 'other',
  },
  extractedData: {
    // GST Invoice
    gstin: String,
    invoiceNo: String,
    invoiceDate: String,
    supplierName: String,
    taxableValue: Number,
    cgst: Number,
    sgst: Number,
    igst: Number,
    totalValue: Number,
    // Form 16 / TDS
    employerTAN: String,
    employeePAN: String,
    assessmentYear: String,
    grossSalary: Number,
    tdsDeducted: Number,
    // Bank Statement
    accountNo: String,
    bankName: String,
    period: String,
    openingBalance: Number,
    closingBalance: Number,
    // Generic
    documentDate: String,
    amount: Number,
    description: String,
  },
  extractionNotes: { type: String },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'needs_review', 'verified', 'rejected'],
    default: 'uploaded',
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },
  reviewNote: { type: String },
  fileUrl: { type: String }, // Cloudinary or local path
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

documentSchema.index({ clientEmail: 1, createdAt: -1 });
documentSchema.index({ status: 1 });
module.exports = mongoose.model('Document', documentSchema);
