// src/constants/index.js
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const PREDICTION_RESULTS = {
  LOW_RISK: 'Low Risk',
  HIGH_RISK: 'High Risk',
  POSITIVE: 'Positive',
  NEGATIVE: 'Negative',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_FETCHED: 'Profile fetched successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PREDICTION_CREATED: 'Prediction saved successfully.',
  PREDICTIONS_FETCHED: 'Predictions fetched successfully.',
  PREDICTION_FETCHED: 'Prediction fetched successfully.',
  PREDICTION_DELETED: 'Prediction deleted successfully.',
  USERS_FETCHED: 'Users fetched successfully.',
  USER_DELETED: 'User deleted successfully.',
  STATS_FETCHED: 'Statistics fetched successfully.',
  LOGS_FETCHED: 'Activity logs fetched successfully.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Authentication required. Please login.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  SERVER_ERROR: 'An internal server error occurred.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_INVALID: 'Invalid or expired token.',
  PASSWORD_CHANGED: 'Password changed successfully.',
};
