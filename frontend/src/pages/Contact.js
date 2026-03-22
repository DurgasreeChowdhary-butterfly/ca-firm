import React from 'react';
import SEO from '../components/common/SEO';
import LeadForm from '../components/common/LeadForm';
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';

const WHATSAPP = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';
const PHONE = '+91 98765 43210';
const PHONE_TEL = 'tel:+919876543210';
const PHONE2 = '+91 98765 43211';
const PHONE2_TEL = 'tel:+919876543211';
const EMAIL = 'info@cafirm.com';
const CITY = 'Mumbai';
const ICAI_NO = 'XXXXXX';

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact our CA firm in ${CITY}. Call ${PHONE}, WhatsApp, or fill the form. ICAI No: ${ICAI_NO}. Office at BKC, ${CITY}.`}
        keywords={`CA contact ${CITY}, CA phone number ${CITY}, chartered accountant ${CITY} contact`}
        canonical="/contact"
      />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us in {CITY}</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-5">Reach out via phone, WhatsApp, or fill the form. We respond within 2 hours on working days.</p>
          {/* Phone prominent in hero */}
          <a href={PHONE_TEL} className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-all">
            <Phone className="w-5 h-5" /> {PHONE}
          </a>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Contact info */}
            <div className="space-y-4">
              {/* Phone — prominent, clickable tel: link */}
              <div className="card bg-blue-700 text-white">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">📞 Call Us Directly</p>
                <a href={PHONE_TEL} className="text-white font-bold text-xl hover:text-amber-300 transition-colors block">{PHONE}</a>
                <a href={PHONE2_TEL} className="text-blue-200 hover:text-white transition-colors text-sm mt-1 block">{PHONE2}</a>
                <p className="text-blue-300 text-xs mt-2">Mon–Sat · 9am–7pm · {CITY}</p>
              </div>

              {[
                { icon: Mail, title: 'Email', lines: [EMAIL, 'support@cafirm.com'], href: `mailto:${EMAIL}` },
                { icon: MapPin, title: 'Office Address', lines: ['123 Financial District,', `Bandra Kurla Complex, ${CITY} – 400051`] },
                { icon: Clock, title: 'Working Hours', lines: ['Mon–Fri: 9:00 AM – 7:00 PM', 'Sat: 10:00 AM – 4:00 PM', 'Sun: Closed'] },
              ].map(({ icon: Icon, title, lines, href }) => (
                <div key={title} className="card flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                    {lines.map((line, i) => (
                      href && i === 0
                        ? <a key={i} href={href} className="text-blue-700 text-sm hover:underline block">{line}</a>
                        : <p key={i} className="text-gray-500 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* ICAI verification */}
              <div className="card border border-blue-100">
                <p className="text-xs text-gray-500 mb-1">ICAI Membership No</p>
                <p className="font-bold text-gray-900">{ICAI_NO}</p>
                <a href="https://www.icai.org/post/know-your-ca" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 text-xs hover:underline mt-1">
                  Verify on ICAI Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20need%20CA%20services%20in%20${CITY}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-4 rounded-xl transition-all w-full"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us Now
              </a>
            </div>

            {/* Center: Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-5">We respond within 2 hours on working days.</p>
              <LeadForm />
            </div>

            {/* Right: Map + urgent */}
            <div className="space-y-5">
              <div className="card overflow-hidden p-0">
                <iframe
                  title={`CA Firm Office Location ${CITY}`}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9!2d72.8776!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM0LjYiTiA3MsKwNTInMzkuNCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%" height="280"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm">CA Firm – {CITY} Office</p>
                  <p className="text-gray-500 text-xs">123 Financial District, BKC, {CITY} – 400051</p>
                </div>
              </div>

              <div className="card bg-blue-900 text-white">
                <p className="font-bold mb-2">Need Urgent Help?</p>
                <p className="text-blue-200 text-sm mb-3">Tax notices, assessment hearings, GST emergencies — we respond fast.</p>
                <a href={PHONE_TEL}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-4 py-2.5 rounded-lg text-sm transition-all">
                  <Phone className="w-4 h-4" /> Call {PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
