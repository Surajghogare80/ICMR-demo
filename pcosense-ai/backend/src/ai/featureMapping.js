// backend/src/ai/featureMapping.js
/**
 * Feature Mapping
 * Transforms the raw frontend JSON payload into the exact format
 * expected by the R prediction script based on the model's exact features.
 *
 * Source of Truth: modelRegistry.js
 *   - mode 1 "symptoms_only"  -> RF_Model_1_Dataset_1.rds  (underscore keys)
 *   - mode 2 "symptoms_blood" -> RF_Model_2_Dataset_2.rds  (underscore keys, incl. blood panel)
 *   - modes 3-4               -> rf_model_new.rds          (dotted keys)
 * Rule: NO IMPUTATION. If a value is missing, it is mapped to null (which becomes NA in R).
 */

import { MODELS } from "./modelRegistry.js";

// Helper: strictly extract numeric value or null
const exactNumOrNull = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// Maps boolean/string to 1 or 0 (model expects numeric encoding for Y/N)
const mapYesNoNumeric = (val) => {
  if (val === true || val === "Yes" || val === 1) return 1;
  if (val === false || val === "No" || val === 0) return 0;
  return null;
};

// Cycle Regularity: 2 = Regular, 4 = Irregular, 5 = Absent
const mapCycleNumeric = (val) => {
  if (val === "Regular") return 2;
  if (val === "Irregular") return 4;
  if (val === "Absent") return 5;
  return null;
};

// Blood Group numeric mapping
const mapBloodGroup = (val) => {
  const bgMap = {
    "A+": 11, "A-": 12,
    "B+": 13, "B-": 14,
    "O+": 15, "O-": 16,
    "AB+": 17, "AB-": 18,
  };
  if (val && bgMap[val]) return bgMap[val];
  return null;
};

/**
 * Maps the input payload to the exact features required by a specific model.
 * @param {Object} input - The JSON payload from the frontend.
 * @param {string} predictionMode - The target prediction mode.
 * @returns {Object} mappedFeatures - The exact features expected by R.
 */
