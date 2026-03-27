import React, { useState, useEffect } from 'react';
import { getUpcomingDeadlines, generateCalendar, markComplianceDone } from '../../../utils/api';
import { Calendar, AlertTriangle, CheckCircle, Clock, Plus, X } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const URGENCY_STYLES = { overdue: 'bg-red-600 text-white', critical: 'bg-red-50 text-red-700 border border-red-200', urgent: 'bg-amber-50 text-amber-700 border border-amber-200', upcoming: 'bg-blue-50 text-blue-700 border border-blue-200', future: 'bg-gray-50 text-gray-600' };
const CAT_ICONS = { GST: '🧾', ITR: '📋', TDS: '📄', ROC: '🏢' };

export default function StatutoryCalendar() {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genForm, setGenForm] = useState({ clientName: '', clientEmail: '', financialYear: '2025-26', clientProfile: { entityType: 'pvt_ltd', turnover: 5000000, state: 'MH', hasGST: true, isComposition: false, qrmpOptIn: false, auditRequired: false, tdsApplicable: true, advanceTaxApplicable: true } });
  const [generating, setGenerating] = useState(false);

  const fetchUpcoming = () => {
    setLoading(true);
    getUpcomingDeadlines(days)
      .then(r => setUpcoming(r.data.data))
      .catch(() => toast.error('Failed to load deadlines'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUpcoming(); }, [days]); // eslint-disable-line

  const handleGenerate = async () => {
    if (!genForm.clientName || !genForm.clientEmail) { toast.error('Name and email required'); return; }
    setGenerating(true);
    try {
      const r = await generateCalendar(genForm);
      toast.success(r.data.message);
      setShowGenerate(false);
      fetchUpcoming();
    } catch { toast.error('Generation failed'); }
    finally { setGenerating(false); }
  };

  const urgencyIcon = (u) => ({ overdue: '🔴', critical: '🟠', urgent: '🟡', upcoming: '🔵', future: '⚪' })[u] || '⚪';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Statutory Calendar</h1>
          <p className="text-gray-500 text-sm">Dynamic due dates calculated per client profile</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={days} onChange={e => setDays(+e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {[7, 15, 30, 60, 90].map(d => <option key={d} value={d}>Next {d} days</option>)}
          </select>
          <button onClick={() => setShowGenerate(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> Generate Client Calendar
          </button>
        </div>
      </div>

      {/* Urgency legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[['overdue', '🔴 Overdue'], ['critical', '🟠 Critical (≤3d)'], ['urgent', '🟡 Urgent (≤7d)'], ['upcoming', '🔵 Upcoming (≤30d)'], ['future', '⚪ Future']].map(([k, label]) => (
          <span key={k} className={`px-3 py-1.5 rounded-full font-medium ${URGENCY_STYLES[k]}`}>{label}</span>
        ))}
      </div>

      {/* Deadline list */}
      {loading ? <LoadingSpinner /> : upcoming.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No upcoming deadlines in the next {days} days</p>
          <p className="text-sm mt-1">Generate a client calendar first</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((item, i) => (
            <div key={i} className={`card flex items-center gap-4 ${item.urgency === 'overdue' ? 'border-l-4 border-l-red-600' : item.urgency === 'critical' ? 'border-l-4 border-l-orange-500' : item.urgency === 'urgent' ? 'border-l-4 border-l-amber-400' : ''}`}>
              <div className="text-2xl flex-shrink-0">{CAT_ICONS[item.category] || '📌'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm">{item.complianceType}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${URGENCY_STYLES[item.urgency]}`}>
                    {urgencyIcon(item.urgency)} {item.urgency}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{item.period} · {item.clientName} · {item.clientEmail}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900 text-sm">{new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-xs text-gray-400">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Calendar Modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Generate Smart Calendar</h3>
              <button onClick={() => setShowGenerate(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client Name *</label>
                  <input value={genForm.clientName} onChange={e => setGenForm(f => ({ ...f, clientName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ABC Pvt Ltd" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Client Email *</label>
                  <input value={genForm.clientEmail} onChange={e => setGenForm(f => ({ ...f, clientEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="client@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Entity Type</label>
                  <select value={genForm.clientProfile.entityType} onChange={e => setGenForm(f => ({ ...f, clientProfile: { ...f.clientProfile, entityType: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['individual', 'partnership', 'pvt_ltd', 'llp', 'huf', 'firm'].map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                  <select value={genForm.clientProfile.state} onChange={e => setGenForm(f => ({ ...f, clientProfile: { ...f.clientProfile, state: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['MH', 'KA', 'DL', 'GJ', 'TN', 'UP', 'RJ', 'WB', 'AP'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Annual Turnover (₹)</label>
                <input type="number" value={genForm.clientProfile.turnover} onChange={e => setGenForm(f => ({ ...f, clientProfile: { ...f.clientProfile, turnover: +e.target.value } }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['hasGST', 'GST Registered'], ['isComposition', 'Composition Scheme'],
                  ['qrmpOptIn', 'QRMP Opted In'], ['auditRequired', 'Audit Required'],
                  ['tdsApplicable', 'TDS Applicable'], ['advanceTaxApplicable', 'Advance Tax'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={genForm.clientProfile[key]}
                      onChange={e => setGenForm(f => ({ ...f, clientProfile: { ...f.clientProfile, [key]: e.target.checked } }))}
                      className="rounded border-gray-300 text-blue-600" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowGenerate(false)} className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleGenerate} disabled={generating} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800 disabled:opacity-40">
                  {generating ? 'Generating...' : '📅 Generate Calendar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
