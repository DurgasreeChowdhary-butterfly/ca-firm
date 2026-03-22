import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getLeads } from '../../utils/api';
import { Users, Calendar, FileText, TrendingUp, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ icon: Icon, label, value, sub, color, to }) => (
  <Link to={to} className={`card flex items-center gap-4 hover:shadow-lg transition-shadow border-l-4 ${color}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.replace('border-l-', 'bg-').replace('-600', '-50').replace('-500', '-50')}`}>
      <Icon className={`w-6 h-6 ${color.replace('border-l-', 'text-')}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
    <ArrowRight className="w-4 h-4 text-gray-300" />
  </Link>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getLeads({ limit: 5 })])
      .then(([statsRes, leadsRes]) => {
        setStats(statsRes.data.data);
        setRecentLeads(leadsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your firm's activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Leads" value={stats?.totalLeads} sub={`${stats?.newLeads} new`} color="border-l-blue-600" to="/admin/leads" />
        <StatCard icon={AlertCircle} label="New Leads" value={stats?.newLeads} sub="Awaiting contact" color="border-l-red-500" to="/admin/leads" />
        <StatCard icon={Calendar} label="Appointments" value={stats?.totalAppts} sub={`${stats?.pendingAppts} pending`} color="border-l-green-600" to="/admin/appointments" />
        <StatCard icon={Clock} label="Pending Appts" value={stats?.pendingAppts} sub="Need confirmation" color="border-l-amber-500" to="/admin/appointments" />
        <StatCard icon={FileText} label="Blog Posts" value={stats?.totalBlogs} sub={`${stats?.publishedBlogs} published`} color="border-l-purple-600" to="/admin/blogs" />
        <StatCard icon={TrendingUp} label="Published Blogs" value={stats?.publishedBlogs} sub="Live on website" color="border-l-indigo-500" to="/admin/blogs" />
      </div>

      {/* Recent Leads */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Recent Leads</h2>
          <Link to="/admin/leads" className="text-sm text-blue-700 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name','Email','Service','Status','Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLeads.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No leads yet</td></tr>
              ) : recentLeads.map(lead => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="py-3 pr-4 text-gray-500 max-w-[150px] truncate">{lead.email}</td>
                  <td className="py-3 pr-4 text-gray-600">{lead.service}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                      lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-700' :
                      lead.status === 'converted' ? 'bg-green-50 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Blog Post', to: '/admin/blogs/new', icon: '✍️' },
          { label: 'View Leads', to: '/admin/leads', icon: '👥' },
          { label: 'Appointments', to: '/admin/appointments', icon: '📅' },
          { label: 'Visit Website', to: '/', icon: '🌐', external: true },
        ].map(({ label, to, icon, external }) => (
          <Link key={label} to={to} target={external ? '_blank' : undefined}
            className="card text-center hover:shadow-md hover:border-blue-200 border border-transparent cursor-pointer transition-all">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs font-semibold text-gray-700">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
