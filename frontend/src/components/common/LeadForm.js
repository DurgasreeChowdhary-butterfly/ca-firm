import React, { useState } from 'react';
import { submitLead } from '../../utils/api';
import toast from 'react-hot-toast';
import { Send, Loader } from 'lucide-react';

const SERVICES = [
  'Income Tax Filing',
  'GST Registration & Filing',
  'Company Registration',
  'Audit & Assurance',
  'Tax Planning',
  'Other',
];

export default function LeadForm({ defaultService = '', compact = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: defaultService, message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.service) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await submitLead(form);
      setSubmitted(true);
      toast.success('Thank you! We will contact you shortly.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Received!</h3>
        <p className="text-gray-600">Our team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-${compact ? '3' : '4'}`}>
      <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-${compact ? '3' : '4'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            placeholder="Your full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            name="phone" value={form.phone} onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service Required *</label>
        <select
          name="service" value={form.service} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
        >
          <option value="">Select a service...</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {!compact && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message" value={form.message} onChange={handleChange}
            rows={3} placeholder="Brief description of your requirements..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          />
        </div>
      )}
      <button
        type="submit" disabled={loading}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Get Free Consultation</>}
      </button>
    </form>
  );
}
