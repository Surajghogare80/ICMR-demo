// backend/src/services/predictionService.js
/**
 * PREDICTION SERVICE
 *
 * Integrates real R Random Forest model execution via predictionRouter.
 * Fallback to rule-based dummy generation is triggered if R is not installed or model fails.
 */
import { predictionRepository } from '../repositories/predictionRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import logger from '../utils/logger.js';
import { runPredictionPipeline } from '../ai/predictionRouter.js';


export const predictionService = {
  async createPrediction({ userId, personal, menstrual, symptoms, lifestyle, predictionMode }, ip) {
    const {
      vitaminD3, shbg, fastingInsulin, insulinResistance,
      waist, hip, waistHipRatio, rbs,
      ...corePersonal
    } = personal;

    const extendedPersonal = {
      ...corePersonal,
      ...(waist !== undefined && waist !== '' ? { waist: Number(waist) } : {}),
      ...(hip !== undefined && hip !== '' ? { hip: Number(hip) } : {}),
      ...(waistHipRatio !== undefined && waistHipRatio !== '' ? { waistHipRatio: Number(waistHipRatio) } : {}),
      ...(rbs !== undefined && rbs !== '' ? { rbs: Number(rbs)} : {}),
      ...(vitaminD3 !== undefined && vitaminD3 !== '' ? { vitD3: Number(vitaminD3) } : {}),
      ...(shbg !== undefined && shbg !== '' ? { shbg: Number(shbg) } : {}),
      ...(fastingInsulin !== undefined && fastingInsulin !== '' ? { fastingInsulin: Number(fastingInsulin) } : {}),
      ...(insulinResistance !== undefined && insulinResistance !== null ? { insulinResistance } : {}),
    };

    const normalizedLifestyle = {
      fastFoodFreq: lifestyle?.fastFoodFreq,
      exerciseFreq: lifestyle?.exerciseFreq,
      stressLevel:  lifestyle?.stressLevel,
      sleepHours:   lifestyle?.sleepHours ? Number(lifestyle.sleepHours) : undefined,
    };

    const [personalMetric, menstrualHistory, clinicalSymptom, lifestyleHabit] = await Promise.all([
      predictionRepository.createPersonalMetric({ userId, ...extendedPersonal }),
      predictionRepository.createMenstrualHistory({ userId, ...menstrual }),
      predictionRepository.createClinicalSymptom({ userId, ...symptoms }),
      predictionRepository.createLifestyleHabit({ userId, ...normalizedLifestyle }),
    ]);

    const rInputs = { personal, menstrual, symptoms, lifestyle };

    let aiResult;
    try {
      // Execute the centralized prediction routing pipeline
      aiResult = await runPredictionPipeline(rInputs, predictionMode);
      aiResult.engine = 'REAL_R_MODEL';
      
      console.log(`\n======================================================`);
      console.log(`🤖 [PREDICTION ENGINE] ROUTED RF PREDICTION`);
      console.log(`   User ID     : ${userId}`);
      console.log(`   Mode        : ${aiResult.mode}`);
      console.log(`   Model Used  : ${aiResult.modelUsed}`);
      console.log(`   Result      : ${aiResult.result}`);
      console.log(`   Probability : ${aiResult.probability}%`);
      console.log(`   Confidence  : ${aiResult.confidence}%`);
      console.log(`======================================================\n`);

      logger.info(`[REAL_R_MODEL] Prediction generated using ${aiResult.modelUsed} for user ${userId}: ${aiResult.result}`);
    } catch (err) {
      logger.error(`Failed to execute ML R model: ${err.message}`);
      const error = new Error(`Prediction failed: ${err.message}`);
      if (err.message.includes("missing information")) {
        error.statusCode = 400;
      }
      throw error;
    }

    const prediction = await predictionRepository.createPrediction({
      userId,
      personalMetricId: personalMetric._id,
      menstrualHistoryId: menstrualHistory._id,
      clinicalSymptomId: clinicalSymptom._id,
      lifestyleHabitId: lifestyleHabit._id,
      ...aiResult,
    });

    await activityLogRepository.create({
      userId,
      action: 'PREDICTION_CREATED',
      details: `Prediction created via ${aiResult.engine}: ${aiResult.result} (${aiResult.probability}%)`,
      ipAddress: ip,
    });

    logger.info(`Prediction created for user ${userId}: ${aiResult.result}`);

    return {
      prediction: {
        ...prediction.toObject ? prediction.toObject() : prediction,
        personalMetricId: personalMetric,
        menstrualHistoryId: menstrualHistory,
      },
      aiResult,
    };
  },

  async getUserPredictions(userId, options) {
    return predictionRepository.findByUserId(userId, options);
  },

  async getPredictionById(id, userId) {
    const prediction = await predictionRepository.findById(id);
    if (!prediction) {
      const error = new Error('Prediction not found.');
      error.statusCode = 404;
      throw error;
    }
    if (prediction.userId._id.toString() !== userId.toString()) {
      const error = new Error('Not authorized to view this prediction.');
      error.statusCode = 403;
      throw error;
    }
    return prediction;
  },

  async deletePrediction(id, userId, ip) {
    const prediction = await predictionRepository.findById(id);
    if (!prediction) {
      const error = new Error('Prediction not found.');
      error.statusCode = 404;
      throw error;
    }
    if (prediction.userId._id.toString() !== userId.toString()) {
      const error = new Error('Not authorized to delete this prediction.');
      error.statusCode = 403;
      throw error;
    }

    await predictionRepository.deleteById(id);

    await activityLogRepository.create({
      userId,
      action: 'PREDICTION_DELETED',
      details: `Prediction ${id} deleted.`,
      ipAddress: ip,
    });

    return true;
  },
};
