// src/utils/responseHelper.js
/**
 * Standard API response format for PCOSense AI
 * { success, message, data, timestamp }
 */

export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

export const sendCreated = (res, message, data = null) =>
  sendSuccess(res, message, data, 201);

export const sendNotFound = (res, message = 'Resource not found.') =>
  sendError(res, message, 404);

export const sendUnauthorized = (res, message = 'Authentication required.') =>
  sendError(res, message, 401);

export const sendForbidden = (res, message = 'Access denied.') =>
  sendError(res, message, 403);

export const sendBadRequest = (res, message, errors = null) =>
  sendError(res, message, 400, errors);

export const sendValidationError = (res, errors) =>
  sendError(res, 'Validation failed.', 422, errors);
