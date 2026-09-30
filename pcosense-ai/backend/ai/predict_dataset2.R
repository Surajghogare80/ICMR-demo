## predict_dataset2_missing_capable.R
##
## Predictor for the Dataset 2 missing-value-capable XGBoost model.
## Mandatory fields (10, including 4 hormonal lab values) must always be
## supplied; the remaining 22 optional fields may be omitted in any
## combination -- the model was trained on missingness-augmented data and
## routes missing optional values natively via xgboost's NA handling.

suppressMessages(library(xgboost))

PCOSPredictorDataset2 <- setRefClass(
  "PCOSPredictorDataset2",
  fields = list(model = "ANY", mandatory = "character", optional = "character", all_features = "character"),
  methods = list(
    initialize = function(...) {
      callSuper(...)
      meta <- readRDS("Dataset2_missing_capable_meta.rds")
      mandatory <<- meta$mandatory
      optional <<- meta$optional
      all_features <<- meta$all_features
      model <<- xgb.load("Dataset2_missing_capable_xgb.model")
    },
    predict_patient = function(patient) {
      missing_mandatory <- mandatory[!(mandatory %in% names(patient)) |
                                        sapply(mandatory, function(f) is.null(patient[[f]]))]
      if (length(missing_mandatory) > 0) {
        stop(paste0("Missing required field(s): ", paste(missing_mandatory, collapse = ", "),
                     ". These are the top-10 importance-ranked features (includes 4 hormonal lab ",
                     "values: AMH, LH, FSH/LH, TSH) and must be provided for every prediction."))
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
  predictor <- PCOSPredictorDataset2$new()

  cat("--- Example 1: mandatory fields only (includes 4 hormonal labs) ---\n")
  patient_min <- list(
    `hair growth(Y/N)` = 1, `Skin darkening (Y/N)` = 1, `Weight gain(Y/N)` = 1,
    `AMH(ng/mL)` = 7.2, `Cycle(R/I)` = 4, `Cycle length(days)` = 6, `Age (yrs)` = 27,
    `LH(mIU/mL)` = 9.1, `FSH/LH` = 0.55, `TSH (mIU/L)` = 3.4
  )
  print(predictor$predict_patient(patient_min))

  cat("\n--- Example 2: mandatory + a few optional fields ---\n")
  patient_partial <- patient_min
  patient_partial$`Waist(inch)` <- 34
  patient_partial$`BMI` <- 27.5
  print(predictor$predict_patient(patient_partial))

  cat("\n--- Example 3: missing a mandatory hormonal field (should error) ---\n")
  patient_bad <- patient_min
  patient_bad$`AMH(ng/mL)` <- NULL
  result <- tryCatch(predictor$predict_patient(patient_bad), error = function(e) e)
  cat("Raised as expected:", conditionMessage(result), "\n")
}
