import React, { useState, useEffect } from 'react';
import { getAdminComplianceQueries, updateComplianceQuery } from '../../../utils/api';
import { Search, MessageSquare, CheckCircle, Clock, AlertCircle, X, ChevronDown } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: 'bg-yellow-50 text-yellow-700', answered: 'bg-green-50 text-green-700', escalated: 'bg-red-50 text-red-700' };
const CAT_COLORS = { GST: 'bg-blue-50 text-blue-700', ITR: 'bg-purple-50 text-purple-700', TDS: 'bg-amber-50 text-amber-700', Audit: 'bg-green-50 text-green-700', General: 'bg-gray-100 text-gray-600' };

export default function ComplianceEngine() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', category: '', page: 1 });
  const [pagination, setPagination] = useState({});
  const [selected, setSelected] = useState(null);
  const [editAnswer, setEditAnswer] = useState('');
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAdminComplianceQueries(filters)
      .then(r => { setQueries(r.data.data); setPagination(r.data.pagination); })
      .catch(() => toast.error('Failed to load queries'))
      .finally(() => setLoading(false));
  }, [filters]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await updateComplianceQuery(selected._id, { answer: editAnswer, caReviewNote: editNote, status: 'answered' });
      toast.success('Query answered');
      setSelected(null);
      setFilters(f => ({ ...f })); // re-trigger fetch
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const openQuery = (q) => { setSelected(q); setEditAnswer(q.answer || ''); setEditNote(q.caReviewNote || ''); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Compliance Engine</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} client queries · AI-powered GST & Tax answers</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">AI Engine Active</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Queries', val: pagination.total || 0, icon: MessageSquare, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'AI Answered', val: queries.filter(q => q.status === 'answered').length, icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Pending Review', val: queries.filter(q => q.status === 'pending').length, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          {['pending', 'answered', 'escalated'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          {['GST', 'ITR', 'TDS', 'Audit', 'Company Law', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Query list */}
      <div className="space-y-3">
        {loading ? <LoadingSpinner /> : queries.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No compliance queries yet</p>
          </div>
        ) : queries.map(q => (
          <div key={q._id} className="card cursor-pointer hover:shadow-md transition-shadow" onClick={() => openQuery(q)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CAT_COLORS[q.category] || CAT_COLORS.General}`}>{q.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[q.status]}`}>{q.status}</span>
                  <span className="text-xs text-gray-400">by {q.answeredBy}</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{q.clientName} <span className="text-gray-400 font-normal">— {q.clientEmail}</span></p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">❓ {q.query}</p>
                {q.answer && <p className="text-gray-500 text-xs mt-1 line-clamp-1">✅ {q.answer}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString('en-IN')}</p>
                {q.citations?.length > 0 && <p className="text-xs text-blue-600 mt-1">{q.citations.length} citations</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40">← Prev</button>
          <button disabled={filters.page === pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40">Next →</button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Query Details</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">CLIENT</p>
                <p className="font-semibold text-gray-900">{selected.clientName} · {selected.clientEmail}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-600 mb-1">QUERY</p>
                <p className="text-gray-800">{selected.query}</p>
              </div>
              {selected.citations?.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-700 mb-2">LEGAL CITATIONS</p>
                  {selected.citations.map((c, i) => (
                    <div key={i} className="text-sm text-gray-700">📖 {c.source} — {c.section}</div>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CA Answer / Review</label>
                <textarea value={editAnswer} onChange={e => setEditAnswer(e.target.value)} rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type or edit the answer..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal CA Note (not shown to client)</label>
                <input value={editNote} onChange={e => setEditNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleUpdate} disabled={saving} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 disabled:opacity-40">
                  {saving ? 'Saving...' : '✅ Save & Mark Answered'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
