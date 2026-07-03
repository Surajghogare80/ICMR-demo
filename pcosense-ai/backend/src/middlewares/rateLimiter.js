// src/middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseHelper.js';

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      sendError(res, message, 429);
    },
  });

// Strict limiter for auth endpoints
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  20,
  'Too many authentication attempts. Please try again after 15 minutes.'
);

// General API limiter
export const apiLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP. Please try again after 15 minutes.'
);

// Prediction endpoint limiter
export const predictionLimiter = createLimiter(
  60 * 60 * 1000, // 1 hour
  30,
  'Too many prediction requests. Please try again after 1 hour.'
);
