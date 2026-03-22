const Appointment = require('../models/Appointment');
const { sendAppointmentConfirmation } = require('../utils/email');

// Available time slots
const ALL_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM',
];

/**
 * GET /api/appointments/slots?date=YYYY-MM-DD
 * Get available time slots for a date (public)
 */
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot book past dates' });
    }

    // Sundays are closed (0 = Sunday)
    if (requestedDate.getDay() === 0) {
      return res.json({ success: true, availableSlots: [], message: 'Closed on Sundays' });
    }

    const bookedSlots = await Appointment.getBookedSlots(date);
    const availableSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    res.json({ success: true, availableSlots, bookedSlots });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/appointments
 * Book an appointment (public)
 */
const createAppointment = async (req, res, next) => {
  try {
    const { name, email, phone, service, date, timeSlot, message } = req.body;

    if (!name || !email || !phone || !service || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    // Check if slot is still available
    const bookedSlots = await Appointment.getBookedSlots(date);
    if (bookedSlots.includes(timeSlot)) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another.',
      });
    }

    const appointment = await Appointment.create({
      name, email, phone, service,
      date: new Date(date),
      timeSlot,
      message,
    });

    // Send confirmation email (non-blocking)
    sendAppointmentConfirmation(appointment).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! We will confirm shortly.',
      data: {
        id: appointment._id,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose another.',
      });
    }
    next(error);
  }
};

/**
 * GET /api/admin/appointments
 * Get all appointments (admin)
 */
const getAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: d, $lt: nextDay };
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .sort({ date: 1, timeSlot: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: appointments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/appointments/:id
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment updated', data: appointment });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/appointments/:id
 */
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAvailableSlots, createAppointment, getAppointments, updateAppointment, deleteAppointment };
