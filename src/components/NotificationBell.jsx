import React, { useRef, useEffect } from 'react';
import {
  FiBell, FiX, FiCheck, FiCheckSquare,
  FiAlertTriangle, FiCalendar, FiBookOpen,
  FiAward, FiInfo, FiPaperclip, FiExternalLink,
} from 'react-icons/fi';
import useNotifications from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';

// ── Type → icon + colour mapping ─────────────────────────────────────────────
const TYPE_META = {
  ANNOUNCEMENT: { Icon: FiInfo,          bg: 'bg-blue-500/15',   text: 'text-blue-400',   label: 'Announcement' },
  ASSIGNMENT:   { Icon: FiBookOpen,      bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Assignment'   },
  EVENT:        { Icon: FiCalendar,      bg: 'bg-green-500/15',  text: 'text-green-400',  label: 'Event'        },
  WARNING:      { Icon: FiAlertTriangle, bg: 'bg-red-500/15',    text: 'text-red-400',    label: 'Warning'      },
  ACHIEVEMENT:  { Icon: FiAward,         bg: 'bg-amber-500/15',  text: 'text-amber-400',  label: 'Achievement'  },
  GENERAL:      { Icon: FiBell,          bg: 'bg-slate-500/15',  text: 'text-slate-400',  label: 'General'      },
};

const getMeta = (type) => TYPE_META[type?.toUpperCase()] || TYPE_META.GENERAL;

// ── Time-ago helper ───────────────────────────────────────────────────────────
function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString + 'Z').getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── Single notification row ───────────────────────────────────────────────────
function NotifRow({ notif, onRead, darkMode }) {
  const { Icon, bg, text, label } = getMeta(notif.notif_type);

  const handleClick = () => {
    if (!notif.is_read) onRead(notif.id);
    if (notif.external_link) window.open(notif.external_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150
        ${notif.is_read
          ? (darkMode ? 'bg-transparent hover:bg-white/5' : 'bg-transparent hover:bg-gray-50')
          : (darkMode ? 'bg-blue-900/10 hover:bg-blue-900/20' : 'bg-blue-50/70 hover:bg-blue-50')
        }
        border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}
      `}
    >
      {/* Type icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${bg} flex items-center justify-center mt-0.5`}>
        <Icon size={16} className={text} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {notif.is_pinned && <span className="mr-1 text-amber-400">📌</span>}
            {notif.title}
          </p>
          <span className={`text-[11px] whitespace-nowrap flex-shrink-0 mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
        <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {notif.message}
        </p>

        {/* Links */}
        {(notif.attachment_url || notif.external_link) && (
          <div className="flex gap-3 mt-1.5">
            {notif.attachment_url && (
              <a
                href={notif.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className={`flex items-center gap-1 text-[11px] font-medium ${text} hover:underline`}
              >
                <FiPaperclip size={11} /> Attachment
              </a>
            )}
            {notif.external_link && (
              <a
                href={notif.external_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className={`flex items-center gap-1 text-[11px] font-medium ${text} hover:underline`}
              >
                <FiExternalLink size={11} /> Open Link
              </a>
            )}
          </div>
        )}

        {/* Unread dot */}
        {!notif.is_read && (
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            <span className={`text-[10px] font-medium text-blue-500`}>New</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Bell Component ───────────────────────────────────────────────────────
export default function NotificationBell({ darkMode }) {
  const { token } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    panelOpen,
    setPanelOpen,
    markRead,
    markAllRead,
  } = useNotifications(token);

  const panelRef = useRef(null);
  const btnRef   = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handle = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        btnRef.current   && !btnRef.current.contains(e.target)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [panelOpen, setPanelOpen]);

  return (
    <div className="relative flex-shrink-0">
      {/* Bell button */}
      <button
        ref={btnRef}
        id="notification-bell-btn"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        onClick={() => setPanelOpen(o => !o)}
        className={`
          relative p-2 rounded-xl transition-all duration-200
          ${darkMode
            ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
            : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }
          ${panelOpen ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}
        `}
      >
        <FiBell size={20} />
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {panelOpen && (
        <div
          ref={panelRef}
          className={`
            absolute right-0 top-[calc(100%+8px)] z-50
            w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[400px]
            rounded-2xl shadow-2xl overflow-hidden
            border
            ${darkMode
              ? 'bg-gray-900 border-white/10'
              : 'bg-white border-gray-200/80'
            }
            animate-slideDown
          `}
          style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0 ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  title="Mark all as read"
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    darkMode
                      ? 'text-blue-400 hover:bg-blue-500/10'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <FiCheckSquare size={13} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setPanelOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <FiX size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className={`flex justify-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-14 gap-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FiBell size={36} className="opacity-30" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs opacity-70">We'll notify you when something arrives</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotifRow
                  key={n.id}
                  notif={n}
                  onRead={markRead}
                  darkMode={darkMode}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className={`px-4 py-2.5 flex-shrink-0 border-t text-center ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <p className={`text-[11px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                {unreadCount === 0 ? ' · all read' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
