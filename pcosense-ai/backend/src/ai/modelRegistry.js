// backend/src/ai/modelRegistry.js
/**
 * Model Registry
 * Central source of truth for PRABHA prediction models.
 *
 * Source: rf_model_new.rds ONLY
 *
 * The application has exactly four user prediction modes:
 * MODE 1: "symptoms_only"      -> Dataset3_RF
 * MODE 2: "symptoms_blood"     -> Dataset1_RF
 * MODE 3: "symptoms_usg"       -> Dataset1_RF
 * MODE 4: "symptoms_blood_usg" -> Dataset1_RF
 *
 * Missing values are kept as null (which R handles natively as NA).
 * No imputation is performed.
 */

// ─── Prediction Mode Keys ─────────────────────────────────────────────────────
const PREDICTION_MODES = {
  SYMPTOMS_ONLY:      "symptoms_only",
  SYMPTOMS_BLOOD:     "symptoms_blood",
  SYMPTOMS_USG:       "symptoms_usg",
  SYMPTOMS_BLOOD_USG: "symptoms_blood_usg",
};

// ─── Model Configurations ─────────────────────────────────────────────────────
// Features must exactly match the names stored in the randomForest models 
// (after make.names() is applied by R during training).
const MODELS = {
  [PREDICTION_MODES.SYMPTOMS_ONLY]: {
    id:          "Dataset3_RF",
    source:      "rf_model_new.rds",
    description: "Just Symptoms Mode (Dataset3_RF)",
    features: [
      "Age",
      "BMI",
      "Menstrual.Regularity",
      "Hirsutism",
      "Acne.Severity",
      "Family.History.of.PCOS",
      "Insulin.Resistance",
      "Lifestyle.Score",
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_BLOOD]: {
    id:          "Dataset1_RF",
    source:      "rf_model_new.rds",
    description: "Symptoms + Blood Mode (Dataset1_RF)",
    features: [
      "Age..yrs.", "Weight..Kg.", "Height.Cm.", "BMI",
      "Pulse.rate.bpm.", "RR..breaths.min.", "Hb.g.dl.",
      "Cycle.R.I.", "Cycle.length.days.", "Pregnant.Y.N.",
      "FSH.mIU.mL.", "LH.mIU.mL.", "FSH.LH", "TSH..mIU.L.",
      "AMH.ng.mL.", "PRL.ng.mL.", "Vit.D3..ng.mL.", "PRG.ng.mL.",
      "Hip.inch.", "Waist.inch.", "Waist.Hip.Ratio", "RBS.mg.dl.",
      "Weight.gain.Y.N.", "hair.growth.Y.N.", "Skin.darkening..Y.N.",
      "Hair.loss.Y.N.", "Pimples.Y.N.", "Reg.Exercise.Y.N.",
      "BP._Systolic..mmHg.", "BP._Diastolic..mmHg.",
      "Follicle.No...L.", "Follicle.No...R.", 
      "Avg..F.size..L...mm.", "Avg..F.size..R...mm.", "Endometrium..mm."
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_USG]: {
    id:          "Dataset1_RF",
    source:      "rf_model_new.rds",
    description: "Symptoms + USG Mode (Dataset1_RF)",
    features: [
      "Age..yrs.", "Weight..Kg.", "Height.Cm.", "BMI",
      "Pulse.rate.bpm.", "RR..breaths.min.", "Hb.g.dl.",
      "Cycle.R.I.", "Cycle.length.days.", "Pregnant.Y.N.",
      "FSH.mIU.mL.", "LH.mIU.mL.", "FSH.LH", "TSH..mIU.L.",
      "AMH.ng.mL.", "PRL.ng.mL.", "Vit.D3..ng.mL.", "PRG.ng.mL.",
      "Hip.inch.", "Waist.inch.", "Waist.Hip.Ratio", "RBS.mg.dl.",
      "Weight.gain.Y.N.", "hair.growth.Y.N.", "Skin.darkening..Y.N.",
      "Hair.loss.Y.N.", "Pimples.Y.N.", "Reg.Exercise.Y.N.",
      "BP._Systolic..mmHg.", "BP._Diastolic..mmHg.",
      "Follicle.No...L.", "Follicle.No...R.", 
      "Avg..F.size..L...mm.", "Avg..F.size..R...mm.", "Endometrium..mm."
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_BLOOD_USG]: {
    id:          "Dataset1_RF",
    source:      "rf_model_new.rds",
    description: "Symptoms + Blood + USG Full Mode (Dataset1_RF)",
    features: [
      "Age..yrs.", "Weight..Kg.", "Height.Cm.", "BMI",
      "Pulse.rate.bpm.", "RR..breaths.min.", "Hb.g.dl.",
      "Cycle.R.I.", "Cycle.length.days.", "Pregnant.Y.N.",
      "FSH.mIU.mL.", "LH.mIU.mL.", "FSH.LH", "TSH..mIU.L.",
      "AMH.ng.mL.", "PRL.ng.mL.", "Vit.D3..ng.mL.", "PRG.ng.mL.",
      "Hip.inch.", "Waist.inch.", "Waist.Hip.Ratio", "RBS.mg.dl.",
      "Weight.gain.Y.N.", "hair.growth.Y.N.", "Skin.darkening..Y.N.",
      "Hair.loss.Y.N.", "Pimples.Y.N.", "Reg.Exercise.Y.N.",
      "BP._Systolic..mmHg.", "BP._Diastolic..mmHg.",
      "Follicle.No...L.", "Follicle.No...R.", 
      "Avg..F.size..L...mm.", "Avg..F.size..R...mm.", "Endometrium..mm."
    ],
  },
};

export { PREDICTION_MODES, MODELS };
