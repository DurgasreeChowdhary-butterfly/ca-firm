import React, { useState, useEffect } from 'react';
import { getAdminDocuments, reviewDocument, getDocumentStats } from '../../../utils/api';
import { FileText, CheckCircle, AlertTriangle, X, Eye, Download, ZoomIn, ZoomOut } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
  uploaded: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-50 text-blue-700',
  processed: 'bg-green-50 text-green-700',
  needs_review: 'bg-amber-50 text-amber-700',
  verified: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700'
};

const TYPE_LABELS = {
  bank_statement: '🏦 Bank Statement',
  gst_invoice: '🧾 GST Invoice',
  form_16: '📋 Form 16',
  itr_acknowledgement: '✅ ITR Ack',
  tds_certificate: '📄 TDS Cert',
  balance_sheet: '📊 Balance Sheet',
  salary_slip: '💰 Salary Slip',
  other: '📁 Other'
};

function FileViewer({ doc, token }) {
  const [zoom, setZoom] = useState(1);
  const [imgError, setImgError] = useState(false);
  const fileUrl = `${API_BASE}/admin/documents/${doc._id}/file`;
  const authUrl = `${fileUrl}?token=${encodeURIComponent(token)}`;
  const ext = doc.originalFileName?.split('.').pop()?.toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);
  const isPDF = ext === 'pdf';

  const NoPreview = ({ reason }) => (
    <div className="text-center text-gray-400 py-10">
      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium mb-1">Preview unavailable</p>
      <p className="text-xs text-gray-500 mb-4">{reason}</p>
      <a href={authUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
        <Download className="w-4 h-4" /> Download to view
      </a>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white text-xs font-medium truncate max-w-[180px]">{doc.originalFileName}</span>
          {doc.fileSize && <span className="text-gray-400 text-xs flex-shrink-0">{(doc.fileSize / 1024).toFixed(0)} KB</span>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isImage && !imgError && (
            <>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-gray-400 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <a href={authUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-2.5 py-1.5 rounded transition-colors">
            <Download className="w-3 h-3" /> Download
          </a>
        </div>
      </div>

      {/* File viewer */}
      <div className="flex items-center justify-center bg-gray-800 min-h-[320px] max-h-[450px] overflow-auto p-3">
        {isImage && !imgError ? (
          <img
            src={authUrl}
            alt={doc.originalFileName}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s', maxWidth: '100%' }}
            className="rounded shadow-lg block"
            onError={() => setImgError(true)}
          />
        ) : isImage && imgError ? (
          <NoPreview reason="File may have been removed from server (Render free tier resets files on redeploy)" />
        ) : isPDF ? (
          <iframe
            src={authUrl}
            title={doc.originalFileName}
            className="w-full rounded"
            style={{ height: '420px', border: 'none', background: 'white' }}
          />
        ) : (
          <NoPreview reason={`Preview not supported for .${ext} files`} />
        )}
      </div>
    </div>
  );
}

export default function DocumentOCR() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', documentType: '', page: 1 });
  const [selected, setSelected] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [docType, setDocType] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'data'
  const token = localStorage.getItem('ca_admin_token') || '';

  const fetchAll = () => { // eslint-disable-line
    setLoading(true);
    Promise.all([getAdminDocuments(filters), getDocumentStats()])
      .then(([docsR, statsR]) => { setDocs(docsR.data.data); setStats(statsR.data.data); })
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [filters]); // eslint-disable-line

  // Auto-refresh every 4 seconds if any doc is processing
  useEffect(() => {
    const hasProcessing = docs.some(d => d.status === 'processing');
    if (!hasProcessing) return;
    const timer = setInterval(fetchAll, 4000);
    return () => clearInterval(timer);
  }, [docs]); // eslint-disable-line

  const handleVerify = async (status) => {
    setSaving(true);
    try {
      await reviewDocument(selected._id, { status, reviewNote, documentType: docType || selected.documentType });
      toast.success(`Document ${status === 'verified' ? 'verified ✅' : 'rejected'}`);
      setSelected(null);
      fetchAll();
    } catch { toast.error('Review failed'); }
    finally { setSaving(false); }
  };

  const openDoc = (doc) => {
    setSelected(doc);
    setReviewNote(doc.reviewNote || '');
    setDocType(doc.documentType || 'other');
    setActiveTab('preview');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document OCR & Classification</h1>
        <p className="text-gray-500 text-sm">View, classify and verify client-uploaded documents</p>
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
          {['uploaded', 'processed', 'needs_review', 'verified', 'rejected'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={filters.documentType} onChange={e => setFilters(f => ({ ...f, documentType: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Client', 'File', 'Type', 'Extracted Data', 'Status', 'Date', 'View'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                  ))}
                </tr>
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
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px]">
                      <p className="truncate font-medium">{doc.originalFileName}</p>
                      {doc.fileSize && <p className="text-gray-400">{(doc.fileSize / 1024).toFixed(0)} KB</p>}
                    </td>
                    <td className="px-4 py-3 text-sm">{TYPE_LABELS[doc.documentType] || doc.documentType}</td>
                    <td className="px-4 py-3">
                      {doc.extractedData && Object.entries(doc.extractedData).filter(([, v]) => v).slice(0, 2).map(([k, v]) => (
                        <p key={k} className="text-xs text-gray-500">
                          <span className="font-medium capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {String(v)}
                        </p>
                      ))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[doc.status]}`}>
                        {doc.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openDoc(doc)}
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-lg text-xs transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Full-screen Review Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl my-8">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Review Document</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {selected.clientName} · {selected.clientEmail} · {new Date(selected.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-0 divide-x divide-gray-100">

              {/* LEFT: File preview */}
              <div className="p-5">
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  {['preview', 'data'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {tab === 'preview' ? '👁 File Preview' : '🤖 Extracted Data'}
                    </button>
                  ))}
                </div>

                {activeTab === 'preview' ? (
                  <FileViewer doc={selected} token={token} />
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wider">Auto-Extracted Fields</p>
                      {Object.entries(selected.extractedData || {}).filter(([, v]) => v).length > 0 ? (
                        Object.entries(selected.extractedData || {}).filter(([, v]) => v).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center py-1.5 border-b border-blue-100 last:border-0">
                            <span className="text-gray-500 text-sm capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-semibold text-gray-900 text-sm">{String(v)}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm text-center py-4">No fields auto-extracted</p>
                      )}
                    </div>
                    {selected.extractionNotes && (
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ OCR Note</p>
                        <p className="text-amber-700 text-sm">{selected.extractionNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Review form */}
              <div className="p-5 space-y-4">
                <h4 className="font-semibold text-gray-900">CA Review</h4>

                {/* Client info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Client</p>
                    <p className="font-semibold text-gray-900">{selected.clientName}</p>
                    <p className="text-gray-500 text-xs">{selected.clientPhone || 'No phone'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Current Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status]}`}>
                      {selected.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Reclassify type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type <span className="text-gray-400 font-normal">(correct if wrong)</span>
                  </label>
                  <select value={docType} onChange={e => setDocType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                {/* Review note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CA Review Note</label>
                  <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Add notes about this document, extracted data accuracy, any corrections needed..." />
                </div>

                {/* File info */}
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p><span className="font-medium">File:</span> {selected.originalFileName}</p>
                  <p><span className="font-medium">Size:</span> {selected.fileSize ? `${(selected.fileSize / 1024).toFixed(0)} KB` : 'Unknown'}</p>
                  <p><span className="font-medium">Uploaded:</span> {new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                  {selected.reviewedAt && <p><span className="font-medium">Last Reviewed:</span> {new Date(selected.reviewedAt).toLocaleString('en-IN')}</p>}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleVerify('rejected')} disabled={saving}
                    className="flex-1 border-2 border-red-200 text-red-600 font-semibold rounded-xl py-3 text-sm hover:bg-red-50 transition-colors disabled:opacity-40">
                    ✗ Reject
                  </button>
                  <button onClick={() => handleVerify('needs_review')} disabled={saving}
                    className="flex-1 border-2 border-amber-200 text-amber-600 font-semibold rounded-xl py-3 text-sm hover:bg-amber-50 transition-colors disabled:opacity-40">
                    ⚠ Flag
                  </button>
                  <button onClick={() => handleVerify('verified')} disabled={saving}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl py-3 text-sm transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                    {saving ? 'Saving...' : <><CheckCircle className="w-4 h-4" /> Verify</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
