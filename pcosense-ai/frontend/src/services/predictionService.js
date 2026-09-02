// src/services/predictionService.js
import api from './api.js';
import { historyStore } from './historyStore.js';

export const predictionService = {
  async create(data) {
    const res = await api.post('/predictions', data);
    // Backend is stateless — persist the result in the browser for history.
    const stored = historyStore.addPrediction(res.data?.data?.prediction || {});
    if (res.data?.data) {
      res.data.data.prediction = stored;
    }
    return res.data;
  },

  async getAll(params = {}) {
    return {
      success: true,
      message: 'Predictions loaded.',
      data: historyStore.listPredictions({
        page: params.page || 1,
        limit: params.limit || 10,
      }),
    };
  },

  async getById(id) {
    const prediction = historyStore.getPrediction(id);
    return { success: !!prediction, data: { prediction } };
  },

  async delete(id) {
    historyStore.removePrediction(id);
    return { success: true, message: 'Prediction deleted.' };
  },
};
