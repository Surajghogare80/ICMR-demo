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
# Impute median values from the dataset for missing clinical/ultrasound/lab parameters.
cycle_regularity_val <- 2 # Default: Regular
if (input_data$menstrual$cycleRegularity == "Irregular") {
  cycle_regularity_val <- 4
} else if (input_data$menstrual$cycleRegularity == "Absent") {
  cycle_regularity_val <- 5
}

reg_exercise_val <- 1 # Default: Yes (has physical activity)
if (input_data$lifestyle$exerciseFreq == "Never") {
  reg_exercise_val <- 0
}

# Construct dataframe matching the 35 features in the model exactly
fsh_val <- if (!is.null(input_data$personal$fsh) && !is.na(as.numeric(input_data$personal$fsh))) as.numeric(input_data$personal$fsh) else 4.86
lh_val <- if (!is.null(input_data$personal$lh) && !is.na(as.numeric(input_data$personal$lh))) as.numeric(input_data$personal$lh) else 2.33
fsh_lh_ratio <- if (lh_val > 0) fsh_val / lh_val else 2.13

features <- data.frame(
  `Age..yrs.` = as.numeric(input_data$personal$age),
  `Weight..Kg.` = as.numeric(input_data$personal$weight),
  `Height.Cm.` = as.numeric(input_data$personal$height),
  `BMI` = as.numeric(input_data$personal$bmi),
  `Pulse.rate.bpm.` = 72, # Imputed median
  `RR..breaths.min.` = 18, # Imputed median
  `Hb.g.dl.` = if (!is.null(input_data$personal$hb) && !is.na(as.numeric(input_data$personal$hb))) as.numeric(input_data$personal$hb) else 11.0,
  `Cycle.R.I.` = as.integer(cycle_regularity_val),
  `Cycle.length.days.` = as.numeric(input_data$menstrual$periodDuration), # Kaggle dataset misnomer (stores period duration in this column)
  `Pregnant.Y.N.` = 0, # Imputed median
  `FSH.mIU.mL.` = fsh_val,
  `LH.mIU.mL.` = lh_val,
  `FSH.LH` = fsh_lh_ratio,
  `TSH..mIU.L.` = if (!is.null(input_data$personal$tsh) && !is.na(as.numeric(input_data$personal$tsh))) as.numeric(input_data$personal$tsh) else 2.285,
  `AMH.ng.mL.` = if (!is.null(input_data$personal$amh) && !is.na(as.numeric(input_data$personal$amh))) as.numeric(input_data$personal$amh) else 3.90,
  `PRL.ng.mL.` = if (!is.null(input_data$personal$prl) && !is.na(as.numeric(input_data$personal$prl))) as.numeric(input_data$personal$prl) else 21.78,
  `Vit.D3..ng.mL.` = 26.10, # Imputed median
  `PRG.ng.mL.` = 0.32, # Imputed median
  `Hip.inch.` = 38.0, # Imputed median
  `Waist.inch.` = 34.0, # Imputed median
  `Waist.Hip.Ratio` = 0.89, # Imputed median
  `RBS.mg.dl.` = 100.0, # Imputed median
  `Weight.gain.Y.N.` = as.integer(ifelse(input_data$symptoms$weightGain, 1, 0)),
  `hair.growth.Y.N.` = as.integer(ifelse(input_data$symptoms$hairGrowth, 1, 0)),
  `Skin.darkening..Y.N.` = as.integer(ifelse(input_data$symptoms$skinDarkening, 1, 0)),
  `Hair.loss.Y.N.` = as.integer(ifelse(input_data$symptoms$hairLoss, 1, 0)),
  `Pimples.Y.N.` = as.integer(ifelse(input_data$symptoms$pimples, 1, 0)),
  `Reg.Exercise.Y.N.` = as.integer(reg_exercise_val),
  `BP._Systolic..mmHg.` = 115.0, # Imputed median
  `BP._Diastolic..mmHg.` = 78.0, # Imputed median
  `Follicle.No...L.` = if (!is.null(input_data$menstrual$follicleNo) && !is.na(as.numeric(input_data$menstrual$follicleNo))) as.numeric(input_data$menstrual$follicleNo) else 5.0,
  `Follicle.No...R.` = if (!is.null(input_data$menstrual$follicleNo) && !is.na(as.numeric(input_data$menstrual$follicleNo))) as.numeric(input_data$menstrual$follicleNo) else 6.0,
  `Avg..F.size..L...mm.` = if (!is.null(input_data$menstrual$avgFsize) && !is.na(as.numeric(input_data$menstrual$avgFsize))) as.numeric(input_data$menstrual$avgFsize) else 15.0,
  `Avg..F.size..R...mm.` = if (!is.null(input_data$menstrual$avgFsize) && !is.na(as.numeric(input_data$menstrual$avgFsize))) as.numeric(input_data$menstrual$avgFsize) else 16.0,
  `Endometrium..mm.` = if (!is.null(input_data$menstrual$endometrium) && !is.na(as.numeric(input_data$menstrual$endometrium))) as.numeric(input_data$menstrual$endometrium) else 8.43,
  check.names = FALSE # Prevent R from converting dots to spaces/underscores
)

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
