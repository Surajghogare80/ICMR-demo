# backend/ai/predict.R
# This script loads the trained R Random Forest model and makes a prediction.

# 1. Load required libraries (jsonlite for parsing inputs/outputs)
if (!requireNamespace("jsonlite", quietly = TRUE)) {
  install.packages("jsonlite", repos = "https://cloud.r-project.org")
}
if (!requireNamespace("randomForest", quietly = TRUE)) {
  install.packages("randomForest", repos = "https://cloud.r-project.org")
}
library(jsonlite)
library(randomForest)

# 2. Read arguments passed from Node.js (JSON representation of form data)
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop("No input data provided.")
}

# 3. Parse input JSON
input_data <- fromJSON(args[1])

# 4. Load the RDS model file
model_path <- "ai/rf_model_new.rds"
if (!file.exists(model_path)) {
  stop(paste("Model file not found at", model_path))
}
model_list <- readRDS(model_path)

# Extract the trained model (first model Dataset1_RF in the nested list)
model <- model_list[[1]]

# 5. Extract features from inputs to match the 35 columns of the Kaggle dataset.

# Helper function to safely extract a numeric value from the nested input list
safe_num <- function(val, default_val) {
  if (!is.null(val) && length(val) > 0 && !is.na(suppressWarnings(as.numeric(val)))) {
    return(as.numeric(val))
  }
  return(default_val)
}

# Cycle regularity encoding
cycle_regularity_val <- 2 # Default: Regular
if (!is.null(input_data$menstrual$cycleRegularity)) {
  if (input_data$menstrual$cycleRegularity == "Irregular") {
    cycle_regularity_val <- 4
  } else if (input_data$menstrual$cycleRegularity == "Absent") {
    cycle_regularity_val <- 5
  }
}

# Exercise encoding — Yes = 1 (regular), No = 0 (not regular)
reg_exercise_val <- 1 # Default: Yes (exercises regularly)
if (!is.null(input_data$lifestyle$exerciseFreq) && input_data$lifestyle$exerciseFreq == "No") {
  reg_exercise_val <- 0
}

# Fast Food encoding — Yes = 1, No = 0
fast_food_val <- 0 # Default: No
if (!is.null(input_data$lifestyle$fastFoodFreq) && input_data$lifestyle$fastFoodFreq == "Yes") {
  fast_food_val <- 1
}

# Stress Level encoding
stress_level_val <- input_data$lifestyle$stressLevel
if (is.null(stress_level_val) || !stress_level_val %in% c("Low", "Moderate", "High")) {
  stress_level_val <- "Moderate" # Safe default
}

# Sleep Hours
sleep_hours_val <- safe_num(input_data$lifestyle$sleepHours, 7)

# Family history encoding (new)
family_history_val <- 0
if (!is.null(input_data$menstrual$familyHistory) && isTRUE(input_data$menstrual$familyHistory)) {
  family_history_val <- 1
}

# FSH / LH values and ratio
fsh_val <- safe_num(input_data$personal$fsh, 4.86)
lh_val  <- safe_num(input_data$personal$lh, 2.33)
fsh_lh_ratio <- safe_num(input_data$personal$lhFshRatio, if (lh_val > 0) fsh_val / lh_val else 2.13)

# Blood Group encoding
blood_group_val <- 15 # Default: O+
if (!is.null(input_data$personal$bloodGroup)) {
  bg <- input_data$personal$bloodGroup
  if (bg == "A+") blood_group_val <- 11
  else if (bg == "A-") blood_group_val <- 12
  else if (bg == "B+") blood_group_val <- 13
  else if (bg == "B-") blood_group_val <- 14
  else if (bg == "O+") blood_group_val <- 15
  else if (bg == "O-") blood_group_val <- 16
  else if (bg == "AB+") blood_group_val <- 17
  else if (bg == "AB-") blood_group_val <- 18
}

# Extended blood markers — use live user values, fall back to population medians
vitd3_val           <- safe_num(input_data$personal$vitaminD3, 26.10)
shbg_val            <- safe_num(input_data$personal$shbg, 52.0)       # nmol/L median
fasting_insulin_val <- safe_num(input_data$personal$fastingInsulin, 10.5) # µIU/mL median
homa_ir_val         <- 2.2 # HOMA-IR removed
testosterone_val    <- safe_num(input_data$personal$testosterone, 40.0)
prl_val             <- safe_num(input_data$personal$prl, 21.78)
prg_val             <- safe_num(input_data$personal$prg, 0.32)
haemoglobin_val     <- safe_num(input_data$personal$haemoglobin, 11.0)
bp_sys_val          <- safe_num(input_data$personal$bpSystolic, 115.0)
bp_dia_val          <- safe_num(input_data$personal$bpDiastolic, 78.0)

# Body measurements — use live user values (TRAINED FEATURES)
waist_val    <- safe_num(input_data$personal$waist, 34.0)       # inch median
hip_val      <- safe_num(input_data$personal$hip, 38.0)         # inch median
whr_val      <- safe_num(input_data$personal$waistHipRatio, 0.89)

# Random Blood Sugar — use live value from user, fall back to population median
rbs_val <- safe_num(input_data$personal$rbs, 100.0)

