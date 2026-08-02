import React, { useState, useEffect } from 'react';
import { FiX, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';

const DetailRow = ({ label, value, darkMode }) => (
  <div className="flex items-center justify-between text-sm sm:text-base">
    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{label}</span>
    <span className={`${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{value}</span>
  </div>
);

const ProfileModal = ({ isOpen, onClose, darkMode }) => {
  const { token, logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      setIsPasswordMode(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      setPasswordError('');
      setPasswordSuccess('');
      fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load profile', err);
        setLoading(false);
      });
    }
  }, [isOpen, token]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new !== passwordData.confirm) {
      return setPasswordError('New passwords do not match');
    }
    if (passwordData.new.length < 6) {
      return setPasswordError('New password must be at least 6 characters');
    }

    setUpdatingPassword(true);
    try {
     const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update password');

      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
      setTimeout(() => setIsPasswordMode(false), 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-[#1e293b] text-white' : 'bg-white text-slate-800'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className="text-xl font-semibold">{isPasswordMode ? 'Update Password' : 'Profile'}</h2>
          <button 
            onClick={() => {
              if (isPasswordMode && !passwordSuccess) setIsPasswordMode(false);
              else onClose();
            }}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : isPasswordMode ? (
            <form onSubmit={handlePasswordUpdate} className="flex flex-col">
              {passwordError && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-lg">{passwordError}</div>}
              {passwordSuccess && <div className="p-3 mb-4 text-sm text-green-500 bg-green-100/10 border border-green-500/20 rounded-lg">{passwordSuccess}</div>}
              
              <label className="text-sm font-medium mb-1 opacity-80">Current Password</label>
              <input type="password" required value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className={`mb-4 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />

              <label className="text-sm font-medium mb-1 opacity-80">New Password</label>
              <input type="password" required value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className={`mb-4 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />

              <label className="text-sm font-medium mb-1 opacity-80">Confirm New Password</label>
              <input type="password" required value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} className={`mb-8 px-4 py-2 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} />

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsPasswordMode(false)} className={`flex-1 py-2.5 font-medium rounded-lg transition-colors ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
                <button type="submit" disabled={updatingPassword || passwordSuccess} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:opacity-50">
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center">
              
              {/* Avatar Section */}
              <div className="w-24 h-24 mb-4 rounded-full bg-[#104b6d] flex items-center justify-center text-white shadow-lg overflow-hidden border-4 border-white dark:border-gray-800">
                <FiUser size={48} className="opacity-70 mt-4" />
              </div>
              
              <h3 className="text-xl font-medium mb-1">
                {profile?.full_name || profile?.username || 'User'}
              </h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-8 font-medium">
                view profile
              </button>

              {/* Details List */}
              <div className="w-full space-y-6 mb-8">
                <DetailRow label="Username" value={profile?.username || 'User'} darkMode={darkMode} />
                <DetailRow label="Domain" value={profile?.domain || 'Data Science'} darkMode={darkMode} />
                <DetailRow label="Current Course" value={profile?.current_course || 'Data Science'} darkMode={darkMode} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full max-w-[300px]">
                <button 
                  onClick={() => setIsPasswordMode(true)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Update Password
                </button>
                <button 
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium rounded-lg shadow-md transition-colors"
                >
                  Logout
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
