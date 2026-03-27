import React, { useState, useEffect } from 'react';
import { getAdminDocuments, reviewDocument, getDocumentStats } from '../../../utils/api';
import { FileText, CheckCircle, Clock, AlertTriangle, X, Eye } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = { uploaded: 'bg-gray-100 text-gray-600', processing: 'bg-blue-50 text-blue-700', processed: 'bg-green-50 text-green-700', needs_review: 'bg-amber-50 text-amber-700', verified: 'bg-emerald-50 text-emerald-700', rejected: 'bg-red-50 text-red-700' };
const TYPE_LABELS = { bank_statement: '🏦 Bank Statement', gst_invoice: '🧾 GST Invoice', form_16: '📋 Form 16', itr_acknowledgement: '✅ ITR Ack', tds_certificate: '📄 TDS Cert', balance_sheet: '📊 Balance Sheet', salary_slip: '💰 Salary Slip', other: '📁 Other' };

export default function DocumentOCR() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', documentType: '', page: 1 });
  const [selected, setSelected] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getAdminDocuments(filters), getDocumentStats()])
      .then(([docsR, statsR]) => { setDocs(docsR.data.data); setStats(statsR.data.data); })
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [filters]);

  const handleVerify = async (status) => {
    setSaving(true);
    try {
      await reviewDocument(selected._id, { status, reviewNote });
      toast.success(`Document ${status}`);
      setSelected(null);
      fetchAll();
    } catch { toast.error('Review failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document OCR & Classification</h1>
        <p className="text-gray-500 text-sm">Auto-classify and extract data from client documents</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Docs', val: stats.total, icon: '📁' },
            { label: 'Need Review', val: stats.byStatus?.find(s => s._id === 'needs_review')?.count || 0, icon: '⚠️' },
            { label: 'Verified', val: stats.byStatus?.find(s => s._id === 'verified')?.count || 0, icon: '✅' },
            { label: 'Auto-Processed', val: stats.byStatus?.find(s => s._id === 'processed')?.count || 0, icon: '🤖' },
          ].map(({ label, val, icon }) => (
            <div key={label} className="card text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-xl font-bold text-gray-900">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          {['uploaded', 'processed', 'needs_review', 'verified', 'rejected'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={filters.documentType} onChange={e => setFilters(f => ({ ...f, documentType: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Document list */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Client', 'File', 'Type', 'Extracted Data', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {docs.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-400">No documents uploaded yet</td></tr>
                ) : docs.map(doc => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-sm">{doc.clientName}</p>
                      <p className="text-gray-400 text-xs">{doc.clientEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px] truncate">{doc.originalFileName}</td>
                    <td className="px-4 py-3 text-sm">{TYPE_LABELS[doc.documentType] || doc.documentType}</td>
                    <td className="px-4 py-3">
                      {doc.extractedData && Object.entries(doc.extractedData).filter(([,v]) => v).slice(0,2).map(([k,v]) => (
                        <p key={k} className="text-xs text-gray-500"><span className="font-medium">{k}:</span> {String(v)}</p>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[doc.status]}`}>{doc.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(doc.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(doc); setReviewNote(doc.reviewNote || ''); }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Review Document</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Client</p>
                  <p className="font-semibold">{selected.clientName}</p>
                  <p className="text-gray-500 text-xs">{selected.clientEmail}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">Document Type</p>
                  <p className="font-semibold">{TYPE_LABELS[selected.documentType]}</p>
                  <p className="text-gray-500 text-xs">{selected.originalFileName}</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 mb-2">🤖 AUTO-EXTRACTED DATA</p>
                {Object.entries(selected.extractedData || {}).filter(([,v]) => v).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-0.5">
                    <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-gray-900">{String(v)}</span>
                  </div>
                ))}
                {selected.extractionNotes && <p className="text-xs text-amber-600 mt-2">⚠️ {selected.extractionNotes}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Note</label>
                <input value={reviewNote} onChange={e => setReviewNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a note about your review..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleVerify('rejected')} disabled={saving}
                  className="flex-1 border border-red-200 text-red-600 rounded-lg py-2.5 text-sm hover:bg-red-50">
                  ✗ Reject
                </button>
                <button onClick={() => handleVerify('verified')} disabled={saving}
                  className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-green-700">
                  {saving ? 'Saving...' : '✓ Verify & Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
