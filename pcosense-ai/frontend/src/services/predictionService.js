// src/services/predictionService.js
import api from './api.js';
import { historyStore } from './historyStore.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A response with no application-level message means the request never
// actually reached our backend's own error handlers — e.g. a network error/
// timeout, or (common in local dev) the backend mid-restart from `node
// --watch` picking up a saved file — rather than a genuine validation/model
// error, which always carries a message (see backend responseHelper.js /
// errorMiddleware.js). That's transient and usually clears within a second
// or two, so it's worth one silent retry before bothering the user.
const isTransientFailure = (err) => !err?.data?.message;

export const predictionService = {
  async create(data) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await api.post('/predictions', data, { suppressGlobalErrorToast: true });
        // Backend is stateless — persist the result in the browser for history.
        const stored = historyStore.addPrediction(res.data?.data?.prediction || {});
        if (res.data?.data) {
          res.data.data.prediction = stored;
        }
        return res.data;
      } catch (err) {
        if (attempt === 0 && isTransientFailure(err)) {
          // eslint-disable-next-line no-await-in-loop
          await wait(1500);
          continue;
        }
        throw err;
      }
    }
    // Unreachable — the loop above always returns or throws.
    return undefined;
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
