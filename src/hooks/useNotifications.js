/**
 * useNotifications — custom hook for student notification state.
 *
 * - Fetches notifications on mount and when the bell panel is opened.
 * - Polls /api/notifications/unread-count every 45 seconds (lightweight).
 * - Exposes helpers: markRead, markAllRead, refresh.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchMyNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationService';

const POLL_INTERVAL_MS = 45_000; // 45 seconds

export default function useNotifications(token) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [panelOpen, setPanelOpen]         = useState(false);
  const intervalRef = useRef(null);

  // ── Fetch full list (called on open and refresh) ──────────────────────────
  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchMyNotifications(token);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('[useNotifications] refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Poll unread count (lightweight integer query) ─────────────────────────
  const pollCount = useCallback(async () => {
    if (!token) return;
    try {
      const { count } = await fetchUnreadCount(token);
      setUnreadCount(count);
    } catch (_) { /* silent */ }
  }, [token]);

  // ── On mount: load data and start polling ─────────────────────────────────
  useEffect(() => {
    if (!token) return;
    refresh();
    intervalRef.current = setInterval(pollCount, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [token, refresh, pollCount]);

  // ── When panel opens, refresh full list ───────────────────────────────────
  useEffect(() => {
    if (panelOpen && token) refresh();
  }, [panelOpen, token, refresh]);

  // ── Mark one notification as read ─────────────────────────────────────────
  const markRead = useCallback(async (id) => {
    if (!token) return;
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    await markNotificationRead(token, id);
  }, [token]);

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    if (!token) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead(token);
  }, [token]);

  return {
    notifications,
    unreadCount,
    loading,
    panelOpen,
    setPanelOpen,
    markRead,
    markAllRead,
    refresh,
  };
}
