// In local dev this stays empty so requests go through Vite's dev proxy
// (see vite.config.js) to the backend on localhost:5050. In production the
// frontend and backend are separate deployments (e.g. Vercel + Render), so
// this must be set to the backend's full origin via VITE_API_BASE_URL.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
