const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
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
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    // e.g., "10:00 AM", "11:00 AM"
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
  },
}, { timestamps: true });

// Compound unique index to prevent double booking
appointmentSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

// Index for admin queries
appointmentSchema.index({ status: 1, date: 1 });

// Static method to get available time slots for a given date
appointmentSchema.statics.getBookedSlots = async function (date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const booked = await this.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: 'cancelled' },
  }).select('timeSlot');

  return booked.map((appt) => appt.timeSlot);
};

module.exports = mongoose.model('Appointment', appointmentSchema);
