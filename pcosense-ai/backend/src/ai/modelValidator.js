// backend/src/ai/modelValidator.js
import { MODELS } from "./modelRegistry.js";

export const validateFeatures = (mappedFeatures, predictionMode) => {
  const modelConfig = MODELS[predictionMode];
  if (!modelConfig) {
    throw new Error(`Validation Error: Unknown prediction mode '${predictionMode}'`);
  }

  const providedFeatures = Object.keys(mappedFeatures);

  // 1. Target Leakage Check
  if (providedFeatures.includes("PCOS (Y/N)") || providedFeatures.includes("Target") || providedFeatures.includes("Pregnant(Y/N)")) {
    // Actually, Pregnant(Y/N) is an input feature in Dataset1_RF, not a target variable.
    // We just check for common target leakage names.
    if (providedFeatures.includes("PCOS (Y/N)") || providedFeatures.includes("Target")) {
      throw new Error("Validation Error: Target leakage detected. Target column included in input.");
    }
  }

  // 2. Identifiers Check
  if (providedFeatures.includes("Sl. No") || providedFeatures.includes("Patient File No.")) {
    throw new Error("Validation Error: Patient identifiers must not be used as predictors.");
  }

  // 3. Data Type Check (Optional)
  // We allow nulls. If a value is provided, it should be valid for the model.
  // We no longer throw an error if a feature is missing because NA is supported natively.

  return true;
};
