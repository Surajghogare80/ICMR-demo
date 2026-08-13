// backend/src/ai/modelValidator.js
/**
 * Model Validator
 * Ensures that the features extracted for prediction strictly adhere to the model's requirements.
 * Verifies no missing columns, no extra columns, and no target leakage.
 */

import { MODELS } from "./modelRegistry.js";

export const validateFeatures = (mappedFeatures, predictionMode) => {
  const modelConfig = MODELS[predictionMode];
  if (!modelConfig) {
    throw new Error(`Validation Error: Unknown prediction mode '${predictionMode}'`);
  }

  const expectedFeatures = modelConfig.features;
  const providedFeatures = Object.keys(mappedFeatures);

  // 1. Target Leakage Check
  if (providedFeatures.includes("PMOS (Y/N)") || providedFeatures.includes("Target")) {
    throw new Error("Validation Error: Target leakage detected. Target column included in input.");
  }

  // 2. Identifiers Check
  if (providedFeatures.includes("Sl. No") || providedFeatures.includes("Patient File No.")) {
    throw new Error("Validation Error: Patient identifiers must not be used as predictors.");
  }

  // 3. Exact Feature Match Check
  const missingFeatures = expectedFeatures.filter(f => !providedFeatures.includes(f));
  if (missingFeatures.length > 0) {
    throw new Error(`Validation Error: Missing required features for ${predictionMode}: ${missingFeatures.join(", ")}`);
  }

  const extraFeatures = providedFeatures.filter(f => !expectedFeatures.includes(f));
  if (extraFeatures.length > 0) {
    throw new Error(`Validation Error: Unexpected features provided for ${predictionMode}: ${extraFeatures.join(", ")}`);
  }

  // 4. Data Type Check
  for (const feature of expectedFeatures) {
    const val = mappedFeatures[feature];
    if (val === null || val === undefined) {
      throw new Error(`Validation Error: Feature '${feature}' cannot be null or undefined.`);
    }
    
    // Everything should be cast to numeric representation in the JS side (even factors like 1, 0, 11, etc. which R will cast to factors)
    if (isNaN(parseFloat(val))) {
      throw new Error(`Validation Error: Feature '${feature}' must be a valid number or numeric encoding.`);
    }
  }

  return true;
};
