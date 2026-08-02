import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiSearch,
  FiFilter, FiInfo, FiAlertTriangle, FiCalendar,
  FiBookOpen, FiAward, FiBell, FiRefreshCw,
  FiBookmark, FiUser, FiUsers,
} from 'react-icons/fi';
import {
  adminFetchNotifications,
  adminCreateNotification,
  adminUpdateNotification,
  adminDeleteNotification,
} from '../services/notificationService';

// ── Constants ─────────────────────────────────────────────────────────────────

const NOTIF_TYPES = ['ANNOUNCEMENT', 'ASSIGNMENT', 'EVENT', 'WARNING', 'ACHIEVEMENT', 'GENERAL'];

const TYPE_META = {
  ANNOUNCEMENT: { label: 'Announcement', icon: FiInfo,          color: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300'  },
  ASSIGNMENT:   { label: 'Assignment',   icon: FiBookOpen,      color: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  EVENT:        { label: 'Event',        icon: FiCalendar,      color: 'text-green-400',  badge: 'bg-green-500/20 text-green-300'  },
  WARNING:      { label: 'Warning',      icon: FiAlertTriangle, color: 'text-red-400',    badge: 'bg-red-500/20 text-red-300'      },
  ACHIEVEMENT:  { label: 'Achievement',  icon: FiAward,         color: 'text-amber-400',  badge: 'bg-amber-500/20 text-amber-300'  },
  GENERAL:      { label: 'General',      icon: FiBell,          color: 'text-slate-400',  badge: 'bg-slate-500/20 text-slate-300'  },
};

const EMPTY_FORM = {
  title: '',
  message: '',
  notif_type: 'GENERAL',
  recipient_type: 'ALL',
  recipient_username: '',
  attachment_url: '',
  external_link: '',
  is_pinned: false,
  expires_at: '',
};

// ── Notification Form Modal ───────────────────────────────────────────────────

function NotifFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!initial?.id;
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required.');
      return;
    }
    if (form.recipient_type === 'USER' && !form.recipient_username.trim()) {
      setError('Username is required when sending to a specific student.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        message: form.message.trim(),
        attachment_url: form.attachment_url.trim() || null,
        external_link: form.external_link.trim() || null,
        recipient_username: form.recipient_type === 'USER' ? form.recipient_username.trim() : null,
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors';
  const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 flex-shrink-0">
          <h3 className="text-white font-bold text-lg">
            {isEdit ? 'Edit Notification' : 'Create Notification'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Notification title"
              className={inputCls}
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className={labelCls}>Message *</label>
            <textarea
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Notification body..."
              rows={3}
              className={inputCls + ' resize-none'}
              required
            />
          </div>

          {/* Type + Recipient row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={form.notif_type}
                onChange={e => set('notif_type', e.target.value)}
                className={inputCls}
              >
                {NOTIF_TYPES.map(t => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Recipient</label>
              <select
                value={form.recipient_type}
                onChange={e => set('recipient_type', e.target.value)}
                className={inputCls}
              >
                <option value="ALL">All Students</option>
                <option value="USER">Specific Student</option>
              </select>
            </div>
          </div>

          {/* Username (only when USER) */}
          {form.recipient_type === 'USER' && (
            <div>
              <label className={labelCls}>Student Username *</label>
              <input
                type="text"
                value={form.recipient_username}
                onChange={e => set('recipient_username', e.target.value)}
                placeholder="Enter exact username"
                className={inputCls}
              />
            </div>
          )}

          {/* Attachment + Link */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelCls}>Attachment URL</label>
              <input
                type="url"
                value={form.attachment_url}
                onChange={e => set('attachment_url', e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>External Link</label>
              <input
                type="url"
                value={form.external_link}
                onChange={e => set('external_link', e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Expiry + Pin row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Expires At</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={e => set('expires_at', e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => set('is_pinned', !form.is_pinned)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_pinned ? 'bg-amber-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_pinned ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm text-slate-300 font-medium">Pin to top</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-700 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Saving…' : <><FiCheck size={14} /> {isEdit ? 'Save Changes' : 'Create'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ notif, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">Delete Notification?</h3>
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">"{notif.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
            }}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Type Badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.GENERAL;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${meta.badge}`}>
      <Icon size={10} />
      {meta.label}
    </span>
  );
}

// ── Main AdminNotifications Component ─────────────────────────────────────────

export default function AdminNotifications({ adminToken }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [formModal, setFormModal]         = useState(null); // null | { edit?: notif }
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [error, setError]                 = useState('');

  // Filters
  const [search, setSearch]             = useState('');
  const [filterType, setFilterType]     = useState('');
  const [filterRecip, setFilterRecip]   = useState('');

  // ── Load notifications ──────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    setError('');
    try {
      const data = await adminFetchNotifications(adminToken, {
        search:         search  || undefined,
        notif_type:     filterType  || undefined,
        recipient_type: filterRecip || undefined,
      });
      setNotifications(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [adminToken, search, filterType, filterRecip]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [load]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    const created = await adminCreateNotification(adminToken, payload);
    setNotifications(prev => [created, ...prev]);
  };

  // ── Update ──────────────────────────────────────────────────────────────────
  const handleUpdate = async (id, payload) => {
    const updated = await adminUpdateNotification(adminToken, id, payload);
    setNotifications(prev => prev.map(n => n.id === id ? updated : n));
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await adminDeleteNotification(adminToken, deleteTarget.id);
    setNotifications(prev => prev.filter(n => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Prepare form initial values for editing ─────────────────────────────────
  const openEdit = (notif) => {
    setFormModal({
      edit: {
        ...notif,
        recipient_username: notif.recipient_username || '',
        attachment_url:     notif.attachment_url     || '',
        external_link:      notif.external_link      || '',
        expires_at: notif.expires_at
          ? new Date(notif.expires_at + 'Z').toISOString().slice(0, 16)
          : '',
      },
    });
  };

  const pinnedCount = notifications.filter(n => n.is_pinned).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-xl">Notifications</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {pinnedCount > 0 && <> · {pinnedCount} pinned</>}
          </p>
        </div>
        <button
          onClick={() => setFormModal({ edit: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg"
        >
          <FiPlus size={15} /> Create Notification
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title or message…"
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

        {/* Type filter */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Types</option>
          {NOTIF_TYPES.map(t => (
            <option key={t} value={t}>{TYPE_META[t].label}</option>
          ))}
        </select>

        {/* Recipient filter */}
        <select
          value={filterRecip}
          onChange={e => setFilterRecip(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Recipients</option>
          <option value="ALL">All Students</option>
          <option value="USER">Specific Student</option>
        </select>

        {/* Refresh */}
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
        <div className="text-center py-20 text-slate-400">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <FiBell size={36} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No notifications found</p>
          <p className="text-slate-600 text-sm mt-1">
            {search || filterType || filterRecip ? 'Try adjusting your filters.' : 'Create one to get started.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-800/50">
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Recipient</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Created</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Expires</th>
                  <th className="text-right px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map(n => (
                  <tr
                    key={n.id}
                    className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-4"><TypeBadge type={n.notif_type} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {n.is_pinned && <FiBookmark size={12} className="text-amber-400 flex-shrink-0" />}
                        <span className="font-medium text-white max-w-[200px] truncate">{n.title}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 max-w-[220px] truncate">{n.message}</p>
                    </td>
                    <td className="px-5 py-4">
                      {n.recipient_type === 'ALL' ? (
                        <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <FiUsers size={12} className="text-blue-400" /> All Students
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <FiUser size={12} className="text-purple-400" />
                          @{n.recipient_username || n.recipient_user_id}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(n.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {n.expires_at ? (
                        <span className={`${new Date(n.expires_at + 'Z') < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                          {new Date(n.expires_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short',
                          })}
                        </span>
                      ) : (
                        <span className="text-slate-700">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(n)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(n)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {formModal && (
        <NotifFormModal
          initial={formModal.edit}
          onClose={() => setFormModal(null)}
          onSave={formModal.edit?.id
            ? (payload) => handleUpdate(formModal.edit.id, payload)
            : handleCreate
          }
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteModal
          notif={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
