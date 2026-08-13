# backend/ai/predict.R
# Pure Prediction Engine
#
# Uses the raw randomForest::predict() inside the caret object.
# Manually builds a model-matrix-compatible dataframe from raw features.
#
# Accepts a JSON file path as its only argument.
# JSON contains: modelId, features (named object with exact predictor values)

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

# 1. Read the temp JSON file path from args
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

# 2. Parse Payload
payload <- tryCatch({
  fromJSON(input_path)
}, error = function(e) {
  cat(toJSON(list(error = paste("Failed to parse JSON:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

modelId       <- payload$modelId
features_list <- payload$features

if (is.null(modelId) || is.null(features_list)) {
  cat(toJSON(list(error = "Payload must contain modelId and features."), auto_unbox = TRUE))
  quit(status = 1)
}

# 3. Load the Models
model_path <- "ai/All_4_RF_Models.rds"
if (!file.exists(model_path)) {
  cat(toJSON(list(error = paste("Model file not found at", model_path)), auto_unbox = TRUE))
  quit(status = 1)
}

model_list <- tryCatch({
  readRDS(model_path)
}, error = function(e) {
  cat(toJSON(list(error = paste("Failed to read RDS file:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

if (!(modelId %in% names(model_list))) {
  cat(toJSON(list(error = paste("Model ID", modelId, "not found. Available:", paste(names(model_list), collapse=", "))), auto_unbox = TRUE))
  quit(status = 1)
}

# 4. Extract the caret train object & the inner randomForest
caret_model   <- model_list[[modelId]]
rf_model      <- caret_model[["finalModel"]]
training_data <- caret_model[["trainingData"]]
caret_xlevels <- caret_model[["xlevels"]]   # factor levels used during training

# Predictor column names (raw, before dummy encoding)
predictor_names <- setdiff(names(training_data), ".outcome")

# 5. Build a 1-row data.frame matching the TRAINING data structure
#    (with factors encoded exactly as training)
#    Then use model.matrix() to expand to the same dummy columns the RF expects.

raw_df <- data.frame(row.names = 1)

for (feat in predictor_names) {
  if (!(feat %in% names(features_list))) {
    cat(toJSON(list(error = paste("CRITICAL: Missing required feature:", feat)), auto_unbox = TRUE))
    quit(status = 1)
  }
  
  val <- features_list[[feat]]
  
  # Cast to factor if it was a factor in training
  if (!is.null(caret_xlevels) && feat %in% names(caret_xlevels)) {
    raw_df[[feat]] <- factor(as.character(val), levels = caret_xlevels[[feat]])
  } else if (is.factor(training_data[[feat]])) {
    raw_df[[feat]] <- factor(as.character(val), levels = levels(training_data[[feat]]))
  } else {
    raw_df[[feat]] <- as.numeric(val)
  }
}

# 6. Build model matrix (same as what caret does internally)
#    model.matrix() creates dummy variables from factors using contr.treatment
formula_str <- paste("~", paste(sprintf("`%s`", predictor_names), collapse = " + "))
mm <- model.matrix(as.formula(formula_str), data = raw_df)

# Remove the intercept column
mm <- mm[, -1, drop = FALSE]

# The RF model's xNames are the column names it expects
expected_names <- rf_model[["xNames"]]

# Ensure we have exactly the right columns in the right order
# Some columns might be missing if a factor level wasn't present (e.g., the reference level dummy)
new_df <- data.frame(matrix(0, nrow = 1, ncol = length(expected_names)))
names(new_df) <- expected_names

for (col in colnames(mm)) {
  if (col %in% expected_names) {
    new_df[[col]] <- mm[1, col]
  }
}

# 7. Execute Prediction
result_out <- tryCatch({
  prob_mat <- predict(rf_model, newdata = new_df, type = "prob")
  
  # Detect the PCOS column name from the trained model
  if ("PCOS" %in% colnames(prob_mat)) {
    prob_pmos <- as.numeric(prob_mat[1, "PCOS"])
  } else if ("Yes" %in% colnames(prob_mat)) {
    prob_pmos <- as.numeric(prob_mat[1, "Yes"])
  } else if ("1" %in% colnames(prob_mat)) {
    prob_pmos <- as.numeric(prob_mat[1, "1"])
  } else {
    # Fallback: second column is positive class in binary classification
    prob_pmos <- as.numeric(prob_mat[1, 2])
  }
  
  prob_val       <- round(prob_pmos * 100, 1)
  confidence_val <- round(max(prob_pmos, 1 - prob_pmos) * 100, 1)
  ui_result      <- ifelse(prob_pmos >= 0.5, "High Risk", "Low Risk")
  
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
}, error = function(e) {
  list(error = paste("Prediction failed:", e$message))
})

cat(toJSON(result_out, auto_unbox = TRUE))
