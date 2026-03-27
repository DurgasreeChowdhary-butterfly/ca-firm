import React, { useState, useEffect } from 'react';
import { getMagicLinks, revokeTokens } from '../../../utils/api';
import { Link, Shield, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MagicLinks() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const fetchTokens = () => {
    setLoading(true);
    getMagicLinks({ limit: 30 })
      .then(r => { setTokens(r.data.data); setPagination(r.data.pagination); })
      .catch(() => toast.error('Failed to load tokens'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTokens(); }, []); // eslint-disable-line

  const handleRevoke = async (email) => {
    if (!window.confirm(`Revoke all active tokens for ${email}?`)) return;
    try {
      const r = await revokeTokens(email);
      toast.success(r.data.message);
      fetchTokens();
    } catch { toast.error('Revoke failed'); }
  };

  const getStatus = (token) => {
    if (token.invalidatedAt) return { label: 'Revoked', color: 'bg-gray-100 text-gray-500', icon: XCircle };
    if (token.usedAt) return { label: 'Used', color: 'bg-green-50 text-green-700', icon: CheckCircle };
    if (new Date(token.expiresAt) < new Date()) return { label: 'Expired', color: 'bg-red-50 text-red-600', icon: Clock };
    return { label: 'Active', color: 'bg-blue-50 text-blue-700', icon: Shield };
  };

  const activeCount = tokens.filter(t => !t.usedAt && !t.invalidatedAt && new Date(t.expiresAt) > new Date()).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Magic Link / Passwordless Access</h1>
        <p className="text-gray-500 text-sm">Secure one-time tokens for client MIS report access</p>
      </div>

      {/* How it works */}
      <div className="card bg-blue-50 border border-blue-100">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> How Magic Links Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {['1. Client requests access via email', '2. System generates SHA-256 hashed token (15 min expiry)', '3. Raw token sent via email — hash stored in DB', '4. Client clicks → token consumed, scoped JWT issued (30 min)'].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
              <p className="text-blue-800 text-xs leading-relaxed">{step.slice(3)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Issued', val: pagination.total || 0, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Currently Active', val: activeCount, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Used', val: tokens.filter(t => t.usedAt).length, color: 'text-gray-700', bg: 'bg-gray-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Token list */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSpinner /> : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Client', 'Report', 'Status', 'Expires / Used At', 'IP', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tokens.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-gray-400">No magic links issued yet</td></tr>
                ) : tokens.map(token => {
                  const { label, color, icon: Icon } = getStatus(token);
                  return (
                    <tr key={token._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{token.clientName}</p>
                        <p className="text-gray-400 text-xs">{token.clientEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-xs">{token.reportType?.replace('_', ' ')}</p>
                        <p className="text-gray-400 text-xs">{token.reportId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold w-fit ${color}`}>
                          <Icon className="w-3 h-3" /> {label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {token.usedAt ? `Used: ${new Date(token.usedAt).toLocaleString('en-IN')}` : `Expires: ${new Date(token.expiresAt).toLocaleString('en-IN')}`}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{token.ipCreated || '—'}</td>
                      <td className="px-4 py-3">
                        {!token.usedAt && !token.invalidatedAt && new Date(token.expiresAt) > new Date() && (
                          <button onClick={() => handleRevoke(token.clientEmail)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
