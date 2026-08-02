/**
 * Centralised backend base URL.
 *
 * In production (Netlify / Vercel) set the environment variable in the
 * hosting dashboard — NOT in netlify.toml [build.environment]:
 *   VITE_API_URL = https://lms-data-science.onrender.com
 *
 * Vite bakes env vars at build time. An empty string set in netlify.toml
 * would override the dashboard value and make the fallback kick in, so
 * we guard against both undefined AND empty-string here.
 *
 * For local development, leave VITE_API_URL unset (or set it to
 * http://localhost:8000 in a .env.local file) — the fallback handles it.
 */
export const API_URL =
  (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim())
    ? import.meta.env.VITE_API_URL.trim()
    : 'http://localhost:8000';
