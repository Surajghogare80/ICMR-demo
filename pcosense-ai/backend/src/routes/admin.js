// src/routes/admin.js
import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/logs', adminController.getLogs);

export default router;
