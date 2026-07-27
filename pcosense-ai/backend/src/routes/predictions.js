// src/routes/predictions.js
import { Router } from 'express';
import { predictionController } from '../controllers/predictionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { predictionLimiter } from '../middlewares/rateLimiter.js';
import { predictionValidator } from '../validators/predictionValidator.js';

const router = Router();

// All prediction routes require authentication
router.use(protect);

router.post('/', predictionLimiter, predictionValidator, predictionController.create);
router.get('/', predictionController.getAll);
router.get('/:id', predictionController.getById);
router.delete('/:id', predictionController.delete);

export default router;

