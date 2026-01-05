// --- START OF FILE api.js ---
import axios from 'axios';

// 1. Get the URL from the .env file
// If it's not found, it defaults to localhost (which is why you are seeing localhost errors)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

// 2. Interceptor to attach the token
api.interceptors.request.use(
  (config) => {
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