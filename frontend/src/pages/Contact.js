import React from 'react';
import SEO from '../components/common/SEO';
import LeadForm from '../components/common/LeadForm';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const WHATSAPP = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';

export default function Contact() {
  return (
    <>
      <SEO title="Contact Us" description="Get in touch with our CA team. Office in Mumbai — call, email, or book an appointment for expert financial advice." canonical="/contact" />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider mb-2">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">We're here to help. Reach out via phone, email, or fill the form and we'll call you back.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Contact info */}
            <div className="space-y-5">
              {[
                { icon: Phone, title: 'Phone', lines: ['+91 98765 43210', '+91 98765 43211'], href: 'tel:+919876543210' },
                { icon: Mail, title: 'Email', lines: ['info@cafirm.com', 'support@cafirm.com'], href: 'mailto:info@cafirm.com' },
                { icon: MapPin, title: 'Office', lines: ['123 Financial District,', 'Bandra Kurla Complex, Mumbai – 400051'] },
                { icon: Clock, title: 'Working Hours', lines: ['Mon – Fri: 9:00 AM – 7:00 PM', 'Sat: 10:00 AM – 4:00 PM', 'Sun: Closed'] },
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

              <a
                href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20need%20CA%20services`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-4 rounded-xl transition-all w-full"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Center: Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-5">We typically respond within 2 hours on working days.</p>
              <LeadForm />
            </div>

            {/* Right: Map */}
            <div className="space-y-5">
              <div className="card overflow-hidden p-0">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.9!2d72.8776!3d19.0596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM0LjYiTiA3MsKwNTInMzkuNCJF!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%" height="300"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-sm">CA Firm – Head Office</p>
                  <p className="text-gray-500 text-xs">123 Financial District, BKC, Mumbai – 400051</p>
                </div>
              </div>
              <div className="card bg-blue-900 text-white">
                <p className="font-bold mb-2">Need Urgent Help?</p>
                <p className="text-blue-200 text-sm mb-3">For time-sensitive tax matters like notices, assessments, or GST emergencies.</p>
                <a href="tel:+919876543210" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-4 py-2 rounded-lg text-sm transition-all">
                  <Phone className="w-4 h-4" /> Call Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
