import React from 'react';
import SEO from '../components/common/SEO';
import LeadForm from '../components/common/LeadForm';
import PaymentLinks from '../components/common/PaymentLinks';
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink, Navigation } from 'lucide-react';

const WHATSAPP = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';
const PHONE = '+91 98765 43210';
const PHONE_TEL = 'tel:+919876543210';
const PHONE2 = '+91 98765 43211';
const PHONE2_TEL = 'tel:+919876543211';
const EMAIL = 'info@cafirm.com';
const CITY = 'Mumbai';
const ICAI_NO = 'XXXXXX';

// ── REPLACE with client's actual Google Maps embed URL ──
// How to get: Google Maps → search their address → Share → Embed a map → copy src URL
const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9!2d72.8776!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8c0d0e4e5a1%3A0x1234567890abcdef!2sBandra+Kurla+Complex%2C+Mumbai!5e0!3m2!1sen!2sin!4v1700000000000';

// ── REPLACE with client's actual Google Maps directions URL ──
// How to get: Google Maps → their address → right-click → Directions → copy URL
const GOOGLE_MAPS_DIRECTIONS = 'https://www.google.com/maps/dir//Bandra+Kurla+Complex,+Mumbai,+Maharashtra+400051';

// ── REPLACE with client's actual Google Maps place URL for "View larger map" ──
const GOOGLE_MAPS_PLACE = 'https://goo.gl/maps/YOUR_PLACE_ID'; // Replace with real link

const ADDRESS_FULL = '123 Financial District, Bandra Kurla Complex, Mumbai – 400051, Maharashtra';
const ADDRESS_SHORT = 'BKC, Mumbai – 400051';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact our CA firm in ${CITY}. Call ${PHONE}, WhatsApp, or visit us at ${ADDRESS_SHORT}. ICAI No: ${ICAI_NO}.`}
        keywords={`CA contact ${CITY}, CA phone ${CITY}, chartered accountant ${CITY} address`}
        canonical="/contact"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact Our {CITY} CA Team
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-6">
            Call, WhatsApp, or visit us at our {CITY} office. We respond within 2 hours on working days.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={PHONE_TEL}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all">
              <Phone className="w-5 h-5" /> {PHONE}
            </a>
            <a href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20need%20CA%20services`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all">
              <MessageCircle className="w-5 h-5" /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      {/* Main contact section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Contact details */}
            <div className="space-y-4">
              {/* Phone card — most prominent */}
              <div className="bg-blue-700 text-white rounded-2xl p-5 shadow-lg">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">📞 Call Us Directly</p>
                <a href={PHONE_TEL} className="text-white font-bold text-xl hover:text-amber-300 transition-colors block mb-1">{PHONE}</a>
                <a href={PHONE2_TEL} className="text-blue-200 hover:text-white transition-colors text-sm block">{PHONE2}</a>
                <p className="text-blue-300 text-xs mt-2">Mon–Sat · 9am–7pm</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Email</p>
                  <a href={`mailto:${EMAIL}`} className="text-blue-700 text-sm hover:underline block">{EMAIL}</a>
                  <a href="mailto:support@cafirm.com" className="text-gray-500 text-sm hover:underline block">support@cafirm.com</a>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Office Address</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{ADDRESS_FULL}</p>
                  <a href={GOOGLE_MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium mt-2 transition-colors">
                    <Navigation className="w-3 h-3" /> Get Directions on Google Maps
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">Working Hours</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mon – Fri</span>
                      <span className="font-medium text-gray-900">9:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-gray-900">10:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-red-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ICAI verification */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">ICAI Membership No</p>
                <p className="font-bold text-gray-900 text-sm">{ICAI_NO}</p>
                <a href="https://www.icai.org/post/know-your-ca" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 text-xs hover:underline mt-1">
                  Verify on ICAI Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* WhatsApp */}
              <a href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20need%20CA%20services%20in%20${CITY}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-4 rounded-xl transition-all w-full">
                <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
              </a>
            </div>

            {/* Center: Lead Form */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-5">We'll call back within 2 hours on working days.</p>
              <LeadForm />
            </div>

            {/* Right: Google Maps */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                {/* Map header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-700" />
                    <span className="font-semibold text-gray-900 text-sm">Find Us on Map</span>
                  </div>
                  <a href={GOOGLE_MAPS_PLACE} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    View larger <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Google Maps iframe — proper embed */}
                <iframe
                  title={`CA Firm Location - ${CITY}`}
                  src={GOOGLE_MAPS_EMBED}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Map footer with address + directions button */}
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm">CA Firm — {CITY} Office</p>
                  <p className="text-gray-500 text-xs mt-0.5 mb-3">{ADDRESS_FULL}</p>
                  <a href={GOOGLE_MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>

              {/* Urgent help */}
              <div className="bg-blue-900 text-white rounded-2xl p-5">
                <p className="font-bold mb-2">🚨 Urgent Tax Help?</p>
                <p className="text-blue-200 text-sm mb-3">Tax notices, GST raids, assessment hearings — we respond fast.</p>
                <a href={PHONE_TEL}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
                  <Phone className="w-4 h-4" /> Call {PHONE}
                </a>
              </div>

              {/* Payment shortcut */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="font-semibold text-gray-900 text-sm mb-3">💳 Pay Fees Online</p>
                <PaymentLinks compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Payment Section */}
      <PaymentLinks />
    </>
  );
}
