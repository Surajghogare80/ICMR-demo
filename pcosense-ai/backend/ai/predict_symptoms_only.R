# backend/ai/predict_symptoms_only.R
# PRABHA "Symptoms Only" (Mode 1) Prediction Engine
#
# Source of truth: RF_Model_1_Dataset_1.rds — and ONLY this file. This script
# never opens rf_model_new.rds, so prediction mode 1 cannot silently fall back
# to any other model.
#
# RF_Model_1_Dataset_1.rds stores a caret::train wrapper (method = "rf") fit on
# Dataset 1's 16 physical-exam/symptom features. caret is not installed in this
# environment, so instead of calling predict.train() we pull out $finalModel —
# a plain randomForest fitted on caret's own dummy-coded design matrix — and
# reproduce that exact dummy encoding by hand for the single incoming patient
# row. All the Y/N symptom fields are binary with base level "0", so their
# dummy value is identical to the raw 0/1 value; only Cycle(R/I) (3 levels:
# 2/4/5, base "2") expands into two dummy columns.
#
# Unlike the randomForest models in rf_model_new.rds (whose predict() quietly
# returns NA for a row with any missing predictor), this forest raises a hard
# "missing values in newdata" error instead. We therefore check for missing
# mandatory fields ourselves before calling predict() and return the same
# MISSING_FEATURES shape the other engine uses, for a consistent frontend contract.

suppressPackageStartupMessages({
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org")
  }
  if (!requireNamespace("randomForest", quietly = TRUE)) {
    install.packages("randomForest", repos = "https://cloud.r-project.org")
  }
  library(jsonlite)
  library(randomForest)
})

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
payload <- tryCatch({
  fromJSON(input_path)
}, error = function(e) {
  cat(toJSON(list(error = paste("Failed to parse JSON:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

features_list <- payload$features
if (is.null(features_list)) {
  cat(toJSON(list(error = "Payload must contain features."), auto_unbox = TRUE))
  quit(status = 1)
}

# ─── 3. Load the dedicated model (and ONLY this model) ────────────────────────
candidates <- c(
  "RF_Model_1_Dataset_1.rds",
  "ai/RF_Model_1_Dataset_1.rds",
  file.path(dirname(input_path), "RF_Model_1_Dataset_1.rds")
)
model_path <- NULL
for (cand in candidates) {
  if (file.exists(cand)) {
    model_path <- cand
    break
  }
}
if (is.null(model_path)) {
  cat(toJSON(list(error = "RF_Model_1_Dataset_1.rds not found."), auto_unbox = TRUE))
  quit(status = 1)
}

model_obj <- tryCatch({
  readRDS(model_path)
}, error = function(e) {
  cat(toJSON(list(error = paste("Failed to read RF_Model_1_Dataset_1.rds:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

# The .rds is a caret::train object; its $finalModel is the plain randomForest.
rf_model <- if (!is.null(model_obj$finalModel)) model_obj$finalModel else model_obj
pnames   <- names(rf_model$forest$ncat) # exact dummy-coded predictor names baked into the forest

# ─── 4. Check mandatory fields are present ────────────────────────────────────
REQUIRED <- c("Age", "Weight_Kg", "Height_Cm", "BMI", "Cycle_RI", "Cycle_length",
              "Hip", "Waist", "Waist_Hip_Ratio", "Weight_gain", "hair_growth",
              "Skin_darkening", "Hair_loss", "Pimples", "Fast_food", "Reg_Exercise")

f <- features_list
is_missing <- function(v) is.null(v) || (length(v) == 1 && is.na(v))
missing_now <- REQUIRED[sapply(REQUIRED, function(nm) is_missing(f[[nm]]))]

# ─── 5. Build the one-row dummy-coded input the forest expects ────────────────
get_num <- function(v) if (is_missing(v)) NA_real_ else suppressWarnings(as.numeric(v))

build_row <- function(f) {
  cycle_ri <- get_num(f$Cycle_RI)
  row <- data.frame(
    get_num(f$Age),
    get_num(f$Weight_Kg),
    get_num(f$Height_Cm),
    get_num(f$BMI),
    if (is.na(cycle_ri)) NA_real_ else as.numeric(cycle_ri == 4),
    if (is.na(cycle_ri)) NA_real_ else as.numeric(cycle_ri == 5),
    get_num(f$Cycle_length),
    get_num(f$Hip),
    get_num(f$Waist),
    get_num(f$Waist_Hip_Ratio),
    get_num(f$Weight_gain),
    get_num(f$hair_growth),
    get_num(f$Skin_darkening),
    get_num(f$Hair_loss),
    get_num(f$Pimples),
    get_num(f$Fast_food),
    get_num(f$Reg_Exercise)
  )
  names(row) <- pnames
  row
}

# ─── 6. Run Prediction ─────────────────────────────────────────────────────────
result_out <- tryCatch({
  if (length(missing_now) > 0) {
    missing_msg <- paste("The trained model requires the following missing information to make a safe prediction:",
                          paste(missing_now, collapse = ", "))
    list(error = missing_msg, type = "MISSING_FEATURES", missingFields = missing_now)
  } else {
    row      <- build_row(f)
    prob_mat <- predict(rf_model, newdata = row, type = "prob")
    prob_pcos <- if ("PCOS" %in% colnames(prob_mat)) as.numeric(prob_mat[1, "PCOS"]) else as.numeric(prob_mat[1, 2])

    prob_val       <- round(prob_pcos * 100, 1)
    confidence_val <- round(max(prob_pcos, 1 - prob_pcos) * 100, 1)
    ui_result      <- ifelse(prob_pcos >= 0.5, "High Risk", "Low Risk")

    recommendations <- if (ui_result == "High Risk") {
      c(
        "Consult a gynecologist or endocrinologist immediately.",
        "Get hormonal blood tests (FSH, LH, testosterone, insulin) if you haven't already.",
        "Consider pelvic ultrasound for ovarian cysts if you haven't already.",
        "Follow a low-glycemic index diet to manage insulin resistance.",
        "Start a regular exercise program (30 min/day, 5 days/week)."
      )
    } else {
      c(
        "Maintain your current healthy lifestyle — great work!",
        "Continue exercising regularly (150 min/week of moderate activity).",
        "Keep a balanced, nutritious diet rich in vegetables and whole grains.",
        "Monitor your menstrual cycle and note any irregularities."
      )
    }

    list(
      result         = ui_result,
      probability    = prob_val,
      confidence     = confidence_val,
      recommendation = recommendations
    )
  }
}, error = function(e) {
  list(error = paste("Prediction failed:", e$message))
})

# ─── 7. Output ─────────────────────────────────────────────────────────────────
cat(toJSON(result_out, auto_unbox = TRUE))
