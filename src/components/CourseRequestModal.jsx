import React, { useState, useEffect } from 'react';
import { FiX, FiSend, FiHelpCircle, FiBook, FiCheckCircle, FiClock, FiMessageSquare, FiList, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { submitCourseRequest, fetchMyCourseRequests } from '../services/courseRequestService';

const STATUS_BADGES = {
  PENDING:   { label: 'Pending',   cls: 'bg-amber-500/15 text-amber-500 border-amber-500/30' },
  IN_REVIEW: { label: 'In Review', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  PLANNED:   { label: 'Planned',   cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  RESOLVED:  { label: 'Resolved',  cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  REJECTED:  { label: 'Declined',  cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

export default function CourseRequestModal({ isOpen, onClose, darkMode }) {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [requestType, setRequestType] = useState('COURSE_REQUEST');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [myRequests, setMyRequests] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      loadHistory();
    }
  }, [isOpen, token]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchMyCourseRequests(token);
      setMyRequests(data);
    } catch (_) {
      /* silent */
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !description.trim()) {
      return setError('Please fill in both title and description.');
    }

    setLoading(true);
    try {
      await submitCourseRequest(token, {
        request_type: requestType,
        title: title.trim(),
        description: description.trim(),
      });
      setSuccess('Your request has been submitted successfully! The admin team will review it soon.');
      setTitle('');
      setDescription('');
      loadHistory();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to submit your request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border flex flex-col max-h-[90vh] ${
        darkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-gray-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${
          darkMode ? 'border-slate-700' : 'border-gray-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
              <FiBook size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base">Queries & Course Requests</h2>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Request new courses or ask questions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              darkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className={`flex border-b flex-shrink-0 px-6 pt-2 gap-2 ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'new'
                ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FiPlusCircle size={14} /> Submit New
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FiList size={14} /> My Submissions ({myRequests.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'new' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                  <FiCheckCircle size={16} />
                  <span>{success}</span>
                </div>
              )}

              {/* Request Type Selector */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Type of Request
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestType('COURSE_REQUEST')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      requestType === 'COURSE_REQUEST'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : darkMode ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiBook size={14} /> Course Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestType('QUERY')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      requestType === 'QUERY'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : darkMode ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiHelpCircle size={14} /> General Query
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {requestType === 'COURSE_REQUEST' ? 'Requested Course Name *' : 'Query Topic / Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={requestType === 'COURSE_REQUEST' ? 'e.g., Advanced MLOps & LLM Deployment' : 'e.g., Clarification regarding PyTorch module'}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Details / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={requestType === 'COURSE_REQUEST' ? 'Tell us why you want this course and key topics you hope to see covered...' : 'Describe your query or question in detail...'}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all resize-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-60"
                >
                  <FiSend size={15} />
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {historyLoading ? (
                <div className="text-center py-10 text-xs opacity-60">Loading your submissions...</div>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-10 text-xs opacity-60 flex flex-col items-center gap-2">
                  <FiBook size={28} className="opacity-40" />
                  <span>You haven't submitted any requests or queries yet.</span>
                </div>
              ) : (
                myRequests.map((req) => {
                  const badge = STATUS_BADGES[req.status] || STATUS_BADGES.PENDING;
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border flex flex-col gap-2 ${
                        darkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            req.request_type === 'COURSE_REQUEST' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {req.request_type === 'COURSE_REQUEST' ? 'Course Request' : 'General Query'}
                          </span>
                          <h4 className="font-bold text-sm leading-snug">{req.title}</h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {req.description}
                      </p>

                      {req.admin_response && (
                        <div className={`mt-2 p-3 rounded-lg border text-xs ${
                          darkMode ? 'bg-blue-900/20 border-blue-800/40 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'
                        }`}>
                          <div className="flex items-center gap-1 font-bold mb-1">
                            <FiMessageSquare size={12} /> Admin Response:
                          </div>
                          <p>{req.admin_response}</p>
                        </div>
                      )}

                      <span className={`text-[10px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Submitted on {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
