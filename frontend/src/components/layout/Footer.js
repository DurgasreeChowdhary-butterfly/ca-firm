import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Scale, Linkedin, Facebook, Instagram } from 'lucide-react';
import { SERVICES } from '../../data';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">CA Firm</p>
                <p className="text-blue-400 text-[10px] leading-none">Chartered Accountants</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your trusted partner for all financial and compliance needs. ICAI-registered firm with 15+ years of excellence.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog & Insights' },
                { to: '/contact', label: 'Contact Us' },
                { to: '/book-appointment', label: 'Book Appointment' },
                { to: '/admin', label: 'Admin Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-white transition-colors text-sm">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-2.5 text-gray-400 hover:text-white transition-colors group">
                  <Phone className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                  <span className="text-sm">+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@cafirm.com" className="flex items-start gap-2.5 text-gray-400 hover:text-white transition-colors group">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                  <span className="text-sm">info@cafirm.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">123 Financial District,<br />BKC, Mumbai – 400051</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Working Hours</p>
              <p className="text-sm text-white font-medium">Mon–Fri: 9am – 7pm</p>
              <p className="text-sm text-gray-300">Sat: 10am – 4pm</p>
              <p className="text-xs text-gray-500 mt-1">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} CA Firm. All rights reserved. ICAI Registration No. XXXXXX</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-gray-300 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