export const mapFeaturesForModel = (input, predictionMode) => {
  const modelConfig = MODELS[predictionMode];
  if (!modelConfig) {
    throw new Error(`Unknown prediction mode: ${predictionMode}`);
  }

  const p = input.personal  || {};
  const m = input.menstrual || {};
  const s = input.symptoms  || {};
  const l = input.lifestyle || {};

  // For Dataset1_RF (Full Clinical, modes 2, 3, 4)
  // We respect the mode boundaries by intentionally sending nulls for excluded sections.
  
  const includeBlood = predictionMode === "symptoms_blood" || predictionMode === "symptoms_blood_usg";
  const includeUsg = predictionMode === "symptoms_usg" || predictionMode === "symptoms_blood_usg";

  // Calculate FSH/LH ratios only if both are present
  const fsh = includeBlood ? exactNumOrNull(p.fsh) : null;
  const lh  = includeBlood ? exactNumOrNull(p.lh) : null;
  
  let fsh_lh = null;
  let lh_fsh = null;
  if (fsh !== null && lh !== null) {
    if (lh > 0) fsh_lh = fsh / lh;
    if (fsh > 0) lh_fsh = lh / fsh;
  }
  
  const bmiNumeric = exactNumOrNull(p.bmi);

  const extractionMap = {
    // ─── Dataset1_RF Numeric Mappings ─────────────────────────────────────
    "Age..yrs.":             exactNumOrNull(p.age),
    "Weight..Kg.":           exactNumOrNull(p.weight),
    "Height.Cm.":            exactNumOrNull(p.height),
    "BMI":                   bmiNumeric,
    "Pulse.rate.bpm.":       exactNumOrNull(p.pulseRate),
    "RR..breaths.min.":      exactNumOrNull(p.respiratoryRate),
    "Hb.g.dl.":              includeBlood ? exactNumOrNull(p.haemoglobin) : null,
    "Cycle.R.I.":            mapCycleNumeric(m.cycleRegularity),
    "Cycle.length.days.":    exactNumOrNull(m.periodDuration),
    "Pregnant.Y.N.":         mapYesNoNumeric(p.pregnant),
    
    // Blood parameters
    "FSH.mIU.mL.":           fsh,
    "LH.mIU.mL.":            lh,
    "FSH.LH":                fsh_lh,
    "TSH..mIU.L.":           includeBlood ? exactNumOrNull(p.tsh) : null,
    "AMH.ng.mL.":            includeBlood ? exactNumOrNull(p.amh) : null,
    "PRL.ng.mL.":            includeBlood ? exactNumOrNull(p.prl) : null,
    "Vit.D3..ng.mL.":        includeBlood ? exactNumOrNull(p.vitaminD3) : null,
    "PRG.ng.mL.":            includeBlood ? exactNumOrNull(p.prg) : null,
    "RBS.mg.dl.":            includeBlood ? exactNumOrNull(p.rbs) : null,
    
    // Physical & Symptoms
    "Hip.inch.":             exactNumOrNull(p.hip),
    "Waist.inch.":           exactNumOrNull(p.waist),
    "Waist.Hip.Ratio":       exactNumOrNull(p.waistHipRatio),
    "Weight.gain.Y.N.":      mapYesNoNumeric(s.weightGain),
    "hair.growth.Y.N.":      mapYesNoNumeric(s.hairGrowth),
    "Skin.darkening..Y.N.":  mapYesNoNumeric(s.skinDarkening),
    "Hair.loss.Y.N.":        mapYesNoNumeric(s.hairLoss),
    "Pimples.Y.N.":          mapYesNoNumeric(s.pimples),
    "Reg.Exercise.Y.N.":     mapYesNoNumeric(l.exerciseFreq),
    "BP._Systolic..mmHg.":   exactNumOrNull(p.bpSystolic),
    "BP._Diastolic..mmHg.":  exactNumOrNull(p.bpDiastolic),
    
    // Ultrasound parameters
    "Follicle.No...L.":      includeUsg ? exactNumOrNull(m.follicleNoLeft) : null,
    "Follicle.No...R.":      includeUsg ? exactNumOrNull(m.follicleNoRight) : null,
    "Avg..F.size..L...mm.":  includeUsg ? exactNumOrNull(m.avgFollicleSizeLeft) : null,
    "Avg..F.size..R...mm.":  includeUsg ? exactNumOrNull(m.avgFollicleSizeRight) : null,
    "Endometrium..mm.":      includeUsg ? exactNumOrNull(m.endometrium) : null,

    // ─── RF_Model_1_Dataset_1 Mappings (Mode 1: Symptoms Only) ────────────
    // "BMI" is already defined above (numeric, shared with Dataset1_RF).
    "Age":                   exactNumOrNull(p.age),
    "Weight_Kg":             exactNumOrNull(p.weight),
    "Height_Cm":             exactNumOrNull(p.height),
    "Cycle_RI":              mapCycleNumeric(m.cycleRegularity),
    "Cycle_length":          exactNumOrNull(m.periodDuration),
    "Hip":                   exactNumOrNull(p.hip),
    "Waist":                 exactNumOrNull(p.waist),
    "Waist_Hip_Ratio":       exactNumOrNull(p.waistHipRatio),
    "Weight_gain":           mapYesNoNumeric(s.weightGain),
    "hair_growth":           mapYesNoNumeric(s.hairGrowth),
    "Skin_darkening":        mapYesNoNumeric(s.skinDarkening),
    "Hair_loss":             mapYesNoNumeric(s.hairLoss),
    "Pimples":               mapYesNoNumeric(s.pimples),
    "Fast_food":             mapYesNoNumeric(l.fastFoodFreq),
    "Reg_Exercise":          mapYesNoNumeric(l.exerciseFreq),

    // ─── RF_Model_2_Dataset_2 Mappings (Mode 2: Symptoms + Blood) ─────────
    // Shares the underscore physical/symptom keys above; adds the blood panel.
    "Blood_Group":           includeBlood ? mapBloodGroup(p.bloodGroup) : null,
    "Pulse_rate":            exactNumOrNull(p.pulseRate),
    "RR":                    exactNumOrNull(p.respiratoryRate),
    "Hb":                    includeBlood ? exactNumOrNull(p.haemoglobin) : null,
    "TSH":                   includeBlood ? exactNumOrNull(p.tsh) : null,
    "AMH":                   includeBlood ? exactNumOrNull(p.amh) : null,
    "PRL":                   includeBlood ? exactNumOrNull(p.prl) : null,
    "Vit_D3":                includeBlood ? exactNumOrNull(p.vitaminD3) : null,
    "PRG":                   includeBlood ? exactNumOrNull(p.prg) : null,
    "RBS":                   includeBlood ? exactNumOrNull(p.rbs) : null,
    "BP_Systolic":           exactNumOrNull(p.bpSystolic),
    "BP_Diastolic":          exactNumOrNull(p.bpDiastolic),
    "FSH":                   fsh,
    "LH":                    lh,
    "FSH_LH":                fsh_lh,
    "LH_FSH":                lh_fsh,
  };

  // Build the specific payload for the requested model
  const mappedFeatures = {};
  for (const feature of modelConfig.features) {
    if (extractionMap[feature] !== undefined) {
      mappedFeatures[feature] = extractionMap[feature];
    } else {
      throw new Error(`Missing extraction logic for required feature: "${feature}"`);
    }
  }

  return mappedFeatures;
};
