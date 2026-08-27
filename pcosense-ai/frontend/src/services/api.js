// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import i18n from '../i18n.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prabha_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || i18n.t('errors.generic');
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('prabha_token');
      localStorage.removeItem('prabha_user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (status === 429) {
      toast.error(i18n.t('errors.too_many_requests'));
    } else if (status >= 500) {
      toast.error(i18n.t('errors.server_error'));
    }

    return Promise.reject({ message, status, data: error.response?.data });
  }
);

export default api;
