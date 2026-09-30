// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';
import i18n from '../i18n.js';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || i18n.t('errors.generic');
    const status = error.response?.status;

    // Callers that retry transient failures themselves (see
    // predictionService.create) set this to avoid a toast firing on an
    // attempt they're about to silently retry, and to avoid double toasts
    // (this interceptor's + the caller's own) when it ultimately fails too.
    if (!error.config?.suppressGlobalErrorToast) {
      if (status === 429) {
        toast.error(i18n.t('errors.too_many_requests'));
      } else if (status >= 500) {
        toast.error(i18n.t('errors.server_error'));
      }
    }

    return Promise.reject({ message, status, data: error.response?.data });
  }
);

export default api;
