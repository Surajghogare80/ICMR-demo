// backend/src/ai/predictionRouter.js
/**
 * Prediction Router
 * Orchestrates the full prediction pipeline: Mode Selection -> Mapping -> Validation -> Execution
 */

import { exec } from "child_process";
import path from "path";
import fs from "fs";
import util from "util";
import { PREDICTION_MODES, MODELS } from "./modelRegistry.js";
import { mapFeaturesForModel } from "./featureMapping.js";
import { validateFeatures } from "./modelValidator.js";

const execPromise = util.promisify(exec);

/**
 * Executes the R prediction script using a temporary JSON file.
 * @param {string} predictionMode
 * @param {Object} mappedFeatures
 * @returns {Object} Prediction result
 */
const executeRPrediction = async (predictionMode, mappedFeatures) => {
  const modelId    = MODELS[predictionMode].id;
  const scriptPath = path.resolve(process.cwd(), "ai", "predict.R");
  const tempPath   = path.resolve(process.cwd(), `ai/tmp_predict_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);

  // Write strict payload to temp file
  const rPayload = JSON.stringify({ modelId, features: mappedFeatures });
  fs.writeFileSync(tempPath, rPayload, "utf8");

  // Resolve Rscript path
  let rCmd = "Rscript";
  const rFallback = "C:\\Program Files\\R\\R-4.6.1\\bin\\Rscript.exe";
  if (fs.existsSync(rFallback)) rCmd = `"${rFallback}"`;

  try {
    const { stdout, stderr } = await execPromise(`${rCmd} "${scriptPath}" "${tempPath}"`);

    // Clean up temp file
    try { fs.unlinkSync(tempPath); } catch (_) {}

    if (stderr && !stdout.trim()) {
      throw new Error(`R Script Error: ${stderr}`);
    }

    // Extract the last JSON block from stdout (skips any R warnings)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`No JSON returned from R. Output was: ${stdout}`);
    }

    const result = JSON.parse(jsonMatch[0]);

    if (result.error) {
      throw new Error(`R Model Error: ${result.error}`);
    }

    return result;
  } catch (err) {
    // Best effort cleanup
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
    throw new Error(`Prediction execution failed: ${err.message}`);
  }
};

/**
 * Main entry point for the prediction request.
 * @param {Object} input - Raw user input (personal, menstrual, symptoms, lifestyle)
 * @param {string} requestedMode - Explicit predictionMode from frontend
 */
export const runPredictionPipeline = async (input, requestedMode) => {
  let mode = requestedMode;

  // Fallback: infer mode from data if frontend didn't send an explicit mode
  if (!mode) {
    const p = input.personal || {};
    const m = input.menstrual || {};
    const hasBlood     = p.fsh != null || p.lh != null || p.tsh != null || p.amh != null;
    const hasUltrasound = m.follicleNoLeft != null || m.endometrium != null;

    if (hasBlood && hasUltrasound) mode = PREDICTION_MODES.COMBINED;
    else if (hasUltrasound)        mode = PREDICTION_MODES.ULTRASOUND;
    else if (hasBlood)             mode = PREDICTION_MODES.BLOOD_TEST;
    else                           mode = PREDICTION_MODES.SYMPTOMS_ONLY;
  }

  // Validate the mode exists in the registry
  if (!MODELS[mode]) {
    throw new Error(`Unknown prediction mode: '${mode}'. Valid modes: ${Object.keys(MODELS).join(", ")}`);
  }

  console.log(`[Prediction Router] Mode: ${mode} → Model: ${MODELS[mode].id}`);

  // 1. Map features exactly for the selected model
  const mappedFeatures = mapFeaturesForModel(input, mode);

  // 2. Validate strictly — no extra features, no target leakage
  validateFeatures(mappedFeatures, mode);

  // 3. Execute R Model
  const prediction = await executeRPrediction(mode, mappedFeatures);

  // 4. Return with metadata
  return {
    mode,
    modelUsed: MODELS[mode].id,
    ...prediction,
  };
};
