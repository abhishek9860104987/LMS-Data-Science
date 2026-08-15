import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);   // always start null; we verify before trusting
  const [loading, setLoading] = useState(true);

  // On mount: read stored token and verify it against the real API
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Validate the stored token by hitting a protected endpoint
    fetch(`${API_URL}/api/progress`, {
      headers: { 'Authorization': `Bearer ${storedToken}` }
    })
    .then(res => {
      if (res.ok) {
        // Token is valid — restore session
        setToken(storedToken);
        setUser({ username: storedUsername });
      } else {
        // Token is invalid / from old backend — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    })
    .catch(() => {
      // Network error — still clear stale token to be safe
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    })
    .finally(() => setLoading(false));
  }, []);

  // Send periodic heartbeat pings to track online presence
  useEffect(() => {
    if (!token) return;

    const sendHeartbeat = () => {
      fetch(`${API_URL}/api/auth/heartbeat`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 45000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.error);

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('username', data.username);
    setToken(data.access_token);
    setUser({ username: data.username });
    return data;
  };

  const register = async (username, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.error);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, register, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
