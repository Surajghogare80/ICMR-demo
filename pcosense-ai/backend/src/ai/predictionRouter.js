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

  // Missing-feature routing (see modelRegistry.js per-mode contracts):
  //   * everything present                  -> primary model
  //   * a MANDATORY field is missing        -> hard alert, run nothing
  //                                            (skipped when fallback.cascade —
  //                                            the cascade script owns that call)
  //   * only OPTIONAL field(s) are missing  -> NA-capable fallback model / script
  let routedBy = "primary";
  if (modelInfo.fallback) {
    const isCascade = modelInfo.fallback.cascade === true;

    if (!isCascade && Array.isArray(modelInfo.mandatory)) {
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
      // Gate the primary model on its own predictors only — `passthroughFeatures`
      // are mapped for a fallback's benefit and must not force the primary path.
      const passthrough = new Set(modelInfo.fallback.passthroughFeatures || []);
      const gateKeys = (modelInfo.features || []).filter((k) => !passthrough.has(k));
      const anyGateMissing = gateKeys.some(
        (k) => mappedFeatures[k] === null || mappedFeatures[k] === undefined
      );
      if (anyGateMissing) {
        modelId     = modelInfo.fallback.id;
        modelSource = modelInfo.fallback.source;
        scriptName  = modelInfo.fallback.script;
        routedBy    = isCascade ? "missing_value_cascade" : "missing_optional_fallback";
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
    // A hard cap so a stuck/hung Rscript process (e.g. a broken R install) can
    // never hang the request indefinitely — execPromise/exec kills the child
    // process (SIGTERM) once this elapses and rejects instead.
    const { stdout, stderr } = await execPromise(`${rCmd} "${scriptPath}" "${tempPath}"`, { cwd: aiDir, timeout: 45000 });

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

    // Report the model actually executed, not the registry's primary entry.
    // A cascade script names the ensemble member it landed on via
    // result.modelUsed / result.modelSource; otherwise use the routed values.
    return {
      ...result,
      modelUsed:   result.modelUsed   || modelId,
      modelSource: result.modelSource || modelSource,
      routedBy,
    };
  } catch (err) {
    // Best-effort cleanup on failure
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
    throw new Error(`Prediction execution failed: ${err.message}`);
  }
};

/**
 * Warms up the R prediction engine by loading its packages once in a
 * throwaway Rscript process. Every predict_*.R script spawns a brand-new
 * Rscript process per request with no persistent/warm R runtime, so the very
 * first invocation after the Node server starts pays the full cost of the R
 * interpreter starting up and jsonlite/randomForest/xgboost being loaded from
 * disk (and, on Windows, antivirus scanning those DLLs for the first time) —
 * which can be slow enough to exceed the frontend's request timeout. Calling
 * this once at server startup (see server.js) pays that cost during
 * deployment instead of during a user's first real screening submission.
 */
export const warmUpRPredictionEngine = async () => {
  let rCmd = "Rscript";
  const rFallback = "C:\\Program Files\\R\\R-4.6.1\\bin\\Rscript.exe";
  if (fs.existsSync(rFallback)) rCmd = `"${rFallback}"`;

  const warmUpExpr = "suppressPackageStartupMessages({library(jsonlite);library(randomForest);library(xgboost)})";
  try {
    await execPromise(`${rCmd} -e "${warmUpExpr}"`, { cwd: aiDir, timeout: 30000 });
    console.log("[Prediction Router] R prediction engine warmed up.");
  } catch (err) {
    // Non-fatal: the engine will just cold-start on the first real request,
    // same as before this warm-up existed.
    console.warn(`[Prediction Router] R warm-up failed (will cold-start on first request): ${err.message}`);
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
