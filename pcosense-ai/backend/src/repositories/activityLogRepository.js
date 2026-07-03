// src/repositories/activityLogRepository.js
import ActivityLog from '../models/ActivityLog.js';

const mockLogs = [];

export const activityLogRepository = {
  async create(data) {
    if (global.dbMode === 'mock') {
      const log = {
        _id: 'mock_log_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockLogs.push(log);
      return log;
    }
    return ActivityLog.create(data);
  },

  async findRecent(limit = 50) {
    if (global.dbMode === 'mock') {
      return mockLogs
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    }
    return ActivityLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  },

  async findByUserId(userId, limit = 20) {
    if (global.dbMode === 'mock') {
      return mockLogs
        .filter((l) => l.userId.toString() === userId.toString())
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    }
    return ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  },
};

