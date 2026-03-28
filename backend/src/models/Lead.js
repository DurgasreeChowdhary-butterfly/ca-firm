const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  whatsapp: { type: String, trim: true },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]{7,15}$/, 'Please provide a valid phone number'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: [
      'Income Tax Filing',
      'GST Registration & Filing',
      'Company Registration',
      'Audit & Assurance',
      'Tax Planning',
      'Other',
    ],
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  ipAddress: String,
  source: {
    type: String,
    default: 'website',
  },
}, { timestamps: true });

// Index for faster queries
leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ service: 1 });

module.exports = mongoose.model('Lead', leadSchema);
