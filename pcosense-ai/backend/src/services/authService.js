// src/services/authService.js
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import logger from '../utils/logger.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const authService = {
  async register({ name, email, password }, ip) {
    // Check duplicate email
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const user = await userRepository.create({ name, email, password });

    // Log activity
    await activityLogRepository.create({
      userId: user._id,
      action: 'REGISTER',
      details: `New user registered: ${email}`,
      ipAddress: ip,
    });

    const token = generateToken(user._id);
    logger.info(`New user registered: ${email}`);

    return { user: user.toSafeObject(), token };
  },

  async login({ email, password }, ip) {
    // Fetch user with password field
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Your account has been deactivated.');
      error.statusCode = 403;
      throw error;
    }

    await userRepository.updateLastLogin(user._id);

    await activityLogRepository.create({
      userId: user._id,
      action: 'LOGIN',
      details: `User logged in from ${ip}`,
      ipAddress: ip,
    });

    const token = generateToken(user._id);
    logger.info(`User logged in: ${email}`);

    return { user: user.toSafeObject(), token };
  },

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  async updateProfile(userId, updates, ip) {
    // Prevent role elevation through profile update
    delete updates.role;
    delete updates.password;

    const user = await userRepository.updateById(userId, updates);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    await activityLogRepository.create({
      userId,
      action: 'PROFILE_UPDATE',
      details: 'Profile information updated.',
      ipAddress: ip,
    });

    return user;
  },

  async changePassword(userId, { currentPassword, newPassword }, ip) {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId)).email
    );

    if (!(await user.comparePassword(currentPassword))) {
      const error = new Error('Current password is incorrect.');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    await activityLogRepository.create({
      userId,
      action: 'PASSWORD_CHANGE',
      details: 'Password changed successfully.',
      ipAddress: ip,
    });

    return true;
  },
};
