// src/routes/predictions.js
import { Router } from 'express';
import { predictionController } from '../controllers/predictionController.js';
import { predictionLimiter } from '../middlewares/rateLimiter.js';
import { predictionValidator } from '../validators/predictionValidator.js';

const router = Router();

// Predictions are stateless and open — history is stored client-side.
router.post('/', predictionLimiter, predictionValidator, predictionController.create);

export default router;
