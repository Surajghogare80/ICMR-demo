// backend/src/ai/modelRegistry.js
/**
 * Model Registry
 * Central source of truth for PRABHA prediction models.
 *
 * The application has exactly four user prediction modes:
 * MODE 1: "symptoms_only"      -> RF_Model_1_Dataset_1.rds (dedicated model, own script)
 * MODE 2: "symptoms_blood"     -> RF_Model_2_Dataset_2.rds when every input is
 *                                 supplied; Dataset2_xgb.model (a genuine
 *                                 missing-value-capable XGBoost, trained on
 *                                 missingness-augmented data — see
 *                                 backend/ai/train_dataset2.R) when only
 *                                 OPTIONAL inputs are blank. A missing
 *                                 MANDATORY input is a hard alert.
 *                                 See `fallback` / `mandatory` below; routing
 *                                 lives in predictionRouter.js.
 * MODE 3: "symptoms_usg"       -> RF_Model_3_Dataset_3.rds when every input is
 *                                 supplied; Dataset3_xgb.model (a genuine
 *                                 missing-value-capable XGBoost, trained on
 *                                 missingness-augmented data — see
 *                                 backend/ai/train_dataset3_xgboost_missing_capable.R)
 *                                 when only OPTIONAL inputs are blank. A missing
 *                                 MANDATORY input is a hard alert.
 *                                 See `fallback` / `mandatory` below; routing
 *                                 lives in predictionRouter.js.
 * MODE 4: "symptoms_blood_usg" -> Dataset1_RF (rf_model_new.rds) when every
 *                                 input is supplied; otherwise a 3-model
 *                                 missing-value cascade, scored in pure R by
 *                                 predict_symptoms_blood_usg_missing_capable.R:
 *                                 DS1_Karnika_Clinical.rds when the 10 DS1
 *                                 mandatory fields are present, else
 *                                 DS2_LucasSouza_Synthetic.rds (needs menstrual
 *                                 regularity + Testosterone), else
 *                                 DS3_72Countries_Filtered.rds ($mandatory
 *                                 variant, needs Age + BMI). If none qualifies
 *                                 it is a hard alert. See `fallback` below;
 *                                 routing lives in predictionRouter.js.
 *
 * Missing values are kept as null (which R handles natively as NA).
 * No imputation is performed.
 *
 * `script` names the R engine (in backend/ai/) that runs a model's prediction.
 * It defaults to "predict.R" (which loads models by id out of rf_model_new.rds).
 * Modes with their own `script` load their own .rds file directly and never
 * touch rf_model_new.rds, so they cannot silently fall back to another model.
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
    id:          "RF_Model_1_Dataset_1",
    source:      "RF_Model_1_Dataset_1.rds",
    script:      "predict_symptoms_only.R",
    description: "Just Symptoms Mode (RF_Model_1_Dataset_1 — physical exam & symptom features)",
    features: [
      "Age",
      "Weight_Kg",
      "Height_Cm",
      "BMI",
      "Cycle_RI",
      "Cycle_length",
      "Hip",
      "Waist",
      "Waist_Hip_Ratio",
      "Weight_gain",
      "hair_growth",
      "Skin_darkening",
      "Hair_loss",
      "Pimples",
      "Fast_food",
      "Reg_Exercise",
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_BLOOD]: {
    id:          "RF_Model_2_Dataset_2",
    source:      "RF_Model_2_Dataset_2.rds",
    script:      "predict_symptoms_blood.R",
    description: "Symptoms + Blood Mode (RF_Model_2_Dataset_2 — physical exam, symptom & blood-panel features; no ultrasound)",
    //
    // ─── Mode 2 routing (implemented in predictionRouter.js) ──────────────
    //   1. A `mandatory` field is missing        -> throw MISSING_FEATURES
    //                                               (the frontend "missing
    //                                               information" alert; no
    //                                               model is run).
    //   2. Only `optional` field(s) are missing  -> Dataset2_xgb.model via the
    //      (no mandatory gap)                       `fallback` below — a
    //                                               missing-value-capable
    //                                               XGBoost (trained on
    //                                               missingness-augmented data).
    //   3. Every field is present                -> RF_Model_2_Dataset_2.rds
    //                                               (the `script` above).
    //
    // Both models take the same 32 raw predictor keys, so featureMapping.js
    // needs no separate branch. predict_symptoms_blood_xgb.R reorders them into
    // the booster's own column order via Dataset2_meta.rds$all_features.
    fallback: {
      trigger: "missing_optional_features",
      id:      "Dataset2_xgb_missing_capable",
      source:  "Dataset2_xgb.model",
      script:  "predict_symptoms_blood_xgb.R",
    },
    // Missing ANY of these -> hard alert (no model runs). This is exactly
    // Dataset2_meta.rds$mandatory (the 10 top-importance features the
    // missing-capable XGBoost was NOT allowed to see as NA during training).
    // Note it includes four hormonal labs — AMH, LH, FSH/LH, TSH — so mode 2
    // genuinely requires those blood values; FSH_LH is derived from FSH + LH.
    // predict_symptoms_blood_xgb.R re-reads the same list from the .rds meta.
    mandatory: [
      "hair_growth", "Skin_darkening", "Weight_gain",
      "AMH", "Cycle_RI", "Cycle_length", "Age",
      "LH", "FSH_LH", "TSH",
    ],
    // Raw predictor keys. predict_symptoms_blood.R decodes these into the
    // 39-column caret dummy design matrix baked into the randomForest;
    // predict_symptoms_blood_xgb.R maps them to Dataset2_meta.rds$all_features.
    // Everything here NOT in `mandatory` is optional — the missing-capable
    // XGBoost routes it natively when blank.
    features: [
      "Age", "Weight_Kg", "Height_Cm", "BMI",
      "Cycle_RI", "Cycle_length",
      "Hip", "Waist", "Waist_Hip_Ratio",
      "Weight_gain", "hair_growth", "Skin_darkening", "Hair_loss", "Pimples",
      "Fast_food", "Reg_Exercise",
      "Blood_Group",
      "Pulse_rate", "RR", "Hb",
      "TSH", "AMH", "PRL", "Vit_D3", "PRG", "RBS",
      "BP_Systolic", "BP_Diastolic",
      "FSH", "LH", "FSH_LH", "LH_FSH"
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_USG]: {
    id:          "RF_Model_3_Dataset_3",
    source:      "RF_Model_3_Dataset_3.rds",
    script:      "predict_symptoms_usg.R",
    description: "Symptoms + Ultrasound Mode (RF_Model_3_Dataset_3 — physical exam, symptom & ovarian ultrasound features; no blood panel)",
    //
    // ─── Mode 3 routing (implemented in predictionRouter.js) ──────────────
    //   1. A `mandatory` field is missing        -> throw MISSING_FEATURES
    //                                               (the frontend "missing
    //                                               information" alert; no
    //                                               model is run).
    //   2. Only `optional` field(s) are missing  -> Dataset3_xgb.model via the
    //      (no mandatory gap)                       `fallback` below — a
    //                                               missing-value-capable
    //                                               XGBoost (trained on
    //                                               missingness-augmented data).
    //   3. Every field is present                -> RF_Model_3_Dataset_3.rds
    //                                               (the `script` above).
    //
    // Both models take the same 21 raw predictor keys. predict_symptoms_usg.R
    // rebuilds caret's 22-column dummy design matrix (Cycle_RI -> two dummies);
    // predict_symptoms_usg_xgb.R feeds the raw numeric columns straight to the
    // booster in Dataset3_missing_capable_meta.rds$all_features order.
    fallback: {
      trigger: "missing_optional_features",
      id:      "Dataset3_xgb_missing_capable",
      source:  "Dataset3_xgb.model",
      script:  "predict_symptoms_usg_xgb.R",
    },
    // Missing ANY of these -> hard alert (no model runs). This is exactly
    // Dataset3_missing_capable_meta.rds$mandatory (the 10 top-importance
    // features the missing-capable XGBoost was NOT allowed to see as NA during
    // training). It includes both ovarian ultrasound follicle counts and both
    // average follicle sizes, so mode 3 genuinely requires the ultrasound read.
    // predict_symptoms_usg_xgb.R re-reads the same list from the .rds meta.
    mandatory: [
      "Follicle_No_R", "Follicle_No_L", "hair_growth", "Weight_gain",
      "Skin_darkening", "Age", "Cycle_RI", "Avg_F_size_L",
      "Avg_F_size_R", "Weight_Kg",
    ],
    // Raw predictor keys. predict_symptoms_usg.R decodes these into the
    // 22-column caret dummy design matrix baked into the randomForest;
    // predict_symptoms_usg_xgb.R maps them to
    // Dataset3_missing_capable_meta.rds$all_features. Everything here NOT in
    // `mandatory` is optional — the missing-capable XGBoost routes it natively
    // when blank.
    features: [
      "Age", "Weight_Kg", "Height_Cm", "BMI",
      "Cycle_RI", "Cycle_length",
      "Hip", "Waist", "Waist_Hip_Ratio",
      "Weight_gain", "hair_growth", "Skin_darkening", "Hair_loss", "Pimples",
      "Fast_food", "Reg_Exercise",
      "Follicle_No_L", "Follicle_No_R",
      "Avg_F_size_L", "Avg_F_size_R", "Endometrium",
    ],
  },

  [PREDICTION_MODES.SYMPTOMS_BLOOD_USG]: {
    id:          "Dataset1_RF",
    source:      "rf_model_new.rds",
    description: "Symptoms + Blood + USG Full Mode (Dataset1_RF)",
    //
    // ─── Mode 4 routing (implemented in predictionRouter.js) ──────────────
    //   1. Every gate field present             -> rf_model_new.rds / Dataset1_RF
    //                                              (predict.R, no `script` key).
    //   2. Any gate field blank                 -> the 3-model missing-value
    //                                              cascade in `fallback` below,
    //                                              run by
    //                                              predict_symptoms_blood_usg_missing_capable.R.
    //
    // "Gate fields" = `features` minus `fallback.passthroughFeatures`, i.e. the
    // 35 clinical predictors DS1 shares with rf_model_new.rds. `Testosterone` is
    // mapped (featureMapping.js) and passed through to the cascade script only —
    // it feeds DS2 and must not force the primary RF path when left blank.
    //
    // `fallback.cascade = true` tells predictionRouter.js NOT to hard-throw on a
    // blank `mandatory` field: the cascade script decides between DS1 / DS2 /
    // DS3 by what data is actually present, and emits the "missing information"
    // alert itself only when none of the three can run. `mandatory` below is
    // still the DS1 gate the script re-checks (= DS1_Karnika_Clinical.rds
    // $mandatory$features), and the list named in that alert.
    fallback: {
      trigger:             "missing_optional_features",
      cascade:             true,
      passthroughFeatures: ["Testosterone"],
      id:                  "DS1_Karnika_Clinical_missing_capable",
      source:              "DS1_Karnika_Clinical.rds",
      script:              "predict_symptoms_blood_usg_missing_capable.R",
      // Ordered richest-first. The script reports the one it actually used as
      // `modelUsed` / `modelSource`.
      chain: [
        { id: "DS1_Karnika_Clinical_missing_capable",  source: "DS1_Karnika_Clinical.rds" },
        { id: "DS2_LucasSouza_Synthetic_missing_capable", source: "DS2_LucasSouza_Synthetic.rds" },
        { id: "DS3_72Countries_Filtered_mandatory",    source: "DS3_72Countries_Filtered.rds" },
      ],
    },
    mandatory: [
      "Follicle.No...R.", "Follicle.No...L.", "Weight.gain.Y.N.",
      "Skin.darkening..Y.N.", "hair.growth.Y.N.", "Cycle.R.I.",
      "Cycle.length.days.", "Pimples.Y.N.", "Age..yrs.", "Waist.inch.",
    ],
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
      "Avg..F.size..L...mm.", "Avg..F.size..R...mm.", "Endometrium..mm.",
      "Testosterone",
    ],
  },
};

export { PREDICTION_MODES, MODELS };
