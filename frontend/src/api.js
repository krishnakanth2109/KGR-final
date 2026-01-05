// --- START OF FILE api.js ---
import axios from 'axios';

// FIX: In Vite, we must use import.meta.env.
// We removed 'process.env' because accessing it causes a ReferenceError in Vite.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Axios Interceptor: Adds the token to headers automatically if it exists
api.interceptors.request.use(
  (config) => {
    // Using sessionStorage as requested
    const token = sessionStorage.getItem('admin-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;