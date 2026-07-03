// src/models/ActivityLog.js
import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'REGISTER',
        'LOGIN',
        'LOGOUT',
        'PROFILE_UPDATE',
        'PASSWORD_CHANGE',
        'PREDICTION_CREATED',
        'PREDICTION_DELETED',
        'ADMIN_USER_DELETE',
        'ADMIN_STATS_VIEW',
      ],
    },
    details: {
      type: String,
      default: null,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: auto-delete logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
