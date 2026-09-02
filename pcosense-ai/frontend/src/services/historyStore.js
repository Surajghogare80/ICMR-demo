// src/services/historyStore.js
//
// Client-side store for prediction history. With authentication removed, the
// browser's localStorage is the source of truth for the Dashboard and the
// Prediction History page. Every read/write is defensive so a private window,
// cleared storage, or corrupt data never breaks the UI.

const STORAGE_KEY = 'prabha_predictions';

const genId = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return `pred_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable / quota exceeded — history simply won't persist */
  }
};

export const historyStore = {
  /**
   * Persist a freshly created prediction. Returns the stored record (with a
   * stable local `_id` and `createdAt`).
   */
  addPrediction(prediction = {}) {
    const record = {
      ...prediction,
      _id: prediction._id && !String(prediction._id).startsWith('pred_')
        ? prediction._id
        : genId(),
      createdAt: prediction.createdAt || new Date().toISOString(),
    };
    const list = readAll();
    list.unshift(record);
    writeAll(list);
    return record;
  },

  /**
   * Paginated newest-first list, shaped like the old backend response.
   */
  listPredictions({ page = 1, limit = 10 } = {}) {
    const list = readAll();
    const total = list.length;
    const start = (page - 1) * limit;
    return {
      predictions: list.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  getPrediction(id) {
    return readAll().find((p) => String(p._id) === String(id)) || null;
  },

  removePrediction(id) {
    const list = readAll().filter((p) => String(p._id) !== String(id));
    writeAll(list);
    return true;
  },
};

export default historyStore;
