import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiX, FiCheck, FiLogOut, FiEye, FiEyeOff, FiUsers, FiRefreshCw, FiKey } from 'react-icons/fi';
import logo from '../assets/logo.png';

/* ─── helpers ───────────────────────────────────────────────── */
const ADMIN_TOKEN_KEY = 'dsm_admin_token';

const api = async (path, options = {}, token = null) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Request failed');
  return data;
};

/* ─── Edit Modal ─────────────────────────────────────────────── */
const EditModal = ({ user, token, onClose, onSaved }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.plain_password || '');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      const updated = await api(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ username: username || undefined, password: password || undefined }),
      }, token);
      onSaved(updated);
      setVisiblePasswords(prev => ({ ...prev, [updated.id]: true }));
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">Edit User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:outline-none transition-colors placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? 'Saving…' : <><FiCheck size={15} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Admin Password Modal ───────────────────────────────────── */
const AdminPasswordModal = ({ token, onClose, onUpdated }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }, token);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
      onUpdated(data.access_token);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Change Admin Password</h3>
        {error && <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>}
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New admin password"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white mb-4 focus:outline-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300">Cancel</button>
          <button onClick={handleUpdate} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white">
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Admin Login ────────────────────────────────────────────── */
const AdminLoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
      onLogin(data.access_token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl p-2">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Data Science Master</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Admin Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:outline-none transition-colors placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Admin Dashboard ───────────────────────────────────── */
const AdminDashboard = () => {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showAdminPassModal, setShowAdminPassModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = useCallback(async (q = '') => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api(`/api/admin/users${q ? `?search=${encodeURIComponent(q)}` : ''}`, {}, token);
      setUsers(data);
    } catch (e) {
      if (e.message.includes('401') || e.message.toLowerCase().includes('invalid')) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers(search);
  }, [token, fetchUsers]);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  };

  const handleDelete = async (userId) => {
    try {
      await api(`/api/admin/users/${userId}`, { method: 'DELETE' }, token);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const togglePassword = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!token) return <AdminLoginPage onLogin={setToken} />;

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl p-1 flex items-center justify-center shadow">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Admin Panel</h1>
            <p className="text-slate-400 text-[11px]">Data Science Master</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-300">
            <FiUsers size={14} />
            <span>{users.length} users</span>
          </div>
          <button
            onClick={() => fetchUsers(search)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowAdminPassModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Change admin password"
          >
            <FiKey size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search bar */}
        <div className="relative mb-6 max-w-md">
          <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No users found.</div>
        ) : (
          <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-800/50">
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">#</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Username</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Password</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Domain</th>
                    <th className="text-left px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Joined</th>
                    <th className="text-right px-5 py-3.5 text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4 text-slate-500 font-mono text-xs">{i + 1}</td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-white">{user.username}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-300">
                            {visiblePasswords[user.id]
                              ? (user.plain_password || <span className="text-slate-500 italic">not stored</span>)
                              : (user.plain_password ? '••••••••' : <span className="text-slate-500 italic">not stored</span>)
                            }
                          </span>
                          {user.plain_password && (
                            <button
                              onClick={() => togglePassword(user.id)}
                              className="text-slate-500 hover:text-blue-400 transition-colors"
                              title={visiblePasswords[user.id] ? 'Hide' : 'Show'}
                            >
                              {visiblePasswords[user.id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{user.domain || '—'}</td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditUser(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Edit user"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete user"
                          >
                            <FiTrash2 size={15} />
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
      </main>

      {/* Edit Modal */}
      {editUser && (
        <EditModal
          user={editUser}
          token={token}
          onClose={() => setEditUser(null)}
          onSaved={(updated) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Delete User?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">@{deleteConfirm.username}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Admin Password Modal */}
      {showAdminPassModal && (
        <AdminPasswordModal
          token={token}
          onClose={() => setShowAdminPassModal(false)}
          onUpdated={(newToken) => setToken(newToken)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
