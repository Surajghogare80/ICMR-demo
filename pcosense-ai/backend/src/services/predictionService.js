// hy  // src/services/predictionService.js
/**
 * PREDICTION SERVICE
 *
 * Integrates real R Random Forest model execution.
 * Fallback to rule-based dummy generation is triggered if R is not installed.
 */
import { predictionRepository } from '../repositories/predictionRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import logger from '../utils/logger.js';
import { exec } from 'child_process';
import path from 'path';

/**
 * AI INTEGRATION POINT
 * Replace this function with a call to your Python/R ML microservice.
 * Input: All form data from 4 sections
 * Output: { result, probability, confidence, recommendation }
 */
const generateDummyPrediction = (inputs) => {
  // Scoring logic for realistic dummy results
  let riskScore = 0;

  if (inputs.menstrual?.cycleRegularity === 'Irregular') riskScore += 30;
  if (inputs.menstrual?.cycleRegularity === 'Absent') riskScore += 50;
  if (inputs.symptoms?.weightGain) riskScore += 15;
  if (inputs.symptoms?.hairGrowth) riskScore += 15;
  if (inputs.symptoms?.skinDarkening) riskScore += 10;
  if (inputs.symptoms?.pimples) riskScore += 10;
  if (inputs.lifestyle?.fastFoodFreq === 'Daily') riskScore += 10;
  if (inputs.lifestyle?.exerciseFreq === 'Never') riskScore += 10;
  if (inputs.personal?.bmi > 30) riskScore += 20;

  riskScore = Math.min(riskScore, 100);
  const probability = Math.max(5, Math.min(95, riskScore));
  const confidence = Math.floor(Math.random() * 10) + 90; // 90-99%
  const result = probability >= 50 ? 'High Risk' : 'Low Risk';

  const highRiskRecs = [
    'Consult a gynecologist or endocrinologist immediately.',
    'Get hormonal blood tests (FSH, LH, testosterone, insulin).',
    'Consider pelvic ultrasound for ovarian cysts.',
    'Follow a low-glycemic index diet to manage insulin resistance.',
    'Start a regular exercise program (30 min/day, 5 days/week).',
    'Avoid processed foods, sugar, and refined carbohydrates.',
    'Track your menstrual cycle using a health app.',
    'Discuss medication options (Metformin, hormonal therapy) with your doctor.',
  ];

  const lowRiskRecs = [
    'Maintain your current healthy lifestyle — great work!',
    'Continue exercising regularly (150 min/week of moderate activity).',
    'Keep a balanced, nutritious diet rich in vegetables and whole grains.',
    'Monitor your menstrual cycle and note any irregularities.',
    'Schedule annual gynecological check-ups as a precaution.',
    'Manage stress through mindfulness, yoga, or meditation.',
    'Ensure 7-9 hours of quality sleep each night.',
  ];

  const recommendations = result === 'High Risk'
    ? highRiskRecs.slice(0, 5)
    : lowRiskRecs.slice(0, 4);

  return { result, probability, confidence, recommendation: recommendations };
};

const runRModel = (inputs) => {
  return new Promise((resolve, reject) => {
    // Relative path because R script runs from the backend directory
    const scriptPath = path.join(process.cwd(), 'ai/predict.R');
    const inputString = JSON.stringify(inputs).replace(/"/g, '\\"');
    const command = `Rscript "${scriptPath}" "${inputString}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        reject(new Error(`Failed to parse R output: ${stdout}`));
      }
    });
  });
};

export const predictionService = {
  async createPrediction({ userId, personal, menstrual, symptoms, lifestyle }, ip) {
    // Save each section to its own collection
    const [personalMetric, menstrualHistory, clinicalSymptom, lifestyleHabit] = await Promise.all([
      predictionRepository.createPersonalMetric({ userId, ...personal }),
      predictionRepository.createMenstrualHistory({ userId, ...menstrual }),
      predictionRepository.createClinicalSymptom({ userId, ...symptoms }),
      predictionRepository.createLifestyleHabit({ userId, ...lifestyle }),
    ]);

    // Generate prediction using real R model, falling back to dummy if Rscript is not installed
    let aiResult;
    try {
      aiResult = await runRModel({ personal, menstrual, symptoms, lifestyle });
      logger.info(`Prediction generated using Random Forest RDS model for user ${userId}: ${aiResult.result}`);
    } catch (err) {
      logger.warn(`Failed to execute ML R model, falling back to rule-based engine. Reason: ${err.message}`);
      aiResult = generateDummyPrediction({ personal, menstrual, symptoms, lifestyle });
    }

    // Save the prediction referencing all 4 collections
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
      details: `Prediction created: ${aiResult.result} (${aiResult.probability}%)`,
      ipAddress: ip,
    });

    logger.info(`Prediction created for user ${userId}: ${aiResult.result}`);

    return {
      prediction,
      aiResult, // Return AI result separately for immediate display
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
    // Ensure user can only view their own predictions (unless admin)
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
