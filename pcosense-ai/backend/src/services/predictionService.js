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
import fs from 'fs';

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
  if (inputs.menstrual?.familyHistory) riskScore += 15;
  if (inputs.symptoms?.weightGain) riskScore += 15;
  if (inputs.symptoms?.hairGrowth) riskScore += 15;
  if (inputs.symptoms?.skinDarkening) riskScore += 10;
  if (inputs.symptoms?.pimples) riskScore += 10;
  if (inputs.lifestyle?.fastFoodFreq === 'Yes') riskScore += 10;
  if (inputs.lifestyle?.exerciseFreq === 'No') riskScore += 10;
  if (inputs.personal?.bmi > 30) riskScore += 20;
  // WHR risk factor
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
    const scriptPath = path.join(process.cwd(), 'ai/predict.R');
    const tempInputPath = path.join(process.cwd(), `ai/temp_input_${Date.now()}.json`);

    try {
      fs.writeFileSync(tempInputPath, JSON.stringify(inputs));
    } catch (err) {
      return reject(new Error(`Failed to write temporary R input file: ${err.message}`));
    }

    // Default to Rscript in PATH, fallback to Windows installed path if not found
    let rCmd = 'Rscript';
    const fallbackPath = 'C:\\Program Files\\R\\R-4.6.1\\bin\\Rscript.exe';
    if (fs.existsSync(fallbackPath)) {
      rCmd = `"${fallbackPath}"`;
    }

    const command = `${rCmd} "${scriptPath}" "${tempInputPath}"`;

    exec(command, (error, stdout, stderr) => {
      // Clean up temp file
      if (fs.existsSync(tempInputPath)) {
        try { fs.unlinkSync(tempInputPath); } catch (_) {}
      }

      if (error) {
        return reject(new Error(`R script execution failed: ${stderr || error.message}`));
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        reject(new Error(`Failed to parse R output: ${stdout || stderr}`));
      }
    });
  });
};

export const predictionService = {
  async createPrediction({ userId, personal, menstrual, symptoms, lifestyle }, ip) {
    // Destructure extended blood markers + new fields so they map correctly to DB fields
    const {
      vitaminD3, shbg, fastingInsulin, insulinResistance,
      waist, hip, waistHipRatio, rbs,
      ...corePersonal
    } = personal;

    const extendedPersonal = {
      ...corePersonal,
      // Body measurements
      ...(waist !== undefined && waist !== '' ? { waist: Number(waist) } : {}),
      ...(hip !== undefined && hip !== '' ? { hip: Number(hip) } : {}),
      ...(waistHipRatio !== undefined && waistHipRatio !== '' ? { waistHipRatio: Number(waistHipRatio) } : {}),
      // Standard blood markers
      ...(rbs !== undefined && rbs !== '' ? { rbs: Number(rbs)} : {}),
      // Extended blood markers — DB field names match schema
      ...(vitaminD3 !== undefined && vitaminD3 !== '' ? { vitD3: Number(vitaminD3) } : {}),
      ...(shbg !== undefined && shbg !== '' ? { shbg: Number(shbg) } : {}),
      ...(fastingInsulin !== undefined && fastingInsulin !== '' ? { fastingInsulin: Number(fastingInsulin) } : {}),
      ...(insulinResistance !== undefined && insulinResistance !== null ? { insulinResistance } : {}),
    };

    // Normalize and apply defaults to lifestyle fields before saving
    const normalizedLifestyle = {
      fastFoodFreq: lifestyle?.fastFoodFreq || 'No',
      exerciseFreq: lifestyle?.exerciseFreq || 'Yes',
      stressLevel:  lifestyle?.stressLevel  || 'Moderate',
      sleepHours:   Number(lifestyle?.sleepHours) || 7,
    };

    // Save each section to its own collection
    const [personalMetric, menstrualHistory, clinicalSymptom, lifestyleHabit] = await Promise.all([
      predictionRepository.createPersonalMetric({ userId, ...extendedPersonal }),
      predictionRepository.createMenstrualHistory({ userId, ...menstrual }),
      predictionRepository.createClinicalSymptom({ userId, ...symptoms }),
      predictionRepository.createLifestyleHabit({ userId, ...normalizedLifestyle }),
    ]);

    // Build the full inputs object for the R model — all live values included
    const rInputPersonal = {
      ...personal,
      waist: waist !== undefined && waist !== '' ? Number(waist) : undefined,
      hip: hip !== undefined && hip !== '' ? Number(hip) : undefined,
      waistHipRatio: waistHipRatio !== undefined && waistHipRatio !== '' ? Number(waistHipRatio) : undefined,
      rbs: rbs !== undefined && rbs !== '' ? Number(rbs) : undefined,
      vitaminD3: vitaminD3 !== undefined && vitaminD3 !== '' ? Number(vitaminD3) : undefined,
      shbg: shbg !== undefined && shbg !== '' ? Number(shbg) : undefined,
      fastingInsulin: fastingInsulin !== undefined && fastingInsulin !== '' ? Number(fastingInsulin) : undefined,
      insulinResistance: insulinResistance !== undefined && insulinResistance !== null ? insulinResistance : undefined,
    };

    const rInputs = { personal: rInputPersonal, menstrual, symptoms, lifestyle: normalizedLifestyle };

    // Generate prediction using real R model, falling back to dummy if Rscript is not installed
    let aiResult;
    try {
      aiResult = await runRModel(rInputs);
      aiResult.engine = 'REAL_R_MODEL';
      
      console.log(`\n======================================================`);
      console.log(`🤖 [PREDICTION ENGINE] REAL R RDS MODEL PREDICTION`);
      console.log(`   User ID     : ${userId}`);
      console.log(`   Result      : ${aiResult.result}`);
      console.log(`   Probability : ${aiResult.probability}%`);
      console.log(`   Confidence  : ${aiResult.confidence}%`);
      console.log(`======================================================\n`);

      logger.info(`[REAL_R_MODEL] Prediction generated using Random Forest RDS model for user ${userId}: ${aiResult.result} (${aiResult.probability}%)`);
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
      prediction: {
        ...prediction.toObject ? prediction.toObject() : prediction,
        // Embed the full personalMetric so the result page can render the blood report card
        personalMetricId: personalMetric,
        menstrualHistoryId: menstrualHistory,
      },
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
