const nodemailer = require('nodemailer');

/**
 * Create transporter based on environment
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send new lead notification to admin
 */
const sendLeadNotification = async (lead) => {
  if (!process.env.EMAIL_USER) return; // Skip if email not configured

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: `🔔 New Lead: ${lead.name} - ${lead.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
            New Lead Received
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Name:</td><td style="padding: 8px;">${lead.name}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px;">${lead.email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px;">${lead.phone}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">Service:</td><td style="padding: 8px;">${lead.service}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Message:</td><td style="padding: 8px;">${lead.message || 'N/A'}</td></tr>
            <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold; color: #374151;">Date:</td><td style="padding: 8px;">${new Date().toLocaleString()}</td></tr>
          </table>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            Log in to your admin dashboard to manage this lead.
          </p>
        </div>
      `,
    });
    console.log('📧 Lead notification email sent');
  } catch (err) {
    console.error('Email send error (non-fatal):', err.message);
  }
};

/**
 * Send lead acknowledgement to client
 */
const sendLeadAcknowledgement = async (lead) => {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: lead.email,
      subject: 'We received your enquiry - CA Firm',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Thank you, ${lead.name}!</h2>
          <p>We have received your enquiry regarding <strong>${lead.service}</strong>.</p>
          <p>Our team will get back to you within <strong>24 hours</strong> on your registered phone number or email.</p>
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>Your Reference Details:</strong></p>
            <p style="margin: 5px 0;">Service: ${lead.service}</p>
            <p style="margin: 5px 0;">Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <p>For urgent queries, you can also reach us on WhatsApp.</p>
          <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `,
    });
    console.log('📧 Lead acknowledgement email sent to client');
  } catch (err) {
    console.error('Email send error (non-fatal):', err.message);
  }
};

/**
 * Send appointment confirmation
 */
const sendAppointmentConfirmation = async (appointment) => {
  if (!process.env.EMAIL_USER) return;

  try {
    const transporter = createTransporter();
    const dateStr = new Date(appointment.date).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: appointment.email,
      subject: 'Appointment Booking Confirmed - CA Firm',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Appointment Booked Successfully!</h2>
          <p>Dear ${appointment.name},</p>
          <p>Your appointment has been booked. Here are your details:</p>
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Service:</strong> ${appointment.service}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            <p><strong>Status:</strong> Pending Confirmation</p>
          </div>
          <p>Our team will confirm your appointment shortly.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Appointment email error (non-fatal):', err.message);
  }
};

module.exports = { sendLeadNotification, sendLeadAcknowledgement, sendAppointmentConfirmation };
