// backend/src/ai/featureMapping.js
/**
 * Feature Mapping
 * Transforms the raw frontend JSON payload into the exact format 
 * expected by the R prediction script based on the model's exact features.
 */

import { MODELS } from "./modelRegistry.js";

const safeNum = (val, defaultVal) => {
  const num = parseFloat(val);
  return isNaN(num) ? defaultVal : num;
};

// Maps boolean/string to "1" or "0" since the model expects factor levels c("0", "1")
const mapYesNo = (val) => {
  if (val === true || val === "Yes" || val === 1) return 1;
  return 0;
};

// Cycle Regularity: 2 = Regular, 4 = Irregular, 5 = Absent
const mapCycle = (val) => {
  if (val === "Irregular") return 4;
  if (val === "Absent") return 5;
  return 2; // Regular is 2
};

// Blood Group: 11 = A+, 12 = A-, 13 = B+, 14 = B-, 15 = O+, 16 = O-, 17 = AB+, 18 = AB-
const mapBloodGroup = (val) => {
  const bgMap = {
    "A+": 11,
    "A-": 12,
    "B+": 13,
    "B-": 14,
    "O+": 15,
    "O-": 16,
    "AB+": 17,
    "AB-": 18,
  };
  return bgMap[val] || 15; // default O+
};

/**
 * Maps the input payload to the exact features required by a specific model.
 * @param {Object} input - The JSON payload from the frontend.
 * @param {string} predictionMode - The target prediction mode.
 * @returns {Object} mappedFeatures - The exact features requested.
 */
export const mapFeaturesForModel = (input, predictionMode) => {
  const modelConfig = MODELS[predictionMode];
  if (!modelConfig) {
    throw new Error(`Unknown prediction mode: ${predictionMode}`);
  }

  // Define extraction logic for EVERY possible feature across all models
  const personal = input.personal || {};
  const menstrual = input.menstrual || {};
  const symptoms = input.symptoms || {};
  const lifestyle = input.lifestyle || {};

  const fsh = safeNum(personal.fsh, 4.86);
  const lh = safeNum(personal.lh, 2.33);
  const fsh_lh_ratio = lh > 0 ? fsh / lh : 2.13;
  const lh_fsh_ratio = fsh > 0 ? lh / fsh : 0.5;

  const extractionMap = {
    "Age (yrs)": safeNum(personal.age, 28),
    "Weight (Kg)": safeNum(personal.weight, 60),
    "Height(Cm)": safeNum(personal.height, 162),
    "BMI": safeNum(personal.bmi, 22.8),
    "Cycle(R/I)": mapCycle(menstrual.cycleRegularity),
    "Cycle length(days)": safeNum(menstrual.periodDuration, 5),
    "Hip(inch)": safeNum(personal.hip, 38),
    "Waist(inch)": safeNum(personal.waist, 34),
    "Waist:Hip Ratio": safeNum(personal.waistHipRatio, 0.89),
    "Weight gain(Y/N)": mapYesNo(symptoms.weightGain),
    "hair growth(Y/N)": mapYesNo(symptoms.hairGrowth),
    "Skin darkening (Y/N)": mapYesNo(symptoms.skinDarkening),
    "Hair loss(Y/N)": mapYesNo(symptoms.hairLoss),
    "Pimples(Y/N)": mapYesNo(symptoms.pimples),
    "Fast food (Y/N)": mapYesNo(lifestyle.fastFoodFreq),
    "Reg.Exercise(Y/N)": mapYesNo(lifestyle.exerciseFreq),
    "Blood Group": mapBloodGroup(personal.bloodGroup),
    "Pulse rate(bpm)": safeNum(personal.pulseRate, 72),
    "RR (breaths/min)": safeNum(personal.respiratoryRate, 18),
    "Hb(g/dl)": safeNum(personal.haemoglobin, 12),
    "TSH (mIU/L)": safeNum(personal.tsh, 2.2),
    "AMH(ng/mL)": safeNum(personal.amh, 3.9),
    "PRL(ng/mL)": safeNum(personal.prl, 21.7),
    "Vit D3 (ng/mL)": safeNum(personal.vitaminD3, 26),
    "PRG(ng/mL)": safeNum(personal.prg, 0.3),
    "RBS(mg/dl)": safeNum(personal.rbs, 100),
    "BP _Systolic (mmHg)": safeNum(personal.bpSystolic, 115),
    "BP _Diastolic (mmHg)": safeNum(personal.bpDiastolic, 78),
    "FSH(mIU/mL)": fsh,
    "LH(mIU/mL)": lh,
    "FSH/LH": safeNum(personal.fshLhRatio, fsh_lh_ratio), 
    "LH:FSH": safeNum(personal.lhFshRatio, lh_fsh_ratio), // Keep both exact per user instruction
    "Follicle No. (L)": safeNum(menstrual.follicleNoLeft, 5),
    "Follicle No. (R)": safeNum(menstrual.follicleNoRight, 5),
    "Avg. F size (L) (mm)": safeNum(menstrual.avgFollicleSizeLeft, 15),
    "Avg. F size (R) (mm)": safeNum(menstrual.avgFollicleSizeRight, 15),
    "Endometrium (mm)": safeNum(menstrual.endometrium, 8),
  };

  // Build the specific payload for the requested model
  const mappedFeatures = {};
  for (const feature of modelConfig.features) {
    if (extractionMap[feature] !== undefined) {
      mappedFeatures[feature] = extractionMap[feature];
    } else {
      throw new Error(`Missing extraction logic for required feature: ${feature}`);
    }
  }

  return mappedFeatures;
};
