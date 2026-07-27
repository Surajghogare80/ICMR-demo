// src/services/adminService.js
import { userRepository } from '../repositories/userRepository.js';
import { predictionRepository } from '../repositories/predictionRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';

export const adminService = {
  async getDashboardStats() {
    const [totalUsers, totalPredictions, predictionStats, recentLogs, recentPredictions] = await Promise.all([
      userRepository.countAll(),
      predictionRepository.countAll(),
      predictionRepository.getStatsByResult(),
      activityLogRepository.findRecent(20),
      predictionRepository.getRecentPredictions(10),
    ]);

    const statsMap = predictionStats.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    return {
      totalUsers,
      totalPredictions,
      highRiskCount: statsMap['High Risk'] || 0,
      lowRiskCount: statsMap['Low Risk'] || 0,
      recentLogs,
      recentPredictions,
    };
  },

  async getAllUsers(options) {
    return userRepository.findAll({}, options);
  },

  async deleteUser(userId, adminId, ip) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    if (user.role === 'admin') {
      const error = new Error('Cannot delete an admin account.');
      error.statusCode = 403;
      throw error;
    }

    await userRepository.deleteById(userId);

    await activityLogRepository.create({
      userId: adminId,
      action: 'ADMIN_USER_DELETE',
      details: `Admin deleted user: ${user.email}`,
      ipAddress: ip,
    });

    return true;
  },

  async getActivityLogs(limit = 50) {
    return activityLogRepository.findRecent(limit);
  },
};
