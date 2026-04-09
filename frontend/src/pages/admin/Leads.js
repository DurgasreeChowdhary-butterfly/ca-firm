import React, { useState, useEffect, useCallback } from 'react';
import { getLeads, updateLead, deleteLead } from '../../utils/api';
import { Search, Filter, Trash2, Edit, X, Check, Phone } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  converted: 'bg-green-50 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ status: '', service: '', search: '', page: 1 });
  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.status) delete params.status;
      if (!params.service) delete params.service;
      if (!params.search) delete params.search;
      const res = await getLeads(params);
      setLeads(res.data.data);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load leads'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted');
      fetchLeads();
    } catch { toast.error('Delete failed'); }
  };

  const openEdit = (lead) => {
    setEditingLead(lead);
    setEditForm({ status: lead.status, notes: lead.notes || '' });
  };

  const handleUpdate = async () => {
    try {
      await updateLead(editingLead._id, editForm);
      toast.success('Lead updated');
      setEditingLead(null);
      fetchLeads();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm">{pagination.total || 0} total enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
              placeholder="Search name, email, phone..."
              className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            {['new','contacted','converted','closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <select value={filters.service} onChange={e => setFilters(f => ({ ...f, service: e.target.value, page: 1 }))}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Services</option>
            {['Income Tax Filing','GST Registration & Filing','Company Registration','Audit & Assurance','Tax Planning','Other'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name & Contact','Service','Message','Status','Date','Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">No leads found</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      <p className="text-gray-400 text-xs">{lead.email}</p>
                      <p className="text-gray-400 text-xs">{lead.phone}</p>
                      {lead.whatsapp && lead.whatsapp !== lead.phone && (
                        <p className="text-green-600 text-xs">💬 {lead.whatsapp}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px]">{lead.service}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{lead.message || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {/* WhatsApp — direct link to chat with client */}
                        {(lead.whatsapp || lead.phone) && (
                          <a
                            href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, this is CA Firm Mumbai. You enquired about ${lead.service}. How can we help you?`)}`}
                            target="_blank" rel="noopener noreferrer"
                            title="WhatsApp client"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors flex items-center">
                            <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.737 5.494 2.027 7.8L0 32l8.469-2.001A15.944 15.944 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.406 22.594c-.35.982-1.731 1.8-2.85 2.037-.756.162-1.744.291-5.069-1.088-4.25-1.737-6.987-6.044-7.2-6.325-.206-.281-1.688-2.25-1.688-4.287 0-2.038 1.069-3.038 1.45-3.45.381-.412.831-.512 1.106-.512.275 0 .55.003.794.012.256.011.6-.097.938.713.35.831 1.188 2.869 1.294 3.075.106.206.175.45.031.725-.131.275-.2.45-.406.694-.206.244-.431.544-.613.731-.206.206-.419.431-.181.844.238.412 1.056 1.744 2.269 2.825 1.556 1.387 2.869 1.819 3.281 2.025.413.206.656.175.9-.1.244-.281 1.044-1.219 1.325-1.637.281-.419.563-.35.95-.213.388.138 2.45 1.156 2.869 1.363.419.206.694.306.8.481.106.175.106 1.019-.244 2z"/></svg>
                          </a>
                        )}
                        {/* Call */}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} title="Call client"
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors flex items-center">
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openEdit(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(lead._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <p className="text-gray-500">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button disabled={pagination.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button disabled={pagination.page === pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Update Lead — {editingLead.name}</h3>
              <button onClick={() => setEditingLead(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['new','contacted','converted','closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={4}
                  placeholder="Internal notes about this lead..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditingLead(null)} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-800 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
