# backend/ai/predict_symptoms_blood_xgb.R
# PRABHA "Symptoms + Blood" (Mode 2) — MISSING-VALUE-CAPABLE ENGINE
#
# Source of truth: Dataset2_xgb.model + Dataset2_meta.rds — and ONLY these.
#
# This engine runs for Mode 2 ("Blood + symptoms") whenever the user left one
# or more OPTIONAL inputs blank. It is the genuine missing-value-capable
# XGBoost model (see train_dataset2.R): trained on 6x missingness-augmented
# copies of the data with `missing = NA`, so NA routing on the 22 optional
# features is actually learned, not merely tolerated. Validated down to
# "10 mandatory only" at 98.0% accuracy / 0.995 AUC.
#
# Routing (predictionRouter.js):
#   * every field present            -> RF_Model_2_Dataset_2.rds (predict_symptoms_blood.R)
#   * a MANDATORY field is blank     -> hard alert, this script is not reached
#   * only OPTIONAL field(s) blank   -> this script
#
# Contract:
#   * Dataset2_meta.rds$mandatory (10) — must all be present. Includes four
#     hormonal labs: AMH, LH, FSH/LH, TSH.
#   * Dataset2_meta.rds$optional  (22) — any subset may be NA.
#   * Dataset2_meta.rds$all_features (32) — the exact column order the booster
#     expects. xgb.DMatrix from a bare matrix is matched BY POSITION, so the
#     row is assembled in this order.
#
# Dataset2_xgb.model was written with xgb.save() (portable UBJSON), so it loads
# with xgb.load() and needs no readRDS compatibility shim.

suppressPackageStartupMessages({
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org")
  }
  if (!requireNamespace("xgboost", quietly = TRUE)) {
    install.packages("xgboost", repos = "https://cloud.r-project.org")
  }
  library(jsonlite)
  library(xgboost)
})
invisible(suppressWarnings(try(xgb.set.config(verbosity = 0), silent = TRUE)))

# ─── 1. Read input JSON path from args ────────────────────────────────────────
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  cat(toJSON(list(error = "No input file path provided."), auto_unbox = TRUE))
  quit(status = 1)
}
input_path <- args[1]
if (!file.exists(input_path)) {
  cat(toJSON(list(error = paste("Input file not found:", input_path)), auto_unbox = TRUE))
  quit(status = 1)
}

