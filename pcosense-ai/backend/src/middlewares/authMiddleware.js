// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { sendUnauthorized, sendForbidden } from '../utils/responseHelper.js';
import logger from '../utils/logger.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendUnauthorized(res, 'No authentication token provided. Please login.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user via Repository Pattern (resolves ID casting issues in mock mode)
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return sendUnauthorized(res, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return sendForbidden(res, 'Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token. Please login again.');
    }
    return sendUnauthorized(res, 'Authentication failed.');
  }
};

/**
 * Restrict access to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendForbidden(
        res,
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      );
    }
    next();
  };
};

/**
 * Admin only shortcut
 */
export const adminOnly = restrictTo('admin');
