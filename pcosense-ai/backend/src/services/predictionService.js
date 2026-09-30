// backend/src/services/predictionService.js
/**
 * PREDICTION SERVICE
 *
 * Stateless: runs the real R model via the prediction routing pipeline and
 * returns the result. Nothing is persisted server-side — the frontend keeps
 * prediction history in the browser's localStorage.
 */
import logger from '../utils/logger.js';
import { runPredictionPipeline } from '../ai/predictionRouter.js';


export const predictionService = {
  async createPrediction({ personal, menstrual, symptoms, lifestyle, predictionMode }) {
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

    const rInputs = { personal, menstrual, symptoms, lifestyle };

    let aiResult;
    try {
      // Execute the centralized prediction routing pipeline
      aiResult = await runPredictionPipeline(rInputs, predictionMode);
      aiResult.engine = 'REAL_R_MODEL';

      console.log(`\n======================================================`);
      console.log(`🤖 [PREDICTION ENGINE] ROUTED RF PREDICTION`);
      console.log(`   Mode        : ${aiResult.mode}`);
      console.log(`   Model Used  : ${aiResult.modelUsed}`);
      console.log(`   Result      : ${aiResult.result}`);
      console.log(`   Probability : ${aiResult.probability}%`);
      console.log(`   Confidence  : ${aiResult.confidence}%`);
      console.log(`======================================================\n`);

      logger.info(`[REAL_R_MODEL] Prediction generated using ${aiResult.modelUsed}: ${aiResult.result}`);
    } catch (err) {
      logger.error(`Failed to execute ML R model: ${err.message}`);
      const error = new Error(`Prediction failed: ${err.message}`);
      if (err.message.includes("missing information")) {
        error.statusCode = 400;
      }
      throw error;
    }

    // Assemble a plain result object in the shape the frontend expects. The
    // frontend reassigns `_id` / `createdAt` when it stores this in localStorage.
    const prediction = {
      _id: `pred_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...aiResult,
      personalMetricId: extendedPersonal,
      menstrualHistoryId: { ...menstrual },
      clinicalSymptomId: { ...symptoms },
      lifestyleHabitId: normalizedLifestyle,
    };

    return { prediction, aiResult };
  },
};
