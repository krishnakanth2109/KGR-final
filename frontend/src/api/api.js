// --- START OF FILE src/api/api.js ---
import axios from 'axios';

// Determine Base URL (Vite compatible)
const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  process.env.REACT_APP_API_URL || 
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------
// REQUEST INTERCEPTOR
// logic: Use Session Storage EVERYWHERE.
// ----------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // 1. Get tokens from SESSION STORAGE only
    const adminToken = sessionStorage.getItem('admin-token');
    const studentToken = sessionStorage.getItem('student-token');

    // 2. Pick the available token (Prioritize admin if both exist, though unlikely)
    const token = adminToken || studentToken;

    // 3. Attach to header if it exists
    if (token) {
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------
// RESPONSE INTERCEPTOR
// ----------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We log the error but we don't block the UI flow heavily since we removed strict protection
    if (error.response && error.response.status === 401) {
      console.warn("API Warning: 401 Unauthorized (Check server logs)");
    }
    return Promise.reject(error);
  }
);

export default api;