import React, { useState, useEffect, useCallback } from 'react';
import { getAppointments, updateAppointment, deleteAppointment } from '../../utils/api';
import { Trash2, Edit, X, Check, Calendar } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', page: 1 });
  const [pagination, setPagination] = useState({});
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', adminNotes: '' });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.status) delete params.status;
      const res = await getAppointments(params);
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { await deleteAppointment(id); toast.success('Deleted'); fetchAppointments(); }
    catch { toast.error('Delete failed'); }
  };

  const openEdit = (apt) => { setEditing(apt); setEditForm({ status: apt.status, adminNotes: apt.adminNotes || '' }); };

  const handleUpdate = async () => {
    try {
      await updateAppointment(editing._id, editForm);
      toast.success('Updated');
      setEditing(null);
      fetchAppointments();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500 text-sm">{pagination.total || 0} total bookings</p>
      </div>

      {/* Filter */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          {['pending','confirmed','completed','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <input type="date" onChange={e => setFilters(f => ({ ...f, date: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Cards */}
      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No appointments found</p>
            </div>
          ) : appointments.map(apt => (
            <div key={apt._id} className="card">
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">{apt.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[apt.status]}`}>{apt.status}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{apt.email} · {apt.phone}</p>
                  {apt.whatsapp && apt.whatsapp !== apt.phone && (
                    <p className="text-green-600 text-xs mt-0.5">💬 WhatsApp: {apt.whatsapp}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm mt-2">
                    <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
                      <Calendar className="w-4 h-4" />
                      {new Date(apt.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })} — {apt.timeSlot}
                    </span>
                    <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs">{apt.service}</span>
                  </div>
                  {apt.message && <p className="text-gray-400 text-xs italic mt-1">"{apt.message}"</p>}
                  {apt.adminNotes && <p className="text-blue-600 text-xs mt-1 bg-blue-50 px-2 py-1 rounded">📝 {apt.adminNotes}</p>}
                </div>
                <div className="flex gap-2">
                  {/* WhatsApp client */}
                  {(apt.whatsapp || apt.phone) && (
                    <a href={`https://wa.me/${(apt.whatsapp || apt.phone).replace(/[^0-9]/g,'')}?text=${encodeURIComponent(`Hi ${apt.name}, your appointment for ${apt.service} is confirmed on ${new Date(apt.date).toLocaleDateString('en-IN')} at ${apt.timeSlot}. See you soon! — CA Firm Mumbai`)}`}
                      target="_blank" rel="noopener noreferrer" title="WhatsApp client"
                      className="p-2 rounded-lg hover:bg-green-50 text-green-600 border border-green-100 transition-colors flex items-center text-base">
                      💬
                    </a>
                  )}
                  {apt.phone && (
                    <a href={`tel:${apt.phone}`} title="Call client"
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 border border-blue-100 transition-colors flex items-center text-base">
                      📞
                    </a>
                  )}
                  <button onClick={() => openEdit(apt)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 border border-blue-100 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(apt._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 border border-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40">← Prev</button>
          <button disabled={filters.page === pagination.pages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40">Next →</button>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Update — {editing.name}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {['pending','confirmed','completed','cancelled'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea value={editForm.adminNotes} onChange={e => setEditForm(f => ({ ...f, adminNotes: e.target.value }))} rows={3}
                  placeholder="Notes visible only to admins..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 text-sm hover:bg-blue-800 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
