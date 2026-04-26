import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scale, LogOut, FileText, Calendar, MessageSquare, Upload, ChevronRight, Bell } from 'lucide-react';
import SEO from '../../components/common/SEO';

const QUICK_LINKS = [
  { icon: Upload,        label: 'Upload Documents',   desc: 'Send files to your CA',              to: '/upload-document' },
  { icon: Calendar,      label: 'Book Appointment',   desc: 'Schedule a CA meeting',              to: '/book-appointment' },
  { icon: MessageSquare, label: 'Tax Q&A',            desc: 'Ask a compliance question',          to: '/compliance-query' },
  { icon: FileText,      label: 'Blog & Updates',     desc: 'Latest tax news',                    to: '/blog' },
];

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <>
      <SEO title="My Dashboard" description="Your CA firm client dashboard" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">CA Firm</p>
              <p className="text-blue-600 text-xs leading-none">Client Portal</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]}
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Welcome */}
          <div className="mb-7">
            <p className="text-gray-500 text-sm">Welcome back 👋</p>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>
              {user?.name}
            </h1>
          </div>

          {/* Compliance alert */}
          {user?.nextDeadline && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">⏰</div>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Upcoming Deadline</p>
                <p className="text-amber-700 text-sm">{user.nextDeadline}</p>
              </div>
              <Link to="/book-appointment"
                className="ml-auto text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                Book CA
              </Link>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
            {[
              { label: 'Plan',      value: user?.plan || 'Starter',     color: 'blue' },
              { label: 'PAN',       value: user?.pan || 'Not set',       color: 'gray' },
              { label: 'CA Status', value: 'Active',                     color: 'green' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
                <p className={`font-bold text-sm ${
                  color === 'blue' ? 'text-blue-700' : color === 'green' ? 'text-green-600' : 'text-gray-700'
                }`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="text-base font-bold text-gray-700 mb-3 uppercase tracking-wider text-xs">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {QUICK_LINKS.map(({ icon: Icon, label, desc, to }) => (
              <Link key={to} to={to}
                className="group flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-gray-400 text-xs truncate">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>

          {/* Contact CA */}
          <div className="bg-blue-900 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
              Need to speak with your CA?
            </h3>
            <p className="text-blue-200 text-sm mb-4">Direct line to your assigned Chartered Accountant</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/919080134783" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.524 5.82L.057 23.27a.75.75 0 00.914.914l5.473-1.453A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                WhatsApp
              </a>
              <Link to="/book-appointment"
                className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                📅 Book Appointment
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
