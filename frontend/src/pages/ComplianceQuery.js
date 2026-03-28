import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { submitComplianceQuery } from '../utils/api';
import { MessageSquare, Send, Loader, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SAMPLE_QUESTIONS = [
  'What is the due date for GSTR-1 filing for my business?',
  'Can I claim ITC on a GST invoice received after 6 months?',
  'What are the TDS rates applicable for professional fees?',
  'How do I calculate advance tax installments?',
  'What is the difference between old and new tax regime?',
  'Is GST registration mandatory for my ₹35 lakh turnover business?',
];

const CATEGORIES = ['GST', 'ITR', 'TDS', 'Audit', 'Company Law', 'General'];

export default function ComplianceQuery() {
  const [form, setForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', clientWhatsapp: '', query: '', category: '' });
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (field) => (e) => {
    setForm(f => {
      const updated = { ...f, [field]: e.target.value };
      if (field === 'clientPhone' && sameAsPhone) updated.clientWhatsapp = e.target.value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName || !form.query) { toast.error('Please enter your name and query'); return; }
    setLoading(true); setResult(null);
    try {
      const payload = { ...form, clientWhatsapp: sameAsPhone ? form.clientPhone : form.clientWhatsapp };
      const res = await submitComplianceQuery(payload);
      setResult(res.data.data);
      toast.success('Query answered!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process query');
    } finally { setLoading(false); }
  };

  return (
    <>
      <SEO title="AI Tax & GST Compliance Query" description="Get instant answers to your GST, Income Tax, TDS and compliance questions. Answer delivered on WhatsApp & email." canonical="/compliance-query" />

      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/30 rounded-full px-4 py-2 text-sm text-blue-200 mb-5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI Engine + CA Team — Answer on WhatsApp & Email
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Ask Your Tax Question</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Get instant answers on GST, Income Tax, TDS. We send the answer to your WhatsApp and email.</p>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-700" /> Submit Your Query
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input value={form.clientName} onChange={set('clientName')} placeholder="Rajesh Kumar"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={form.clientEmail} onChange={set('clientEmail')} placeholder="you@example.com"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" value={form.clientPhone} onChange={set('clientPhone')} placeholder="+91 98765 43210"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        💬 WhatsApp Number
                        <span className="text-green-600 text-xs font-normal ml-2">(answer sent here)</span>
                      </label>
                      <input type="tel" value={sameAsPhone ? form.clientPhone : form.clientWhatsapp}
                        onChange={set('clientWhatsapp')} disabled={sameAsPhone}
                        placeholder="+91 98765 43210"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${sameAsPhone ? 'bg-gray-50 text-gray-400' : ''}`} />
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                        <input type="checkbox" checked={sameAsPhone} onChange={e => setSameAsPhone(e.target.checked)} className="rounded border-gray-300 text-green-600" />
                        <span className="text-xs text-gray-500">Same as phone number</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={set('category')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Auto-detect</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Question *</label>
                    <textarea value={form.query} onChange={set('query')} rows={4}
                      placeholder="e.g. What is the deadline for GSTR-3B filing and what penalty applies if I miss it?"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {loading ? <><Loader className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Get AI Answer</>}
                  </button>
                </form>

                {result && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Answer</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{result.category}</span>
                      <span className="text-xs text-gray-400">by {result.answeredBy}</span>
                      {result.notified && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">💬 Sent to WhatsApp</span>}
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">{result.answer}</p>
                    </div>
                    {result.citations?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legal Citations</p>
                        {result.citations.map((c, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div><span className="font-semibold text-blue-700">{c.source}</span>{c.section && <span className="text-gray-500"> · {c.section}</span>}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-800">⚠️ AI guidance only. For advice specific to your situation, <Link to="/book-appointment" className="font-semibold underline">book a free CA consultation</Link>.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">💡 Sample Questions</h3>
                <div className="space-y-2">
                  {SAMPLE_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => setForm(f => ({ ...f, query: q }))}
                      className="w-full text-left text-xs text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 p-2.5 rounded-lg transition-colors leading-relaxed">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card bg-green-50 border border-green-100">
                <p className="text-xs font-semibold text-green-800 mb-1">💬 WhatsApp Delivery</p>
                <p className="text-xs text-green-700 leading-relaxed">Provide your WhatsApp number and we'll send the answer directly there — even if you close this page.</p>
              </div>
              <div className="card bg-blue-900 text-white">
                <h3 className="font-semibold mb-2 text-sm">Need Personal Advice?</h3>
                <p className="text-blue-200 text-xs mb-3 leading-relaxed">Our CA gives advice specific to your business situation — not just general answers.</p>
                <Link to="/book-appointment" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-all">
                  Book Free CA Consultation <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
