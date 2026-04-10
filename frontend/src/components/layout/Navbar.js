import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Scale, Lock } from 'lucide-react';
import { SERVICES } from '../../data';

const PHONE_DISPLAY = '+91 90801 34783';
const PHONE_TEL     = 'tel:+919080134783';
const ICAI_NO       = 'XXXXXX';
const WA_NUMBER     = '919080134783';

// ── Client Login Modal — Portal Preview ─────────────────────────────────────
function ClientLoginModal({ onClose }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 800);
  };

  const PORTAL_FEATURES = [
    { icon: '📁', title: 'My Documents',        desc: 'Upload and access all your tax documents securely' },
    { icon: '📅', title: 'My Appointments',      desc: 'View and manage your upcoming CA meetings' },
    { icon: '📊', title: 'Compliance Dashboard', desc: 'Track your GST and ITR filing deadlines' },
    { icon: '💬', title: 'Ask My CA',            desc: 'Send queries directly to your CA firm' },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,18,41,0.85)', backdropFilter: 'blur(6px)', animation: 'ca-fadeIn 0.2s ease' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes ca-fadeIn  { from{opacity:0}             to{opacity:1} }
        @keyframes ca-slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .ca-email-input { width:100%; border:1.5px solid #e5e7eb; border-radius:10px; padding:10px 14px; font-size:14px; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
        .ca-email-input:focus { border-color:#C9943A; box-shadow:0 0 0 3px rgba(201,148,58,0.12); }
      `}</style>

      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        style={{ animation: 'ca-slideUp 0.25s ease', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* ── Header — dark navy ── */}
        <div className="relative px-7 pt-7 pb-6"
          style={{ background: 'linear-gradient(135deg, #0b1d3a 0%, #1a3a6c 100%)' }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >×</button>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(201,148,58,0.2)', border: '1px solid rgba(201,148,58,0.5)' }}>
            <Lock className="w-6 h-6" style={{ color: '#e8b84b' }} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Client Portal Login
          </h2>
          <p style={{ color: '#a0b4c8', fontSize: '13px' }}>Your secure window into your CA firm</p>
        </div>

        {/* ── Portal Preview Cards ── */}
        <div className="px-6 pt-5 pb-4" style={{ background: '#f8fafc' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            What you'll access
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '4px' }}>
            {PORTAL_FEATURES.map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: '#fff', borderRadius: '12px', padding: '14px 12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0b1d3a', marginBottom: '3px', lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Login form / done state ── */}
        <div className="px-6 pb-6">
          {!done ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="ca-email-input"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                style={{
                  background: loading ? '#b8842a' : '#C9943A',
                  color: '#0b1d3a',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                }}
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(11,29,58,0.3)', borderTopColor: '#0b1d3a' }} /> Checking...</>
                  : <>Login to Portal</>
                }
              </button>
              {/* Lock badge */}
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <svg className="flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span style={{ fontSize: '11px', color: '#166534', fontWeight: 500 }}>
                  🔒 256-bit encrypted · Your data is completely private
                </span>
              </div>
            </form>
          ) : (
            <div>
              <div className="rounded-xl p-4 mb-4 text-sm leading-relaxed"
                style={{ background: '#fef9ec', border: '1px solid #fcd34d', color: '#92400e' }}>
                Your CA firm will share your portal access via WhatsApp. Contact them directly to get started.
              </div>
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl mb-3"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '11px', color: '#166534', fontWeight: 500 }}>
                  🔒 256-bit encrypted · Your data is completely private
                </span>
              </div>
            </div>
          )}

          {/* ── WhatsApp + Close ── */}
          <a href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20need%20access%20to%20the%20client%20portal.`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl text-sm transition-all mt-3"
            style={{ background: '#25D366', textDecoration: 'none', display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1ebe5c'}
            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.82L.057 23.27a.75.75 0 00.914.914l5.473-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
            </svg>
            WhatsApp Your CA Firm
          </a>
          <button onClick={onClose}
            className="w-full font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
            style={{ background: 'none', border: '1.5px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [loginOpen,    setLoginOpen]    = useState(false);
  const dropdownRef = useRef(null);
  const location    = useLocation();

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
    <>
      {loginOpen && <ClientLoginModal onClose={() => setLoginOpen(false)} />}

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>

        {/* Top bar */}
        <div className="bg-blue-900 text-white text-xs py-1.5 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-1">
            <span className="text-blue-300 hidden sm:block">ICAI Membership No: {ICAI_NO}</span>
            <div className="flex items-center gap-3 mx-auto sm:mx-0 flex-wrap justify-center">
              <span className="hidden sm:inline text-blue-300">Mon–Sat 9am–7pm</span>
              <a href={PHONE_TEL} className="flex items-center gap-1 hover:text-amber-300 transition-colors font-semibold">
                <Phone className="w-3 h-3" /> {PHONE_DISPLAY}
              </a>
              <span className="text-blue-500">·</span>
              <a href="mailto:info@cafirm.com" className="hover:text-amber-300 transition-colors hidden sm:inline">
                info@cafirm.com
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between overflow-hidden">

          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-gray-900 text-base leading-none">CA Firm</p>
              <p className="text-blue-700 text-[10px] font-medium leading-none">Mumbai · ICAI Reg: {ICAI_NO}</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-4">
            <NavLink to="/" end className={linkCls}>Home</NavLink>
            <NavLink to="/about" className={linkCls}>About</NavLink>

            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setServicesOpen(o => !o)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${servicesOpen ? 'text-blue-700' : 'text-gray-700 hover:text-blue-700'}`}>
                Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
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

            {/* ── Get Your Website ── */}
            <a href="/onboard.html"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all whitespace-nowrap">
              Get Your Website ✦
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {/* ── Client Login button ── */}
            <button onClick={() => setLoginOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-all"
              style={{ background: '#fff', color: '#0D1B2A', border: '1.5px solid #C9943A' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C9943A'; e.currentTarget.style.color = '#0D1B2A'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0D1B2A'; }}
            >
              <Lock className="w-3.5 h-3.5" /> Client Login
            </button>
            <a href={PHONE_TEL} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-700 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold">{PHONE_DISPLAY}</span>
            </a>
            <Link to="/book-appointment"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Book Appointment
            </Link>
          </div>

          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {[
                { to: '/',         label: 'Home',         exact: true },
                { to: '/about',    label: 'About' },
                { to: '/services', label: 'All Services' },
                ...SERVICES.map(s => ({ to: `/services/${s.id}`, label: `  ${s.icon} ${s.title}`, sub: true })),
                { to: '/blog',     label: 'Blog' },
                { to: '/contact',  label: 'Contact' },
              ].map(({ to, label, exact, sub }) => (
                <NavLink key={to} to={to} end={exact}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm transition-colors ${sub ? 'pl-6 text-gray-500' : 'font-medium'} ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`
                  }>
                  {label}
                </NavLink>
              ))}
              <a href="/onboard.html"
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors">
                ✦ Get Your Website
              </a>
              <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
                <button onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm transition-all"
                  style={{ background: '#fff', color: '#0D1B2A', border: '1.5px solid #C9943A' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#C9943A'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                >
                  <Lock className="w-4 h-4" /> Client Login
                </button>
                <a href={PHONE_TEL}
                  className="flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">
                  <Phone className="w-4 h-4" /> Call Now: {PHONE_DISPLAY}
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
    </>
  );
}
