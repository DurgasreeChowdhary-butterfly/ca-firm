/**
 * WhatsApp Notification Utility
 * Uses WhatsApp Business API via Twilio or direct wa.me links
 * For production: replace with Twilio/WATI/AiSensy API
 */

const https = require('https');

// ── Config ──────────────────────────────────────────────────
// Set these in Render env vars when ready:
// WHATSAPP_PROVIDER = "twilio" | "wati" | "log" (default: log in dev)
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
// WATI_API_KEY, WATI_BASE_URL
const PROVIDER = process.env.WHATSAPP_PROVIDER || 'log';

// ── Format phone to international ───────────────────────────
function formatPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

// ── Core send function ───────────────────────────────────────
async function sendWhatsApp(to, message) {
  const phone = formatPhone(to);
  if (!phone) { console.log('[WhatsApp] Invalid phone:', to); return; }

  if (PROVIDER === 'twilio') {
    return sendViaTwilio(phone, message);
  } else if (PROVIDER === 'wati') {
    return sendViaWATI(phone, message);
  } else {
    // Development mode: just log
    console.log(`\n📱 [WhatsApp MOCK] To: ${phone}\n${message}\n`);
    return { success: true, mock: true };
  }
}

// ── Twilio implementation ────────────────────────────────────
async function sendViaTwilio(to, body) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID) return;
  const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  return twilio.messages.create({
    body,
    from: `whatsapp:${TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'}`,
    to: `whatsapp:${to}`,
  });
}

// ── WATI implementation ──────────────────────────────────────
async function sendViaWATI(to, message) {
  const { WATI_API_KEY, WATI_BASE_URL } = process.env;
  if (!WATI_API_KEY) return;
  const response = await fetch(`${WATI_BASE_URL}/api/v1/sendSessionMessage/${to.replace('+', '')}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${WATI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageText: message }),
  });
  return response.json();
}

// ── Message Templates ────────────────────────────────────────
const templates = {

  complianceAnswered: (name, query, answer, citations = []) => `
🏛️ *CA Firm Mumbai — Query Answered*

Hi ${name}! Your compliance query has been answered by our CA team.

*Your Question:*
${query}

*Answer:*
${answer}

${citations.length > 0 ? `📖 *Legal Reference:*\n${citations.map(c => `• ${c.source} — ${c.section}`).join('\n')}` : ''}

⚠️ This is general guidance. For advice specific to your situation, book a free consultation.

📞 *Call:* +91 98765 43210
🌐 *Website:* https://trusted-ca-firm.netlify.app
`.trim(),

  documentStatus: (name, fileName, status, note = '') => {
    const statusMsg = {
      verified: '✅ *VERIFIED* — Your document has been reviewed and approved by our CA.',
      rejected: '❌ *REJECTED* — Please re-upload with corrections.',
      needs_review: '⚠️ *NEEDS REVIEW* — Our CA has flagged this for your attention.',
      processed: '🤖 *AUTO-PROCESSED* — Document received and classified.',
    }[status] || `Status updated to: *${status}*`;

    return `
🏛️ *CA Firm Mumbai — Document Update*

Hi ${name}!

*File:* ${fileName}
*Status:* ${statusMsg}
${note ? `\n*CA Note:* ${note}` : ''}

📞 *Questions?* Call +91 98765 43210 or reply here.
`.trim();
  },

  appointmentConfirmed: (name, service, date, timeSlot) => `
🏛️ *CA Firm Mumbai — Appointment Confirmed* ✅

Hi ${name}! Your appointment is confirmed.

📋 *Service:* ${service}
📅 *Date:* ${new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
🕐 *Time:* ${timeSlot}
📍 *Location:* 123 Financial District, BKC, Mumbai – 400051

*To reschedule:* Reply to this message or call +91 98765 43210

See you soon! 🙏
`.trim(),

  appointmentStatusUpdate: (name, service, status) => `
🏛️ *CA Firm Mumbai — Appointment Update*

Hi ${name}! Your appointment status has been updated.

📋 *Service:* ${service}
📊 *New Status:* ${status.toUpperCase()}

${status === 'confirmed' ? '✅ You are confirmed! See you at our Mumbai office.' : ''}
${status === 'cancelled' ? '❌ Your appointment has been cancelled. Please book again if needed.' : ''}
${status === 'completed' ? '🎉 Thank you for visiting us! We hope we could help.' : ''}

📞 *Questions?* +91 98765 43210
`.trim(),

  leadAcknowledgement: (name, service) => `
🏛️ *CA Firm Mumbai — Query Received* ✅

Hi ${name}! We received your enquiry about *${service}*.

Our CA team will contact you within *2 hours* on working days.

📞 *Urgent?* Call us now: *+91 98765 43210*
🌐 *Website:* https://trusted-ca-firm.netlify.app

Thank you for choosing CA Firm Mumbai! 🙏
`.trim(),

  documentUploaded: (name, fileName, docType) => `
🏛️ *CA Firm Mumbai — Document Received* 📁

Hi ${name}! We received your document.

📄 *File:* ${fileName}
🏷️ *Type Detected:* ${docType?.replace(/_/g, ' ') || 'Other'}

Our CA will review it and update you within 24 hours.

📞 *Questions?* +91 98765 43210
`.trim(),

};

module.exports = { sendWhatsApp, formatPhone, templates };
