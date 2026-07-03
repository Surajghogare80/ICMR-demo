// src/services/authService.js
import api from './api.js';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/auth/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  async changePassword(data) {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },
};
