# backend/ai/predict.R
# PRABHA Single-Source Prediction Engine (Zero Imputation)
#
# Source of truth: rf_model_new.rds (Dataset1_RF, Dataset2_RF, Dataset3_RF)
# This script converts missing features (null in JSON) to NA and relies
# entirely on the randomForest model's native capability to handle NAs.

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

modelId       <- payload$modelId
features_list <- payload$features

if (is.null(modelId) || is.null(features_list)) {
  cat(toJSON(list(error = "Payload must contain modelId and features."), auto_unbox = TRUE))
  quit(status = 1)
}

# ─── 3. Load Single RDS Model ─────────────────────────────────────────────────
candidates <- c(
  "rf_model_new.rds",
  "ai/rf_model_new.rds",
  file.path(dirname(input_path), "rf_model_new.rds")
)
model_path <- NULL
for (cand in candidates) {
  if (file.exists(cand)) {
    model_path <- cand
    break
  }
}
if (is.null(model_path)) {
  cat(toJSON(list(error = "rf_model_new.rds not found."), auto_unbox = TRUE))
  quit(status = 1)
}
model_list <- tryCatch({
  readRDS(model_path)
}, error = function(e) {
  cat(toJSON(list(error = paste("Failed to read rf_model_new.rds:", e$message)), auto_unbox = TRUE))
  quit(status = 1)
})

if (!(modelId %in% names(model_list))) {
  cat(toJSON(list(error = paste(
    "Model ID", modelId, "not found in", model_path,
    ". Available:", paste(names(model_list), collapse = ", ")
  )), auto_unbox = TRUE))
  quit(status = 1)
}

rf_model <- model_list[[modelId]]

# ─── 4. Prepare New Data (ZERO IMPUTATION) ────────────────────────────────────
# Get the exact expected predictor names (as stored in the forest)
expected_names <- names(rf_model$forest$ncat)
if (is.null(expected_names)) {
  expected_names <- attr(rf_model$terms, "term.labels")
}

# Map incoming JSON features. Features not present in JSON are left as NULL
# which will become NA in the dataframe.
raw_names <- names(features_list)
sanitised_names <- make.names(raw_names)
# Replace names with sanitised names to match R model feature names
names(features_list) <- sanitised_names
sanitised_values <- features_list

rf_xlevels <- rf_model$forest$xlevels

# Build a 1-row data.frame precisely matching training levels and types.
new_df <- as.data.frame(
  lapply(expected_names, function(col) {
    # If the column isn't in sanitised_values at all, or it is NULL, it will be NULL here
    raw_val <- sanitised_values[[col]]
    
    # If missing in input (null), assign NA
    if (is.null(raw_val)) {
      lv <- rf_xlevels[[col]]
      if (!is.null(lv) && length(lv) > 1) {
        return(factor(NA, levels = lv))
      } else {
        return(NA_real_)
      }
    }
    
    lv <- rf_xlevels[[col]]
    # Factor column: xlevels entry has > 1 level
    if (!is.null(lv) && length(lv) > 1) {
      return(factor(as.character(raw_val), levels = lv))
    }
    
    # Numeric column
    return(as.numeric(raw_val))
  }),
  stringsAsFactors = FALSE
)
names(new_df) <- expected_names

# ─── 5. Run Prediction ────────────────────────────────────────────────────────
result_out <- tryCatch({
  # predict.randomForest natively handles NA values by tree-branch marginalization
  prob_mat <- predict(rf_model, newdata = new_df, type = "prob")
  
  # Detect the target positive class (usually "Yes")
  if ("Yes" %in% colnames(prob_mat)) {
    prob_pcos <- as.numeric(prob_mat[1, "Yes"])
  } else if ("PCOS" %in% colnames(prob_mat)) {
    prob_pcos <- as.numeric(prob_mat[1, "PCOS"])
  } else if ("1" %in% colnames(prob_mat)) {
    prob_pcos <- as.numeric(prob_mat[1, "1"])
  } else {
    prob_pcos <- as.numeric(prob_mat[1, 2])
  }
  
  # randomForest returns NA if ANY predictor used by the tree is NA and no na.action is specified.
  if (is.na(prob_pcos)) {
    missing_cols <- names(new_df)[is.na(new_df[1, ])]
    # Provide a clear, clinical message back to the frontend
    missing_msg <- paste("The trained model requires the following missing information to make a safe prediction:", 
                         paste(missing_cols, collapse = ", "))
    list(error = missing_msg, type = "MISSING_FEATURES", missingFields = missing_cols)
  } else {
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

# ─── 6. Output ────────────────────────────────────────────────────────────────
cat(toJSON(result_out, auto_unbox = TRUE))
