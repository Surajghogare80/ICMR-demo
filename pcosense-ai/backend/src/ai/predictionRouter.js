// backend/src/ai/predictionRouter.js
/**
 * Prediction Router
 * Orchestrates the full prediction pipeline: Mode Selection -> Mapping -> Validation -> Execution
 *
 * Each model in modelRegistry.js names the R script that runs it (defaulting to
 * predict.R, which loads by id out of rf_model_new.rds). A mode with its own
 * `script` (currently: symptoms_only -> predict_symptoms_only.R) is executed by
 * that script alone, which loads only its own .rds file.
 */

import { exec } from "child_process";
import path from "path";
import fs from "fs";
import util from "util";
import { fileURLToPath } from "url";
import { PREDICTION_MODES, MODELS } from "./modelRegistry.js";
import { mapFeaturesForModel } from "./featureMapping.js";
import { validateFeatures } from "./modelValidator.js";

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const aiDir      = path.resolve(__dirname, "../../ai");

/**
 * Executes the R prediction script using a temporary JSON file.
 * The script run is whichever modelRegistry.js names for this mode (see
 * `modelInfo.script`), so each mode is pinned to its own model file.
 *
 * @param {string} predictionMode
 * @param {Object} mappedFeatures
 * @returns {Object} Prediction result
 */
const executeRPrediction = async (predictionMode, mappedFeatures) => {
  const modelInfo  = MODELS[predictionMode];

  let modelId     = modelInfo.id;
  let modelSource = modelInfo.source;
  let scriptName  = modelInfo.script || "predict.R";

  // Missing-feature routing (see modelRegistry.js for the mode-2 contract):
  //   * a MANDATORY field is missing        -> hard alert, run nothing
  //   * only OPTIONAL field(s) are missing  -> NA-capable fallback model
  //   * everything present                  -> primary model
  let routedBy = "primary";
  if (modelInfo.fallback) {
    if (Array.isArray(modelInfo.mandatory)) {
      const missingMandatory = modelInfo.mandatory.filter(
        (k) => mappedFeatures[k] === null || mappedFeatures[k] === undefined
      );
      if (missingMandatory.length > 0) {
        // Message must contain "missing information" so predictionService
        // maps it to HTTP 400 and the frontend shows its missing-fields alert.
        throw new Error(
          `The trained model requires the following missing information to make a safe prediction: ${missingMandatory.join(", ")}`
        );
      }
    }

    if (modelInfo.fallback.trigger === "missing_optional_features") {
      // Any null left here can only be an optional field.
      const anyOptionalMissing = Object.values(mappedFeatures).some((v) => v === null);
      if (anyOptionalMissing) {
        modelId     = modelInfo.fallback.id;
        modelSource = modelInfo.fallback.source;
        scriptName  = modelInfo.fallback.script;
        routedBy    = "missing_optional_fallback";
      }
    }
  }

  const scriptPath = path.resolve(aiDir, scriptName);
  const tempPath   = path.resolve(
    aiDir,
    `tmp_predict_${Date.now()}_${Math.random().toString(36).slice(2)}.json`
  );

  console.log(`[Prediction Router] Mode: ${predictionMode} | Model: ${modelId} | Source: ${modelSource} | Routed: ${routedBy}`);
  
  // Log provided vs NA features for transparency
  const provided = Object.keys(mappedFeatures).filter(k => mappedFeatures[k] !== null);
  const missing = Object.keys(mappedFeatures).filter(k => mappedFeatures[k] === null);
  console.log(`[Prediction Router] Provided fields (${provided.length}):`, provided.join(", "));
  console.log(`[Prediction Router] NA fields (${missing.length}):`, missing.join(", "));

  // Write payload to temp JSON file (predict.R reads this)
  const rPayload = JSON.stringify({ modelId, features: mappedFeatures });
  fs.writeFileSync(tempPath, rPayload, "utf8");

  // Resolve Rscript path — prefer system Rscript, fallback to absolute path
  let rCmd = "Rscript";
  const rFallback = "C:\\Program Files\\R\\R-4.6.1\\bin\\Rscript.exe";
  if (fs.existsSync(rFallback)) rCmd = `"${rFallback}"`;

  try {
    const { stdout, stderr } = await execPromise(`${rCmd} "${scriptPath}" "${tempPath}"`, { cwd: aiDir });

    // Clean up temp file
    try { fs.unlinkSync(tempPath); } catch (_) {}

    if (stderr && !stdout.trim()) {
      throw new Error(`R Script Error: ${stderr}`);
    }

    // Extract JSON block from stdout (strips any R warnings that may prefix output)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`No JSON returned from R. Output was: ${stdout}`);
    }

    const result = JSON.parse(jsonMatch[0]);

    if (result.error) {
      throw new Error(`R Model Error: ${result.error}`);
    }

    // Report the model actually executed (may be the fallback), not the
    // registry's primary entry.
    return { ...result, modelUsed: modelId, modelSource, routedBy };
  } catch (err) {
    // Best-effort cleanup on failure
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
    throw new Error(`Prediction execution failed: ${err.message}`);
  }
};

/**
 * Main entry point for the prediction request.
 * @param {Object} input         - Raw user input (personal, menstrual, symptoms, lifestyle)
 * @param {string} requestedMode - Explicit predictionMode from frontend
 */
export const runPredictionPipeline = async (input, requestedMode) => {
  let mode = requestedMode;

  // Validate the mode exists in the registry
  if (!MODELS[mode]) {
    throw new Error(
      `Unknown prediction mode: '${mode}'. Valid modes: ${Object.keys(MODELS).join(", ")}`
    );
  }

  const modelMeta = MODELS[mode];

  // 1. Map features exactly for the selected model
  const mappedFeatures = mapFeaturesForModel(input, mode);

  // 2. Validate strictly — no target leakage
  validateFeatures(mappedFeatures, mode);

  // 3. Execute R model (predict.R natively handles NA)
  const prediction = await executeRPrediction(mode, mappedFeatures);

  // 4. Return with metadata
  return {
    mode,
    modelUsed:   modelMeta.id,
    modelSource: modelMeta.source,
    ...prediction,
  };
};
