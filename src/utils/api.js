/**
 * Centralised backend base URL.
 *
 * In production (Vercel) set the environment variable:
 *   VITE_API_URL=https://lms-data-science.onrender.com
 *
 * For local development, leave VITE_API_URL unset and the
 * fallback http://localhost:8000 will be used automatically.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
