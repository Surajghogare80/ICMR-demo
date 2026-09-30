# inspect_model.R
# Mandatory structural inspection of rf_model_new.rds
# DO NOT make any code changes until this output is reviewed.

suppressPackageStartupMessages({
  library(jsonlite)
  library(randomForest)
})

rds_path <- "E:/Suraj ICMR/ICMR-demo/pcosense-ai/backend/ai/rf_model_new.rds"
cat("=== LOADING RDS ===\n")
obj <- readRDS(rds_path)

cat("\n=== TOP-LEVEL CLASS ===\n")
cat(paste(class(obj), collapse=", "), "\n")

cat("\n=== IS IT A LIST? ===\n")
cat(is.list(obj), "\n")

cat("\n=== TOP-LEVEL NAMES ===\n")
if (!is.null(names(obj))) {
  cat(paste(names(obj), collapse="\n"), "\n")
} else {
  cat("(no names — single model object)\n")
}

cat("\n=== LENGTH ===\n")
cat(length(obj), "\n")

# Helper: inspect one RF model object
inspect_rf <- function(m, label) {
  cat("\n========================================\n")
  cat(paste0("INSPECTING: ", label, "\n"))
  cat("========================================\n")
  cat("Class:", paste(class(m), collapse=", "), "\n")

  # Handle caret train objects
  if (inherits(m, "train")) {
    cat("Type: caret::train object\n")
    cat("Method:", m$method, "\n")
    fm <- m$finalModel
    cat("finalModel class:", paste(class(fm), collapse=", "), "\n")
    cat("finalModel$ntree:", fm$ntree, "\n")
    cat("finalModel$mtry:", fm$mtry, "\n")
    cat("Predictor names (from finalModel$xNames):\n")
    cat(paste(fm$xNames, collapse="\n"), "\n")
    cat("\nTraining outcome (target) levels:\n")
    cat(paste(levels(m$trainingData$.outcome), collapse=", "), "\n")
    cat("\nxlevels (factor levels in training data):\n")
    print(m$xlevels)
    cat("\nPreprocessing info:\n")
    print(m$preProcess)
    return(invisible(NULL))
  }

  # Handle raw randomForest objects
  if (inherits(m, "randomForest")) {
    cat("Type: randomForest object\n")
    cat("ntree:", m$ntree, "\n")
    cat("mtry:", m$mtry, "\n")
    cat("type:", m$type, "\n")

    cat("\n--- Predictor names (from forest$xlevels) ---\n")
    if (!is.null(m$forest$xlevels)) {
      cat(paste(names(m$forest$xlevels), collapse="\n"), "\n")
    }

    cat("\n--- Predictor names (from importance) ---\n")
    if (!is.null(rownames(m$importance))) {
      cat(paste(rownames(m$importance), collapse="\n"), "\n")
    }

    cat("\n--- Predictor names (from terms) ---\n")
    if (!is.null(m$terms)) {
      cat(paste(attr(m$terms, "term.labels"), collapse="\n"), "\n")
    }

    cat("\n--- Predictor names (from forest$ncat) ---\n")
    if (!is.null(names(m$forest$ncat))) {
      cat(paste(names(m$forest$ncat), collapse="\n"), "\n")
    }

    cat("\n--- Classes (target levels) ---\n")
    cat(paste(m$classes, collapse=", "), "\n")

    cat("\n--- Factor xlevels (categorical predictor levels) ---\n")
    xlevels <- m$forest$xlevels
    if (!is.null(xlevels)) {
      for (nm in names(xlevels)) {
        lvls <- xlevels[[nm]]
        if (length(lvls) > 1) {
          cat(paste0("  ", nm, ": ", paste(lvls, collapse=" | ")), "\n")
        }
      }
    }

    cat("\n--- NA action / missing value handling ---\n")
    cat("na.action:\n")
    print(m$na.action)

    cat("\nnforest na.action:\n")
    if (!is.null(attr(m$forest, "na.action"))) {
      print(attr(m$forest, "na.action"))
    } else {
      cat("(none stored)\n")
    }

    cat("\n--- Can predict with NA? Test ---\n")
    # Build a tiny 1-row test with all NAs
    pnames <- rownames(m$importance)
    if (is.null(pnames)) pnames <- names(m$forest$ncat)
    if (!is.null(pnames) && length(pnames) > 0) {
      test_df <- as.data.frame(matrix(NA, nrow=1, ncol=length(pnames)))
      names(test_df) <- pnames
      result <- tryCatch({
        predict(m, newdata=test_df, type="prob")
        "YES — model accepts NA without error"
      }, error=function(e) {
        paste("NO — error with NA input:", e$message)
      })
      cat(result, "\n")
    }
    return(invisible(NULL))
  }

  # Unknown type
  cat("Unknown model type. str():\n")
  str(m, max.level=2)
}

# If obj is a list of multiple models, inspect each
if (is.list(obj) && !inherits(obj, "randomForest") && !inherits(obj, "train")) {
  cat("\n=== MULTIPLE MODELS DETECTED — inspecting each ===\n")
  for (nm in names(obj)) {
    inspect_rf(obj[[nm]], nm)
  }
} else {
  # Single model
  inspect_rf(obj, "rf_model_new.rds (single model)")
}

cat("\n=== INSPECTION COMPLETE ===\n")
