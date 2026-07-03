// src/controllers/adminController.js
import { adminService } from '../services/adminService.js';
import {
  sendSuccess,
  sendError,
} from '../utils/responseHelper.js';
import { MESSAGES } from '../constants/index.js';

export const adminController = {
  async getDashboard(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      return sendSuccess(res, MESSAGES.STATS_FETCHED, stats);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await adminService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
      });
      return sendSuccess(res, MESSAGES.USERS_FETCHED, result);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async deleteUser(req, res) {
    try {
      await adminService.deleteUser(req.params.id, req.user._id, req.ip);
      return sendSuccess(res, MESSAGES.USER_DELETED);
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  async getLogs(req, res) {
    try {
      const { limit = 50 } = req.query;
      const logs = await adminService.getActivityLogs(parseInt(limit));
      return sendSuccess(res, MESSAGES.LOGS_FETCHED, { logs });
    } catch (error) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },
};
