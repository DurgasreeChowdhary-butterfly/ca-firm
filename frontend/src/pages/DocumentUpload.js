import React, { useState, useRef } from 'react';
import SEO from '../components/common/SEO';
import { uploadDocument } from '../utils/api';
import { Upload, FileText, CheckCircle, Loader, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.xlsx,.csv';
const DOC_TYPES = [
  { label: 'GST Invoice', icon: '🧾', desc: 'Tax invoices from suppliers' },
  { label: 'Form 16', icon: '📋', desc: 'TDS certificate from employer' },
  { label: 'Bank Statement', icon: '🏦', desc: '3-6 months bank statement' },
  { label: 'TDS Certificate', icon: '📄', desc: 'Form 16A, 16B' },
  { label: 'ITR Acknowledgement', icon: '✅', desc: 'Filed ITR confirmation' },
  { label: 'Balance Sheet', icon: '📊', desc: 'P&L, financial statements' },
];

export default function DocumentUpload() {
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '' });
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a document to upload'); return; }
    if (!form.clientName || !form.clientEmail) { toast.error('Name and email are required'); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('clientName', form.clientName);
    formData.append('clientEmail', form.clientEmail);
    formData.append('clientPhone', form.clientPhone);

    try {
      const res = await uploadDocument(formData);
      setResult(res.data.data);
      toast.success('Document uploaded and processed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

  return (
    <>
      <SEO
        title="Upload Documents"
        description="Securely upload your financial documents — GST invoices, Form 16, bank statements. Our CA team will process and categorise them automatically."
        canonical="/upload-document"
      />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Upload Your Documents</h1>
          <p className="text-blue-100 text-lg">Securely share your financial documents with our CA team. Auto-classified and processed.</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Upload Form */}
            <div className="lg:col-span-2">
              {result ? (
                <div className="card text-center py-10">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Uploaded!</h2>
                  <div className="bg-green-50 rounded-xl p-4 mb-4 text-left max-w-sm mx-auto">
                    <p className="text-sm text-gray-700"><span className="font-semibold">Type Detected:</span> {result.documentType?.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Status:</span> {result.status?.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                    {result.extractedData && Object.entries(result.extractedData).filter(([,v]) => v).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-green-100">
                        <p className="text-xs font-semibold text-green-700 mb-1">Auto-Extracted:</p>
                        {Object.entries(result.extractedData).filter(([,v]) => v).map(([k,v]) => (
                          <p key={k} className="text-xs text-gray-600">{k}: <span className="font-medium">{String(v)}</span></p>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => { setResult(null); setFile(null); }}
                    className="btn-outline mr-3">Upload Another</button>
                  <Link to="/contact" className="btn-primary">Contact Our CA</Link>
                </div>
              ) : (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Upload Document</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                          placeholder="Full name" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                          placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                      <input value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
                        placeholder="+91 98765 43210" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    {/* Drag & Drop Zone */}
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-blue-500 bg-blue-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    >
                      <input ref={fileRef} type="file" accept={ACCEPTED_TYPES} onChange={handleFileSelect} className="hidden" />
                      {file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div className="text-left">
                            <p className="font-semibold text-gray-900 text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">{formatSize(file.size)}</p>
                          </div>
                          <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="font-medium text-gray-700 mb-1">Drag & drop your file here</p>
                          <p className="text-gray-400 text-sm mb-2">or click to browse</p>
                          <p className="text-gray-400 text-xs">PDF, JPG, PNG, XLSX · Max 10MB</p>
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={loading || !file}
                      className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                      {loading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading & Processing...</> : <><Upload className="w-4 h-4" /> Upload Document Securely</>}
                    </button>
                    <p className="text-center text-xs text-gray-400">🔒 Your documents are encrypted and only accessible by our CA team</p>
                  </form>
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">📁 Accepted Documents</h3>
                <div className="space-y-2">
                  {DOC_TYPES.map(({ label, icon, desc }) => (
                    <div key={label} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                      <span className="text-lg flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-blue-900 text-white">
                <h3 className="font-semibold mb-2 text-sm">🤖 Auto-Processing</h3>
                <p className="text-blue-200 text-xs mb-3 leading-relaxed">Our system automatically classifies your document and extracts key fields. A CA reviews everything before it goes to your dashboard.</p>
                <Link to="/book-appointment" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-4 py-2 rounded-xl text-xs transition-all">
                  Talk to a CA <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
