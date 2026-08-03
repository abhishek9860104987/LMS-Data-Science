/**
 * Course Request & User Query API Service
 * All requests use the centralised API_URL from utils/api.js
 */
import { API_URL } from '../utils/api';

const headers = (token, extra = {}) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  ...extra,
});

// ── Student Endpoints ────────────────────────────────────────────────────────

/** Submit a new course request or query */
export async function submitCourseRequest(token, payload) {
  const res = await fetch(`${API_URL}/api/course-requests`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to submit request');
  return data;
}

/** Fetch all course requests / queries submitted by the logged-in student */
export async function fetchMyCourseRequests(token) {
  const res = await fetch(`${API_URL}/api/course-requests`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error('Failed to fetch your requests');
  return res.json();
}

// ── Admin Endpoints ──────────────────────────────────────────────────────────

/** Fetch all student course requests & queries for the Admin Panel */
export async function adminFetchCourseRequests(adminToken, filters = {}) {
  const params = new URLSearchParams();
  if (filters.search)       params.set('search', filters.search);
  if (filters.status)       params.set('status', filters.status);
  if (filters.request_type) params.set('request_type', filters.request_type);

  const qs = params.toString();
  const res = await fetch(
    `${API_URL}/api/course-requests/admin${qs ? '?' + qs : ''}`,
    { headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' } }
  );
  if (!res.ok) throw new Error('Failed to fetch course requests');
  return res.json();
}

/** Update status or add admin response to a request */
export async function adminUpdateCourseRequest(adminToken, id, payload) {
  const res = await fetch(`${API_URL}/api/course-requests/admin/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to update request');
  return data;
}

/** Delete a request */
export async function adminDeleteCourseRequest(adminToken, id) {
  const res = await fetch(`${API_URL}/api/course-requests/admin/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to delete request');
  return true;
}
