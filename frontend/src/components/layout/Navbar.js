import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, Scale, Lock } from 'lucide-react';
import { SERVICES } from '../../data';

const PHONE_DISPLAY = '+91 90801 34783';
const PHONE_TEL     = 'tel:+919080134783';
const ICAI_NO       = 'XXXXXX';
const WA_NUMBER     = '919080134783';

// ── Client Login Modal (self-contained, no extra file needed) ────────────────
function ClientLoginModal({ onClose }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,18,41,0.82)', backdropFilter: 'blur(6px)', animation: 'ca-fadeIn 0.2s ease' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes ca-fadeIn  { from{opacity:0}             to{opacity:1} }
        @keyframes ca-slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .ca-modal-input { width:100%; border:2px solid #e5e7eb; border-radius:12px; padding:10px 14px; font-size:14px; transition:border-color .2s,box-shadow .2s; outline:none; }
        .ca-modal-input:focus { border-color:#1e40af !important; box-shadow:0 0 0 3px rgba(30,64,175,0.1) !important; }
      `}</style>

      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
        style={{ animation: 'ca-slideUp 0.25s ease' }}>

        {/* Header */}
        <div className="px-7 pt-7 pb-6 relative" style={{ background: 'linear-gradient(135deg,#0b1d3a,#1a3a6c)' }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white text-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >×</button>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(200,151,42,0.2)', border: '1px solid rgba(200,151,42,0.4)' }}>
            <Lock className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
            Client Portal Login
          </h2>
          <p className="text-blue-200 text-sm">Access documents, compliance status &amp; appointment history</p>
        </div>

        {/* Body */}
        <div className="p-7">
          {!done ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required className="ca-modal-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required className="ca-modal-input" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{ background: loading ? '#1e3a8a' : '#0b1d3a', opacity: loading ? 0.75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Logging in...</>
                  : <><Lock className="w-4 h-4" /> Login to Client Portal</>
                }
              </button>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-3"
                style={{ background: '#f0fdf4', border: '1px solid #a7f3d0' }}>
                <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-green-700 text-xs font-medium">🔒 256-bit encrypted · Your data is completely secure</span>
              </div>
            </form>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ background: '#fef9ec', border: '2px solid #fcd34d' }}>🏛️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
                Portal Coming Soon
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                Client portal is being set up. Your CA firm will share your login details shortly via WhatsApp and email.
              </p>
              <a href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20need%20help%20with%20the%20client%20portal%20login.`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-2.5 rounded-xl text-sm transition-all mb-3"
                style={{ background: '#25D366' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.82L.057 23.27a.75.75 0 00.914.914l5.473-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                WhatsApp Your CA
              </a>
              <button onClick={onClose}
                className="w-full border-2 border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          )}
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
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-700 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
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
                  className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 text-blue-700 font-semibold py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors">
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
