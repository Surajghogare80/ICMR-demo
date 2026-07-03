// src/services/predictionService.js
import api from './api.js';

export const predictionService = {
  async create(data) {
    const res = await api.post('/predictions', data);
    return res.data;
  },

  async getAll(params = {}) {
    const res = await api.get('/predictions', { params });
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/predictions/${id}`);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/predictions/${id}`);
    return res.data;
  },
};

export const adminService = {
  async getDashboard() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getAllUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  async getLogs(params = {}) {
    const res = await api.get('/admin/logs', { params });
    return res.data;
  },
};
