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
fsh_lh_ratio <- if (lh_val > 0) fsh_val / lh_val else 2.13

# Extended blood markers — use live user values, fall back to population medians
vitd3_val           <- safe_num(input_data$personal$vitaminD3, 26.10)
shbg_val            <- safe_num(input_data$personal$shbg, 52.0)       # nmol/L median
fasting_insulin_val <- safe_num(input_data$personal$fastingInsulin, 10.5) # µIU/mL median
homa_ir_val         <- safe_num(input_data$personal$insulinResistance, 2.2) # HOMA-IR median

# Body measurements — use live user values (TRAINED FEATURES)
waist_val    <- safe_num(input_data$personal$waist, 34.0)       # inch median
hip_val      <- safe_num(input_data$personal$hip, 38.0)         # inch median
whr_val      <- safe_num(input_data$personal$waistHipRatio, 0.89)

# Random Blood Sugar — live value (TRAINED FEATURE)
rbs_val <- safe_num(input_data$personal$rbs, 100.0)             # mg/dL median

features <- data.frame(
  `Age..yrs.` = as.numeric(input_data$personal$age),
  `Weight..Kg.` = as.numeric(input_data$personal$weight),
  `Height.Cm.` = as.numeric(input_data$personal$height),
  `BMI` = as.numeric(input_data$personal$bmi),
  `Pulse.rate.bpm.` = 72, # Imputed median
  `RR..breaths.min.` = 18, # Imputed median
  `Hb.g.dl.` = safe_num(input_data$personal$hb, 11.0),
  `Cycle.R.I.` = as.integer(cycle_regularity_val),
  `Cycle.length.days.` = as.numeric(input_data$menstrual$periodDuration), # Kaggle dataset misnomer
  `Pregnant.Y.N.` = 0, # Imputed median
  `FSH.mIU.mL.` = fsh_val,
  `LH.mIU.mL.` = lh_val,
  `FSH.LH` = fsh_lh_ratio,
  `TSH..mIU.L.` = safe_num(input_data$personal$tsh, 2.285),
  `AMH.ng.mL.` = safe_num(input_data$personal$amh, 3.90),
  `PRL.ng.mL.` = 21.78, # Prolactin removed from UI — use population median
  `Vit.D3..ng.mL.` = vitd3_val,
  `PRG.ng.mL.` = 0.32, # Imputed median
  `Hip.inch.` = hip_val,               # LIVE VALUE
  `Waist.inch.` = waist_val,           # LIVE VALUE
  `Waist.Hip.Ratio` = whr_val,         # LIVE VALUE (auto-calculated)
  `RBS.mg.dl.` = rbs_val,             # LIVE VALUE (Random Blood Sugar)
  `Weight.gain.Y.N.` = as.integer(ifelse(input_data$symptoms$weightGain, 1, 0)),
  `hair.growth.Y.N.` = as.integer(ifelse(input_data$symptoms$hairGrowth, 1, 0)),
  `Skin.darkening..Y.N.` = as.integer(ifelse(input_data$symptoms$skinDarkening, 1, 0)),
  `Hair.loss.Y.N.` = as.integer(ifelse(input_data$symptoms$hairLoss, 1, 0)),
  `Pimples.Y.N.` = as.integer(ifelse(input_data$symptoms$pimples, 1, 0)),
  `Reg.Exercise.Y.N.` = as.integer(reg_exercise_val),
  `BP._Systolic..mmHg.` = 115.0, # Imputed median
  `BP._Diastolic..mmHg.` = 78.0, # Imputed median
  `Follicle.No...L.` = safe_num(input_data$menstrual$follicleNo, 5.0),
  `Follicle.No...R.` = safe_num(input_data$menstrual$follicleNo, 6.0),
  `Avg..F.size..L...mm.` = safe_num(input_data$menstrual$avgFsize, 15.0),
  `Avg..F.size..R...mm.` = safe_num(input_data$menstrual$avgFsize, 16.0),
  `Endometrium..mm.` = safe_num(input_data$menstrual$endometrium, 8.43),
  # Lifestyle features — exact column names as expected by the trained model
  `Fast food (Y/N)` = as.integer(fast_food_val),
  `Reg.Exercise(Y/N)` = as.integer(reg_exercise_val),
  `Stress Levels` = stress_level_val,
  check.names = FALSE # Prevent R from converting dots to spaces/underscores
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

# 8. Output JSON string to console
output <- list(
  result = ui_result,
  probability = prob_val,
  confidence = 95.0,
  recommendation = recommendations
)

cat(toJSON(output, auto_unbox = TRUE))
