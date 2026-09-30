## predict_dataset2_missing_capable.R
##
## Predictor for the Dataset 2 missing-value-capable XGBoost model.
## Mandatory fields (10, including both ovarian ultrasound follicle counts) must always be
## supplied; the remaining 22 optional fields may be omitted in any
## combination -- the model was trained on missingness-augmented data and
## routes missing optional values natively via xgboost's NA handling.

suppressMessages(library(xgboost))

PCOSPredictorDataset3 <- setRefClass(
  "PCOSPredictorDataset3",
  fields = list(model = "ANY", mandatory = "character", optional = "character", all_features = "character"),
  methods = list(
    initialize = function(...) {
      callSuper(...)
      meta <- readRDS("Dataset3_missing_capable_meta.rds")
      mandatory <<- meta$mandatory
      optional <<- meta$optional
      all_features <<- meta$all_features
      model <<- xgb.load("Dataset3_missing_capable_xgb.model")
    },
    predict_patient = function(patient) {
      missing_mandatory <- mandatory[!(mandatory %in% names(patient)) |
                                        sapply(mandatory, function(f) is.null(patient[[f]]))]
      if (length(missing_mandatory) > 0) {
        stop(paste0("Missing required field(s): ", paste(missing_mandatory, collapse = ", "),
                     ". These are the top-10 importance-ranked features (includes both ovarian ",
                     "ultrasound follicle counts) and must be provided for every prediction."))
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
  predictor <- PCOSPredictorDataset3$new()

  cat("--- Example 1: mandatory fields only (includes both follicle counts + sizes) ---\n")
  patient_min <- list(
    `Follicle No. (R)` = 14, `Follicle No. (L)` = 12, `hair growth(Y/N)` = 1,
    `Weight gain(Y/N)` = 0, `Skin darkening (Y/N)` = 0, `Age (yrs)` = 30,
    `Cycle(R/I)` = 4, `Avg. F size (L) (mm)` = 9, `Avg. F size (R) (mm)` = 8.5,
    `Weight (Kg)` = 70
  )
  print(predictor$predict_patient(patient_min))

  cat("\n--- Example 2: mandatory + a few optional fields ---\n")
  patient_partial <- patient_min
  patient_partial$`Waist(inch)` <- 32
  patient_partial$`BMI` <- 23.2
  print(predictor$predict_patient(patient_partial))

  cat("\n--- Example 3: missing a mandatory ultrasound field (should error) ---\n")
  patient_bad <- patient_min
  patient_bad$`Follicle No. (R)` <- NULL
  result <- tryCatch(predictor$predict_patient(patient_bad), error = function(e) e)
  cat("Raised as expected:", conditionMessage(result), "\n")
}
