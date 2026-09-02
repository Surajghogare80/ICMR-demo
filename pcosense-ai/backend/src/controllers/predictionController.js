// src/controllers/predictionController.js
import { predictionService } from '../services/predictionService.js';
import { validationResult } from 'express-validator';
import {
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
        req.body,
        req.ip
      );
      return sendCreated(res, MESSAGES.PREDICTION_CREATED, { prediction, aiResult });
    } catch (error) {
      logger.error('Error in predictionController.create:', error.stack || error);
      return sendError(res, error.message, error.statusCode || 500);
    }
  },
};
