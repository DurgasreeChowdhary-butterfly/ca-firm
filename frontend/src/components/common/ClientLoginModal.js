import React, { useState, useEffect } from 'react';

export default function ClientLoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const handleClose = () => {
    setSubmitted(false);
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(7,18,41,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .login-modal-input:focus { border-color: #1A3A6C !important; box-shadow: 0 0 0 3px rgba(26,58,108,0.1) !important; outline: none !important; }
      `}</style>

      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '420px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
        animation: 'slideUp 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0B1D3A, #1A3A6C)',
          padding: '28px 28px 24px',
          position: 'relative',
        }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              width: '32px', height: '32px', borderRadius: '50%',
              color: '#fff', cursor: 'pointer', fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ×
          </button>

          {/* Lock icon */}
          <div style={{
            width: '52px', height: '52px',
            background: 'rgba(200,151,42,0.2)', border: '1px solid rgba(200,151,42,0.4)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '14px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8B84B" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px', fontWeight: '700', color: '#fff',
            marginBottom: '6px',
          }}>
            Client Portal Login
          </h2>
          <p style={{ color: '#a0b4c8', fontSize: '13px', lineHeight: 1.5 }}>
            Access your documents, compliance status, and appointment history
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          {!submitted ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="login-modal-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid #E2E8F0', borderRadius: '10px',
                    fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                    color: '#1e293b', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="login-modal-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '11px 14px',
                    border: '1.5px solid #E2E8F0', borderRadius: '10px',
                    fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
                    color: '#1e293b', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', background: '#0B1D3A', color: '#fff',
                  border: 'none', padding: '13px',
                  borderRadius: '12px', fontSize: '15px', fontWeight: '700',
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Logging in...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                    </svg>
                    Login to Client Portal
                  </>
                )}
              </button>

              {/* Trust badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                marginTop: '14px',
                background: '#F0FDF4', border: '1px solid #A7F3D0',
                borderRadius: '8px', padding: '8px 12px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span style={{ fontSize: '12px', color: '#065F46', fontWeight: '500' }}>
                  256-bit encrypted · Your data is completely secure
                </span>
              </div>
            </form>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: '64px', height: '64px',
                background: '#FEF3C7', border: '2px solid #FCD34D',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
              }}>
                🏛️
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px', fontWeight: '700', color: '#0B1D3A',
                marginBottom: '10px',
              }}>
                Portal Coming Soon
              </h3>
              <p style={{
                fontSize: '14px', color: '#64748B', lineHeight: 1.7,
                marginBottom: '20px',
              }}>
                Client portal is being set up. Your CA firm will share your login details shortly via WhatsApp and email.
              </p>
              <a
                href="https://wa.me/919080134783?text=Hi%2C%20I%20need%20help%20accessing%20the%20client%20portal."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#25D366', color: '#fff',
                  padding: '11px 20px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '700',
                  textDecoration: 'none', marginBottom: '10px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.82L.057 23.27a.75.75 0 00.914.914l5.473-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                Contact Your CA on WhatsApp
              </a>
              <br />
              <button
                onClick={handleClose}
                style={{
                  background: 'none', border: '1.5px solid #E2E8F0',
                  color: '#64748B', padding: '9px 20px', borderRadius: '10px',
                  fontSize: '13px', cursor: 'pointer', marginTop: '4px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
