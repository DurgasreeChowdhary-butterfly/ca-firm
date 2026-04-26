import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';
import {
  Scale, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  ArrowLeft, Shield, CheckCircle, AlertCircle, Loader,
} from 'lucide-react';

// ── Mock OTP (in real app, sent via SMS/email) ────────────────────────────────
const MOCK_OTP = '123456';

// ── Input component ───────────────────────────────────────────────────────────
function Input({ label, type = 'text', value, onChange, placeholder, icon: Icon, autoFocus, helper }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full border-2 border-gray-200 rounded-xl py-2.5 text-sm transition-all
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'}`}
        />
        {isPassword && (
          <button type="button" tabIndex={-1}
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
    </div>
  );
}

// ── Error / Success banners ───────────────────────────────────────────────────
function ErrorBanner({ msg })   { return msg ? <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>{msg}</div> : null; }
function SuccessBanner({ msg }) { return msg ? <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"><CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0"/>{msg}</div> : null; }

// ── OTP Input — 6 boxes ───────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const refs = Array.from({ length: 6 }, () => useRef(null)); // eslint-disable-line
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { onChange(value.slice(0, i) + value.slice(i + 1)); }
      else if (i > 0) { refs[i - 1].current?.focus(); onChange(value.slice(0, i - 1) + value.slice(i)); }
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = digits.map((d, idx) => idx === i ? e.key : d).join('').slice(0, 6);
    onChange(next);
    if (i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = e => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d || ''}
          autoFocus={i === 0}
          onChange={() => {}}
          onKeyDown={e => handleKey(i, e)}
          className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl transition-all
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            ${d ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700'}`}
        />
      ))}
    </div>
  );
}

// ── Role badge (shown after role detection) ───────────────────────────────────
function RolePill({ email }) {
  if (!email.includes('@')) return null;
  const role = email.endsWith('@cafirm.com') ? 'admin' : 'client';
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
      role === 'admin'
        ? 'bg-amber-50 text-amber-700 border border-amber-200'
        : 'bg-blue-50 text-blue-700 border border-blue-200'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-amber-500' : 'bg-blue-500'}`} />
      {role === 'admin' ? '🏛️ Admin Account' : '👤 Client Account'}
    </div>
  );
}

