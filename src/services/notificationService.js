/**
 * Notification API service
 * All requests use the centralised API_URL from utils/api.js
 */
import { API_URL } from '../utils/api';

const headers = (token, extra = {}) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  ...extra,
});

// ── Student endpoints ─────────────────────────────────────────────────────────

/** Fetch all active notifications visible to the current user. */
export async function fetchMyNotifications(token) {
  const res = await fetch(`${API_URL}/api/notifications`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

/** Get unread notification count (lightweight — used for polling). */
export async function fetchUnreadCount(token) {
  const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
    headers: headers(token),
  });
  if (!res.ok) return { count: 0 };
  return res.json();
}

/** Mark a single notification as read. */
export async function markNotificationRead(token, notifId) {
  const res = await fetch(`${API_URL}/api/notifications/${notifId}/read`, {
    method: 'POST',
    headers: headers(token),
  });
  return res.ok;
}

/** Mark all notifications as read. */
export async function markAllNotificationsRead(token) {
  const res = await fetch(`${API_URL}/api/notifications/read-all`, {
    method: 'POST',
    headers: headers(token),
  });
  return res.ok;
}

// ── Admin endpoints ───────────────────────────────────────────────────────────

/** Fetch all notifications for the admin panel (with optional filters). */
export async function adminFetchNotifications(adminToken, filters = {}) {
  const params = new URLSearchParams();
  if (filters.search)         params.set('search', filters.search);
  if (filters.notif_type)     params.set('notif_type', filters.notif_type);
  if (filters.recipient_type) params.set('recipient_type', filters.recipient_type);
  if (filters.date_from)      params.set('date_from', filters.date_from);
  if (filters.date_to)        params.set('date_to', filters.date_to);

  const qs = params.toString();
  const res = await fetch(
    `${API_URL}/api/notifications/admin${qs ? '?' + qs : ''}`,
    { headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' } }
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

/** Create a notification (admin). */
export async function adminCreateNotification(adminToken, payload) {
  const res = await fetch(`${API_URL}/api/notifications`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create notification');
  return data;
}

/** Update a notification (admin). */
export async function adminUpdateNotification(adminToken, id, payload) {
  const res = await fetch(`${API_URL}/api/notifications/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to update notification');
  return data;
}

/** Delete a notification (admin). */
export async function adminDeleteNotification(adminToken, id) {
  const res = await fetch(`${API_URL}/api/notifications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to delete notification');
  return true;
}
