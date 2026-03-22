import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Scale } from 'lucide-react';
import { SERVICES } from '../../data';

// ── UPDATE THESE for your client ──
const PHONE_DISPLAY = '+91 98765 43210';
const PHONE_TEL = 'tel:+919876543210';
const ICAI_NO = 'XXXXXX';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 ${isActive ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'}`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>

      {/* Top bar — phone + ICAI number visible on every page */}
      <div className="bg-blue-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-blue-300 hidden sm:block">ICAI Membership No: {ICAI_NO}</span>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <span className="hidden sm:inline text-blue-300">Mon–Sat 9am–7pm</span>
            {/* PHONE — clickable tel: link */}
            <a href={PHONE_TEL} className="flex items-center gap-1 hover:text-amber-300 transition-colors font-semibold">
              📞 {PHONE_DISPLAY}
            </a>
            <span className="text-blue-500">·</span>
            <a href="mailto:info@cafirm.com" className="hover:text-amber-300 transition-colors hidden sm:inline">
              ✉️ info@cafirm.com
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-gray-900 text-base leading-none">CA Firm</p>
            <p className="text-blue-700 text-[10px] font-medium leading-none">Mumbai · ICAI Reg: {ICAI_NO}</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/" end className={linkCls}>Home</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(o => !o)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${servicesOpen ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'}`}
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-1 pt-1">Our Services</p>
                {SERVICES.map(s => (
                  <Link key={s.id} to={`/services/${s.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors group">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.price}</p>
                    </div>
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                  <Link to="/services" className="block text-center text-xs font-semibold text-blue-700 hover:text-blue-900">
                    View All Services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/blog" className={linkCls}>Blog</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact</NavLink>
        </div>

        {/* Desktop CTA — phone always visible */}
        <div className="hidden lg:flex items-center gap-3">
          <a href={PHONE_TEL}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span className="font-semibold">{PHONE_DISPLAY}</span>
          </a>
          <Link to="/book-appointment"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Book Appointment
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {[
              { to: '/', label: 'Home', exact: true },
              { to: '/about', label: 'About' },
              { to: '/services', label: 'All Services' },
              ...SERVICES.map(s => ({ to: `/services/${s.id}`, label: `  ${s.icon} ${s.title}`, sub: true })),
              { to: '/blog', label: 'Blog' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label, exact, sub }) => (
              <NavLink key={to} to={to} end={exact}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm transition-colors ${sub ? 'pl-6 text-gray-500' : 'font-medium'} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`
                }>
                {label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
              {/* Phone in mobile menu — critical */}
              <a href={PHONE_TEL}
                className="flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">
                📞 Call Now: {PHONE_DISPLAY}
              </a>
              <Link to="/book-appointment"
                className="block text-center border border-gray-300 text-gray-700 font-medium py-3 rounded-xl text-sm hover:bg-gray-50">
                📅 Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
