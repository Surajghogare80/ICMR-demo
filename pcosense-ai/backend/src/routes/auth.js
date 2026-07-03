// src/routes/auth.js
import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} from '../validators/authValidator.js';

const router = Router();

// Public routes
router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, updateProfileValidator, authController.updateProfile);
router.put('/change-password', protect, changePasswordValidator, authController.changePassword);

export default router;
