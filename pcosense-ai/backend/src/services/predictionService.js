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

/**
 * AI INTEGRATION POINT
 * Fallback dummy rule engine for when R fails.
 */
const generateDummyPrediction = (inputs) => {
  let riskScore = 0;
  if (inputs.menstrual?.cycleRegularity === 'Irregular') riskScore += 30;
  if (inputs.menstrual?.cycleRegularity === 'Absent') riskScore += 50;
  if (inputs.menstrual?.familyHistory) riskScore += 15;
  if (inputs.symptoms?.weightGain) riskScore += 15;
  if (inputs.symptoms?.hairGrowth) riskScore += 15;
  if (inputs.symptoms?.skinDarkening) riskScore += 10;
  if (inputs.symptoms?.pimples) riskScore += 10;
  if (inputs.lifestyle?.fastFoodFreq === 'Yes') riskScore += 10;
  if (inputs.lifestyle?.exerciseFreq === 'No') riskScore += 10;
  if (inputs.personal?.bmi > 30) riskScore += 20;
  if (inputs.personal?.waistHipRatio >= 0.85) riskScore += 15;

  riskScore = Math.min(riskScore, 100);
  const probability = Math.max(5, Math.min(95, riskScore));
  const confidence = Math.max(probability, 100 - probability);
  const result = probability >= 50 ? 'High Risk' : 'Low Risk';

  const highRiskRecs = [
    'Consult a gynecologist or endocrinologist immediately.',
    'Get hormonal blood tests (FSH, LH, testosterone, insulin).',
    'Consider pelvic ultrasound for ovarian cysts.',
    'Follow a low-glycemic index diet to manage insulin resistance.',
    'Start a regular exercise program (30 min/day, 5 days/week).',
  ];
  const lowRiskRecs = [
    'Maintain your current healthy lifestyle — great work!',
    'Continue exercising regularly (150 min/week of moderate activity).',
    'Keep a balanced, nutritious diet rich in vegetables and whole grains.',
    'Monitor your menstrual cycle and note any irregularities.',
  ];
  const recommendations = result === 'High Risk' ? highRiskRecs : lowRiskRecs;

  return { result, probability, confidence, recommendation: recommendations };
};

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
      fastFoodFreq: lifestyle?.fastFoodFreq || 'No',
      exerciseFreq: lifestyle?.exerciseFreq || 'Yes',
      stressLevel:  lifestyle?.stressLevel  || 'Moderate',
      sleepHours:   Number(lifestyle?.sleepHours) || 7,
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
      logger.warn(`Failed to execute ML R model, falling back to rule-based engine. Reason: ${err.message}`);
      aiResult = generateDummyPrediction(rInputs);
      aiResult.engine = 'DUMMY_FALLBACK';

      console.log(`\n======================================================`);
      console.log(`⚠️ [PREDICTION ENGINE] FALLBACK DUMMY RULE PREDICTION`);
      console.log(`   User ID     : ${userId}`);
      console.log(`   Result      : ${aiResult.result}`);
      console.log(`   Probability : ${aiResult.probability}%`);
      console.log(`   Fallback Cause: ${err.message}`);
      console.log(`======================================================\n`);
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