# ─── 2. Parse Payload ─────────────────────────────────────────────────────────
payload <- tryCatch(fromJSON(input_path), error = function(e) {
  cat(toJSON(list(error = paste("Failed to parse JSON:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})
features_list <- payload$features
if (is.null(features_list)) {
  cat(toJSON(list(error = "Payload must contain features."), auto_unbox = TRUE))
  quit(status = 1)
}

# ─── 3. Locate model + metadata ─────────────────────────────────────────────
find_file <- function(name) {
  for (cand in c(name, file.path("ai", name), file.path(dirname(input_path), name))) {
    if (file.exists(cand)) return(cand)
  }
  NULL
}
model_path <- find_file("Dataset2_xgb.model")
meta_path  <- find_file("Dataset2_meta.rds")
if (is.null(model_path) || is.null(meta_path)) {
  cat(toJSON(list(error = "Dataset2_xgb.model / Dataset2_meta.rds not found."), auto_unbox = TRUE))
  quit(status = 1)
}

meta    <- readRDS(meta_path)
booster <- tryCatch(xgb.load(model_path), error = function(e) {
  cat(toJSON(list(error = paste("Failed to load Dataset2_xgb.model:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

# ─── 4. Bridge: model feature names  <->  featureMapping.js JSON keys ─────────
# The .model stores dataset column names; featureMapping.js emits these keys.
NAME2KEY <- c(
  "Age (yrs)"             = "Age",
  "Weight (Kg)"           = "Weight_Kg",
  "Height(Cm)"            = "Height_Cm",
  "BMI"                   = "BMI",
  "Cycle(R/I)"            = "Cycle_RI",
  "Cycle length(days)"    = "Cycle_length",
  "Hip(inch)"             = "Hip",
  "Waist(inch)"           = "Waist",
  "Waist:Hip Ratio"       = "Waist_Hip_Ratio",
  "Weight gain(Y/N)"      = "Weight_gain",
  "hair growth(Y/N)"      = "hair_growth",
  "Skin darkening (Y/N)"  = "Skin_darkening",
  "Hair loss(Y/N)"        = "Hair_loss",
  "Pimples(Y/N)"          = "Pimples",
  "Fast food (Y/N)"       = "Fast_food",
  "Reg.Exercise(Y/N)"     = "Reg_Exercise",
  "Blood Group"           = "Blood_Group",
  "Pulse rate(bpm)"       = "Pulse_rate",
  "RR (breaths/min)"      = "RR",
  "Hb(g/dl)"              = "Hb",
  "TSH (mIU/L)"           = "TSH",
  "AMH(ng/mL)"            = "AMH",
  "PRL(ng/mL)"            = "PRL",
  "Vit D3 (ng/mL)"        = "Vit_D3",
  "PRG(ng/mL)"            = "PRG",
  "RBS(mg/dl)"            = "RBS",
  "BP _Systolic (mmHg)"   = "BP_Systolic",
  "BP _Diastolic (mmHg)"  = "BP_Diastolic",
  "FSH(mIU/mL)"           = "FSH",
  "LH(mIU/mL)"            = "LH",
  "FSH/LH"                = "FSH_LH",
  "LH:FSH"                = "LH_FSH"
)

all_features <- meta$all_features   # 32, exact booster column order
mandatory    <- meta$mandatory      # 10
f <- features_list
is_missing <- function(v) is.null(v) || (length(v) == 1 && is.na(v))
get_num    <- function(v) if (is_missing(v)) NA_real_ else suppressWarnings(as.numeric(v))
key_of     <- function(feat_name) unname(NAME2KEY[feat_name])

missing_mandatory <- vapply(mandatory, function(fe) is_missing(f[[key_of(fe)]]), logical(1))
missing_mandatory <- mandatory[missing_mandatory]

# ─── 5. Predict ─────────────────────────────────────────────────────────────
result_out <- tryCatch({
  if (length(missing_mandatory) > 0) {
    list(
      error = paste("The trained model requires the following missing information to make a safe prediction:",
                    paste(missing_mandatory, collapse = ", ")),
      type = "MISSING_FEATURES",
      missingFields = unname(NAME2KEY[missing_mandatory])
    )
  } else {
    vals <- vapply(all_features, function(fe) get_num(f[[key_of(fe)]]), numeric(1))
    row_mat <- matrix(vals, nrow = 1, dimnames = list(NULL, all_features))
    dm <- xgb.DMatrix(data = row_mat, missing = NA)
    prob_pcos <- as.numeric(stats::predict(booster, dm))[1]

    prob_val       <- round(prob_pcos * 100, 1)
    confidence_val <- round(max(prob_pcos, 1 - prob_pcos) * 100, 1)
    ui_result      <- ifelse(prob_pcos >= 0.5, "High Risk", "Low Risk")

    optional_keys <- unname(NAME2KEY[meta$optional])
    provided_optional <- optional_keys[!vapply(optional_keys, function(k) is_missing(f[[k]]), logical(1))]

    recommendations <- if (ui_result == "High Risk") {
      c(
        "Consult a gynecologist or endocrinologist immediately.",
        "Complete any blood markers left blank in this screening for a more precise assessment.",
        "Consider a pelvic ultrasound for ovarian cysts if you haven't already.",
        "Follow a low-glycemic index diet to manage insulin resistance.",
        "Start a regular exercise program (30 min/day, 5 days/week)."
      )
    } else {
      c(
        "Maintain your current healthy lifestyle — great work!",
        "Continue exercising regularly (150 min/week of moderate activity).",
        "Keep a balanced, nutritious diet rich in vegetables and whole grains.",
        "Consider completing the blood markers left blank for a more precise screening."
      )
    }

    list(
      result               = ui_result,
      probability          = prob_val,
      confidence           = confidence_val,
      recommendation       = recommendations,
      engineType           = "xgboost_missing_capable",
      providedOptionalCount = length(provided_optional),
      optionalTotal        = length(optional_keys)
    )
  }
}, error = function(e) {
  list(error = paste("Prediction failed:", e$message))
})

cat(toJSON(result_out, auto_unbox = TRUE))
