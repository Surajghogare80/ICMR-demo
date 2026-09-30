## pcos_predictor_xgb.R
##
## R predictor using the real xgboost R package (built from source in this
## session, since CRAN isn't reachable and Ubuntu's apt has no R xgboost
## package -- only randomForest). This is the R model that actually matches
## the Python design: native NA routing learned via missingness-augmented
## training, not post-hoc imputation.
##
## Usage:
##   source("pcos_predictor_xgb.R")
##   predictor <- PCOSPredictorXGB$new()
##   predictor$predict_patient(list(Skin_darkening=1, hair_growth=1, Weight_gain=1,
##                           Fast_food=1, Age=27, Waist=34, Pimples=0,
##                           Cycle_RI=4, Cycle_length=6, Hip=40))

suppressMessages(library(xgboost))

PCOSPredictorXGB <- setRefClass(
  "PCOSPredictorXGB",
  fields = list(model = "ANY", mandatory = "character",
                optional = "character", all_features = "character"),
  methods = list(
    initialize = function(...) {
      callSuper(...)
      meta <- readRDS("pcos_xgb_R_meta.rds")
      mandatory <<- meta$mandatory
      optional <<- meta$optional
      all_features <<- meta$all_features
      model <<- xgb.load("pcos_missing_capable_xgb_R.model")
    },
    predict_patient = function(patient) {
      missing_mandatory <- mandatory[!(mandatory %in% names(patient)) |
                                        sapply(mandatory, function(f) is.null(patient[[f]]))]
      if (length(missing_mandatory) > 0) {
        stop(paste0("Missing required field(s): ", paste(missing_mandatory, collapse = ", "),
                     ". These are the top-10 SHAP-ranked features and must be provided ",
                     "for every prediction."))
      }
      row <- patient
      for (f in optional) if (is.null(row[[f]])) row[[f]] <- NA
      row_mat <- matrix(unlist(row[all_features]), nrow = 1, dimnames = list(NULL, all_features))
      dm <- xgb.DMatrix(data = row_mat, missing = NA)
      proba <- as.numeric(stats::predict(model, dm))
      pred <- ifelse(proba > 0.5, "PCOS", "No PCOS")
      provided_optional <- optional[optional %in% names(patient) &
                                       !sapply(optional, function(f) is.null(patient[[f]]))]
      list(prediction = pred, probability_PCOS = round(proba, 4),
           optional_fields_provided = provided_optional,
           optional_fields_missing = setdiff(optional, provided_optional))
    }
  )
)

if (sys.nframe() == 0) {
  predictor <- PCOSPredictorXGB$new()

  cat("--- Example 1: mandatory fields only ---\n")
  patient_min <- list(Skin_darkening = 1, hair_growth = 1, Weight_gain = 1, Fast_food = 1,
                       Age = 27, Waist = 34, Pimples = 0, Cycle_RI = 4, Cycle_length = 6, Hip = 40)
  print(predictor$predict_patient(patient_min))

  cat("\n--- Example 2: mandatory + BMI + Reg_Exercise ---\n")
  patient_partial <- patient_min
  patient_partial$BMI <- 29.4
  patient_partial$Reg_Exercise <- 0
  print(predictor$predict_patient(patient_partial))

  cat("\n--- Example 3: missing mandatory field (should error) ---\n")
  patient_bad <- patient_min
  patient_bad$Cycle_RI <- NULL
  result <- tryCatch(predictor$predict_patient(patient_bad), error = function(e) e)
  cat("Raised as expected:", conditionMessage(result), "\n")
}
