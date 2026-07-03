// src/controllers/predictionController.js
import { predictionService } from '../services/predictionService.js';
import { validationResult } from 'express-validator';
import {
  sendSuccess,
  sendCreated,
  sendValidationError,
  sendError,
} from '../utils/responseHelper.js';
import { MESSAGES } from '../constants/index.js';
import logger from '../utils/logger.js';

export const predictionController = {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      const { prediction, aiResult } = await predictionService.createPrediction(
        { userId: req.user._id, ...req.body },
        req.ip
      );
      return sendCreated(res, MESSAGES.PREDICTION_CREATED, { prediction, aiResult });
    } catch (error) {
      logger.error('Error in predictionController.create:', error.stack || error);
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await predictionService.getUserPredictions(req.user._id, {
        page: parseInt(page),
        limit: parseInt(limit),
      });
      return sendSuccess(res, MESSAGES.PREDICTIONS_FETCHED, result);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async getById(req, res) {
    try {
      const prediction = await predictionService.getPredictionById(
        req.params.id,
        req.user._id
      );
      return sendSuccess(res, MESSAGES.PREDICTION_FETCHED, { prediction });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async delete(req, res) {
    try {
      await predictionService.deletePrediction(req.params.id, req.user._id, req.ip);
      return sendSuccess(res, MESSAGES.PREDICTION_DELETED);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },
};