// ── Main Auth Page ────────────────────────────────────────────────────────────
// view: 'login' | 'signup' | 'forgot' | 'otp' | 'reset-done'
export default function AuthPage({ defaultView = 'login' }) {
  const [view,     setView]     = useState(defaultView);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [otp,      setOtp]      = useState('');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login, signup, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) navigate(isAdmin ? '/admin' : '/client/dashboard', { replace: true });
  }, [isLoggedIn, isAdmin, navigate]);

  const go = v => { setView(v); setError(''); setSuccess(''); };

  // ── Handle Login ──────────────────────────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password'); return; }
    setLoading(true); setError('');
    try {
      const session = await login(email, password);
      navigate(session.role === 'admin' ? '/admin' : '/client/dashboard', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Handle Sign Up ────────────────────────────────────────────────────────
  const handleSignup = async e => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) { setError('Please fill all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const session = await signup(name, email, password);
      navigate(session.role === 'admin' ? '/admin' : '/client/dashboard', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  // ── Handle Forgot Password (sends mock OTP) ───────────────────────────────
  const handleForgot = async e => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSuccess(`Verification code sent to ${email}`);
    setTimeout(() => go('otp'), 1200);
  };

  // ── Handle OTP Verification ───────────────────────────────────────────────
  const handleOTP = async e => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    if (otp !== MOCK_OTP) { setError(`Incorrect code. (Hint: use ${MOCK_OTP})`); return; }
    go('reset-done');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SHARED LAYOUT
  // ─────────────────────────────────────────────────────────────────────────
  const viewTitles = {
    login:      { h: 'Welcome Back',             sub: 'Sign in to your CA Firm account' },
    signup:     { h: 'Create Account',           sub: 'Join the CA Firm client portal' },
    forgot:     { h: 'Reset Password',           sub: 'We\'ll send a verification code to your email' },
    otp:        { h: 'Enter Verification Code',  sub: `Code sent to ${email}` },
    'reset-done': { h: 'Password Reset!',        sub: 'Your password has been reset successfully' },
  };
  const { h, sub } = viewTitles[view];

  return (
    <>
      <SEO title={h} description="CA Firm secure client and admin login portal" />

      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0b1d3a 0%, #1a3a6c 100%)' }}>

        {/* ── Nav bar ── */}
        <div className="px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue-900" />
            </div>
            <span className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">CA Firm</span>
          </Link>
          <Link to="/" className="text-blue-300 hover:text-white text-sm transition-colors">← Back to Website</Link>
        </div>

        {/* ── Card ── */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                  {view === 'reset-done'
                    ? <CheckCircle className="w-7 h-7 text-green-600" />
                    : view === 'otp'
                    ? <Shield className="w-7 h-7 text-blue-700" />
                    : <Scale className="w-7 h-7 text-blue-700" />
                  }
                </div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>{h}</h1>
                <p className="text-gray-500 text-sm mt-1">{sub}</p>

                {/* Role pill for login/signup when email typed */}
                {(view === 'login' || view === 'signup') && email.includes('@') && (
                  <div className="mt-3"><RolePill email={email} /></div>
                )}
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-4">

                {/* ── LOGIN ── */}
                {view === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <ErrorBanner msg={error} />
                    <Input label="Email Address" type="email" value={email} onChange={setEmail}
                      placeholder="you@example.com" icon={Mail} autoFocus
                      helper="@cafirm.com email → Admin  ·  Others → Client" />
                    <Input label="Password" type="password" value={password} onChange={setPassword}
                      placeholder="••••••••" icon={Lock} />
                    <div className="flex items-center justify-between">
                      <span />
                      <button type="button" onClick={() => go('forgot')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Forgot password?
                      </button>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all">
                      {loading
                        ? <><Loader className="w-4 h-4 animate-spin" /> Signing in...</>
                        : <>Sign In <ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                    {/* Demo hints */}
                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs space-y-1">
                      <p className="font-semibold text-gray-600 mb-1">Demo credentials:</p>
                      <p className="text-gray-500">🏛️ Admin: <code className="bg-gray-100 px-1 rounded">admin@cafirm.com</code> / <code className="bg-gray-100 px-1 rounded">Admin@123456</code></p>
                      <p className="text-gray-500">👤 Client: <code className="bg-gray-100 px-1 rounded">rajesh@gmail.com</code> / <code className="bg-gray-100 px-1 rounded">Client@123</code></p>
                    </div>
                  </form>
                )}

                {/* ── SIGN UP ── */}
                {view === 'signup' && (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <ErrorBanner msg={error} />
                    <Input label="Full Name" value={name} onChange={setName}
                      placeholder="Rajesh Kumar" icon={User} autoFocus />
                    <Input label="Email Address" type="email" value={email} onChange={setEmail}
                      placeholder="you@example.com" icon={Mail}
                      helper="@cafirm.com → Admin account  ·  All others → Client account" />
                    <Input label="Password" type="password" value={password} onChange={setPassword}
                      placeholder="Min. 6 characters" icon={Lock} />
                    <Input label="Confirm Password" type="password" value={confirm} onChange={setConfirm}
                      placeholder="Repeat password" icon={Lock} />
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all">
                      {loading
                        ? <><Loader className="w-4 h-4 animate-spin" /> Creating account...</>
                        : <>Create Account <ArrowRight className="w-4 h-4" /></>
                      }
                    </button>
                  </form>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {view === 'forgot' && (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <ErrorBanner msg={error} />
                    <SuccessBanner msg={success} />
                    <Input label="Email Address" type="email" value={email} onChange={setEmail}
                      placeholder="you@example.com" icon={Mail} autoFocus />
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all">
                      {loading
                        ? <><Loader className="w-4 h-4 animate-spin" /> Sending code...</>
                        : <><Mail className="w-4 h-4" /> Send Verification Code</>
                      }
                    </button>
                    <button type="button" onClick={() => go('login')}
                      className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to Sign In
                    </button>
                  </form>
                )}

                {/* ── OTP VERIFICATION ── */}
                {view === 'otp' && (
                  <form onSubmit={handleOTP} className="space-y-5">
                    <ErrorBanner msg={error} />
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-4">Enter the 6-digit code we sent to <strong className="text-gray-800">{email}</strong></p>
                      <OTPInput value={otp} onChange={setOtp} />
                    </div>
                    <button type="submit" disabled={loading || otp.length < 6}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all">
                      {loading
                        ? <><Loader className="w-4 h-4 animate-spin" /> Verifying...</>
                        : <><Shield className="w-4 h-4" /> Verify Code</>
                      }
                    </button>
                    <div className="text-center text-sm text-gray-400">
                      Didn't receive the code?{' '}
                      <button type="button" className="text-blue-600 font-medium hover:underline"
                        onClick={() => { setOtp(''); setError(''); }}>
                        Resend
                      </button>
                    </div>
                    <p className="text-center text-xs text-gray-400">
                      Demo hint: use <code className="bg-gray-100 px-1 rounded">{MOCK_OTP}</code>
                    </p>
                  </form>
                )}

                {/* ── RESET DONE ── */}
                {view === 'reset-done' && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Your password has been reset successfully. Sign in with your new password.
                    </p>
                    <button onClick={() => go('login')}
                      className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all">
                      <ArrowRight className="w-4 h-4" /> Continue to Sign In
                    </button>
                  </div>
                )}

              </div>

              {/* Footer toggle */}
              {(view === 'login' || view === 'signup') && (
                <div className="px-8 pb-6 text-center text-sm text-gray-500">
                  {view === 'login'
                    ? <>Don't have an account?{' '}<button onClick={() => go('signup')} className="text-blue-600 font-semibold hover:underline">Sign Up</button></>
                    : <>Already have an account?{' '}<button onClick={() => go('login')} className="text-blue-600 font-semibold hover:underline">Sign In</button></>
                  }
                </div>
              )}
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 mt-5 text-blue-300 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              256-bit encrypted · ICAI compliant · Your data is secure
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