features <- data.frame(
  `Age..yrs.` = safe_num(input_data$personal$age, 28.0),
  `Weight..Kg.` = safe_num(input_data$personal$weight, 60.0),
  `Height.Cm.` = safe_num(input_data$personal$height, 162.0),
  `BMI` = safe_num(input_data$personal$bmi, 22.0),
  `Pulse.rate.bpm.` = safe_num(input_data$personal$pulseRate, 72.0),
  `RR..breaths.min.` = safe_num(input_data$personal$respiratoryRate, 18.0),
  `Hb.g.dl.` = haemoglobin_val,
  `Cycle.R.I.` = as.integer(cycle_regularity_val),
  `Cycle.length.days.` = safe_num(input_data$menstrual$periodDuration, 5.0),
  `Pregnant.Y.N.` = as.integer(ifelse(isTRUE(input_data$personal$pregnant), 1, 0)),
  `FSH.mIU.mL.` = fsh_val,
  `LH.mIU.mL.` = lh_val,
  `FSH.LH` = fsh_lh_ratio,
  `TSH..mIU.L.` = safe_num(input_data$personal$tsh, 2.285),
  `AMH.ng.mL.` = safe_num(input_data$personal$amh, 3.90),
  `PRL.ng.mL.` = prl_val,
  `Vit.D3..ng.mL.` = vitd3_val,
  `PRG.ng.mL.` = prg_val,
  `Hip.inch.` = hip_val,
  `Waist.inch.` = waist_val,
  `Waist.Hip.Ratio` = whr_val,
  `RBS.mg.dl.` = safe_num(input_data$personal$rbs, 100.0),
  `Weight.gain.Y.N.` = as.integer(ifelse(isTRUE(input_data$symptoms$weightGain), 1, 0)),
  `hair.growth.Y.N.` = as.integer(ifelse(isTRUE(input_data$symptoms$hairGrowth), 1, 0)),
  `Skin.darkening..Y.N.` = as.integer(ifelse(isTRUE(input_data$symptoms$skinDarkening), 1, 0)),
  `Hair.loss.Y.N.` = as.integer(ifelse(isTRUE(input_data$symptoms$hairLoss), 1, 0)),
  `Pimples.Y.N.` = as.integer(ifelse(isTRUE(input_data$symptoms$pimples), 1, 0)),
  `Reg.Exercise.Y.N.` = as.integer(reg_exercise_val),
  `BP._Systolic..mmHg.` = bp_sys_val,
  `BP._Diastolic..mmHg.` = bp_dia_val,
  `Follicle.No...L.` = safe_num(input_data$menstrual$follicleNoL, safe_num(input_data$menstrual$follicleNo, 5.0)),
  `Follicle.No...R.` = safe_num(input_data$menstrual$follicleNoR, safe_num(input_data$menstrual$follicleNo, 6.0)),
  `Avg..F.size..L...mm.` = safe_num(input_data$menstrual$avgFsizeL, safe_num(input_data$menstrual$avgFsize, 15.0)),
  `Avg..F.size..R...mm.` = safe_num(input_data$menstrual$avgFsizeR, safe_num(input_data$menstrual$avgFsize, 16.0)),
  `Endometrium..mm.` = safe_num(input_data$menstrual$endometrium, 8.43),
  check.names = FALSE
)

# Log all key inputs for traceability
message(sprintf(
  "[PRABHA] Waist=%.1f\" Hip=%.1f\" WHR=%.2f | RBS=%.1f | Vit D3=%.2f SHBG=%.2f FI=%.2f HOMA-IR=%.2f | FamilyHx=%d | FastFood=%d Exercise=%d Stress=%s Sleep=%.1f",
  waist_val, hip_val, whr_val, rbs_val,
  vitd3_val, shbg_val, fasting_insulin_val, homa_ir_val,
  family_history_val, fast_food_val, reg_exercise_val, stress_level_val, sleep_hours_val
))

# 6. Run prediction
prediction_class <- predict(model, features)
prediction_prob <- predict(model, features, type = "prob")

# Extract probability score for the positive class ("Yes")
prob_val <- 0.0
if ("Yes" %in% colnames(prediction_prob)) {
  prob_val <- round(prediction_prob[1, "Yes"] * 100, 1)
} else {
  prob_val <- round(prediction_prob[1, 2] * 100, 1)
}

# Resolve final classification result
result_str <- as.character(prediction_class[1])
ui_result <- "Low Risk"
if (result_str == "Yes" || prob_val >= 50.0) {
  ui_result <- "High Risk"
}

# 7. Generate clinical recommendations based on risk result
recommendations <- if (ui_result == "High Risk") {
  c(
    "Consult a gynecologist or endocrinologist immediately.",
    "Get hormonal blood tests (FSH, LH, testosterone, insulin).",
    "Consider pelvic ultrasound for ovarian cysts.",
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

# Calculate dynamic confidence based on the model's winning probability
confidence_val <- round(max(prediction_prob[1, ]) * 100, 1)

# 8. Output JSON string to console
output <- list(
  result = ui_result,
  probability = prob_val,
  confidence = confidence_val,
  recommendation = recommendations
)

cat(toJSON(output, auto_unbox = TRUE))
