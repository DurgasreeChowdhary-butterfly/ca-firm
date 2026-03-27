import React, { useState, useEffect } from 'react';
import { getSyncRecords, getSyncStats, triggerDemoSync, resolveSyncConflict } from '../../../utils/api';
import { RefreshCw, CheckCircle, AlertTriangle, ArrowDownUp, Zap } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const SOURCE_COLORS = { zoho: 'bg-blue-50 text-blue-700', quickbooks: 'bg-green-50 text-green-700', tally: 'bg-purple-50 text-purple-700', manual: 'bg-gray-100 text-gray-600' };
const STATUS_COLORS = { success: 'bg-green-50 text-green-700', failed: 'bg-red-50 text-red-700', conflict: 'bg-amber-50 text-amber-700', skipped: 'bg-gray-100 text-gray-500', pending: 'bg-blue-50 text-blue-600' };

export default function DataSync() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [filters, setFilters] = useState({ source: '', status: '', page: 1 });

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getSyncRecords(filters), getSyncStats()])
      .then(([recR, statR]) => { setRecords(recR.data.data); setStats(statR.data.data); })
      .catch(() => toast.error('Failed to load sync data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [filters]); // eslint-disable-line

  const handleDemoSync = async (source) => {
    setTriggering(true);
    try {
      const r = await triggerDemoSync({ source, clientId: 'DEMO-001', clientName: 'Demo Client Co.' });
      toast.success(r.data.message);
      fetchAll();
    } catch { toast.error('Demo sync failed'); }
    finally { setTriggering(false); }
  };

  const handleResolve = async (id, resolution) => {
    try {
      await resolveSyncConflict(id, { resolution });
      toast.success('Conflict resolved');
      fetchAll();
    } catch { toast.error('Resolution failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bi-directional Data Sync</h1>
          <p className="text-gray-500 text-sm">Zoho Books · Tally · QuickBooks integration engine</p>
        </div>
        <div className="flex gap-2">
          {['zoho', 'tally', 'quickbooks'].map(source => (
            <button key={source} onClick={() => handleDemoSync(source)} disabled={triggering}
              className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-3 py-2 rounded-xl text-xs transition-colors disabled:opacity-40">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Demo {source.charAt(0).toUpperCase() + source.slice(1)} Sync
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Synced', val: stats.total, icon: ArrowDownUp, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Last 24h', val: stats.last24h, icon: RefreshCw, color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Conflicts', val: stats.conflicts, icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'Success Rate', val: stats.total > 0 ? Math.round(((stats.byStatus?.find(s => s._id === 'success')?.count || 0) / stats.total) * 100) + '%' : '—', icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          ].map(({ label, val, icon: Icon, color, bg }) => (
            <div key={label} className="card flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{val}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source breakdown */}
      {stats?.bySource && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Records by Source</h3>
          <div className="flex flex-wrap gap-3">
            {stats.bySource.map(({ _id, count }) => (
              <div key={_id} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${SOURCE_COLORS[_id] || 'bg-gray-100 text-gray-600'}`}>
                {_id?.charAt(0).toUpperCase() + _id?.slice(1)}: <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex gap-3 flex-wrap">
        <select value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Sources</option>
          {['zoho', 'tally', 'quickbooks', 'manual'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value, page: 1 }))}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Status</option>
          {['success', 'failed', 'conflict', 'skipped', 'pending'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Records */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Client', 'Source', 'Direction', 'Event', 'External ID', 'Status', 'Time', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr><td colSpan={8} className="py-10 text-center text-gray-400">No sync records. Click "Demo Sync" to test integration.</td></tr>
                ) : records.map(rec => (
                  <tr key={rec._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-xs">{rec.clientName || rec.clientId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${SOURCE_COLORS[rec.source]}`}>{rec.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${rec.direction === 'inbound' ? 'text-blue-600' : 'text-green-600'}`}>
                        {rec.direction === 'inbound' ? '⬇ In' : '⬆ Out'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{rec.eventType}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{rec.externalId || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[rec.status]}`}>{rec.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(rec.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {rec.status === 'conflict' && (
                        <button onClick={() => handleResolve(rec._id, 'external_wins')}
                          className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-200">
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
