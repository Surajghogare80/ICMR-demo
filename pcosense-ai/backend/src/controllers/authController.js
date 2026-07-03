// src/controllers/authController.js
import { authService } from '../services/authService.js';
import { validationResult } from 'express-validator';
import {
  sendSuccess,
  sendCreated,
  sendValidationError,
  sendError,
} from '../utils/responseHelper.js';
import { MESSAGES } from '../constants/index.js';

export const authController = {
  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      const { user, token } = await authService.register(req.body, req.ip);
      return sendCreated(res, MESSAGES.REGISTER_SUCCESS, { user, token });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      const { user, token } = await authService.login(req.body, req.ip);
      return sendSuccess(res, MESSAGES.LOGIN_SUCCESS, { user, token });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.user._id);
      return sendSuccess(res, MESSAGES.PROFILE_FETCHED, { user });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async updateProfile(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      const user = await authService.updateProfile(req.user._id, req.body, req.ip);
      return sendSuccess(res, MESSAGES.PROFILE_UPDATED, { user });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async changePassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      await authService.changePassword(req.user._id, req.body, req.ip);
      return sendSuccess(res, MESSAGES.PASSWORD_CHANGED);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },
};
