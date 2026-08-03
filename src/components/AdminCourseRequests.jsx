import React, { useState, useEffect, useCallback } from 'react';
import {
  FiSearch, FiFilter, FiRefreshCw, FiBook, FiHelpCircle,
  FiTrash2, FiEdit2, FiX, FiCheck, FiUser, FiMail, FiMessageSquare
} from 'react-icons/fi';
import {
  adminFetchCourseRequests,
  adminUpdateCourseRequest,
  adminDeleteCourseRequest
} from '../services/courseRequestService';

const STATUS_BADGES = {
  PENDING:   { label: 'Pending',   badge: 'bg-amber-500/20 text-amber-300' },
  IN_REVIEW: { label: 'In Review', badge: 'bg-blue-500/20 text-blue-300' },
  PLANNED:   { label: 'Planned',   badge: 'bg-purple-500/20 text-purple-300' },
  RESOLVED:  { label: 'Resolved',  badge: 'bg-green-500/20 text-green-300' },
  REJECTED:  { label: 'Declined',  badge: 'bg-red-500/20 text-red-300' },
};

const REQUEST_STATUSES = ['PENDING', 'IN_REVIEW', 'PLANNED', 'RESOLVED', 'REJECTED'];

export default function AdminCourseRequests({ adminToken }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Modal edit state
  const [editTarget, setEditTarget] = useState(null);
  const [statusVal, setStatusVal] = useState('PENDING');
  const [responseVal, setResponseVal] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchCourseRequests(adminToken, {
        search: search || undefined,
        status: filterStatus || undefined,
        request_type: filterType || undefined,
      });
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch course requests.');
    } finally {
      setLoading(false);
    }
  }, [adminToken, search, filterStatus, filterType]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleOpenEdit = (req) => {
    setEditTarget(req);
    setStatusVal(req.status);
    setResponseVal(req.admin_response || '');
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setUpdating(true);
    try {
      const updated = await adminUpdateCourseRequest(adminToken, editTarget.id, {
        status: statusVal,
        admin_response: responseVal,
      });
      setRequests(prev => prev.map(r => r.id === editTarget.id ? updated : r));
      setEditTarget(null);
    } catch (err) {
      alert(err.message || 'Failed to update request');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCourseRequest(adminToken, deleteTarget.id);
      setRequests(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || 'Failed to delete request');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-xl">Queries & Course Requests</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {requests.length} request{requests.length !== 1 ? 's' : ''} submitted by students
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, description or username…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <FiX size={14} />
            </button>
          )}
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="COURSE_REQUEST">Course Requests</option>
          <option value="QUERY">General Queries</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {REQUEST_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_BADGES[s].label}</option>
          ))}
        </select>

        <button
          onClick={load}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
          title="Refresh"
        >
          <FiRefreshCw size={15} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading requests…</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <FiBook size={36} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No requests or queries found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-800/50">
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Request Title & Details</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => {
                  const badge = STATUS_BADGES[r.status] || STATUS_BADGES.PENDING;
                  return (
                    <tr key={r.id} className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          r.request_type === 'COURSE_REQUEST' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {r.request_type === 'COURSE_REQUEST' ? <FiBook size={11} /> : <FiHelpCircle size={11} />}
                          {r.request_type === 'COURSE_REQUEST' ? 'Course' : 'Query'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <FiUser size={12} className="text-slate-400" /> @{r.username}
                          </span>
                          {r.user_email && (
                            <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                              <FiMail size={10} /> {r.user_email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-white block max-w-sm">{r.title}</span>
                        <p className="text-slate-400 text-xs mt-1 max-w-sm leading-relaxed">{r.description}</p>
                        {r.admin_response && (
                          <div className="mt-2 text-xs text-blue-400 bg-blue-900/20 p-2 rounded-lg border border-blue-800/40">
                            <strong>Response:</strong> {r.admin_response}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge.badge}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Update Status / Reply"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(r)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Request"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Update Request Status</h3>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-white">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={statusVal}
                  onChange={e => setStatusVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {REQUEST_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_BADGES[s].label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Admin Response Note</label>
                <textarea
                  rows={3}
                  value={responseVal}
                  onChange={e => setResponseVal(e.target.value)}
                  placeholder="Add a reply or update for the student..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {updating ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-2">Delete Request?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete the request <span className="text-white font-semibold">"{deleteTarget.title}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
