## predict_example_dataset3.R
##
## Example: loading and using the Dataset 3 model bundle (XGBoost, Logistic
## Regression, SVM). Dataset 3 adds ovarian ultrasound fields (follicle
## counts, follicle sizes, endometrium thickness) to the physical/clinical
## baseline. Every field is required -- no missing-value handling in this
## plain bundle.

suppressMessages({ library(xgboost); library(e1071) })

bundle <- readRDS("Dataset3_models_bundle.rds")

FEATURES <- bundle$features
cat("Required input fields, in order:\n")
for (f in FEATURES) cat(" -", f, "\n")

new_patient <- data.frame(
  `Age (yrs)` = 30, `Weight (Kg)` = 70, `Height(Cm)` = 168, `BMI` = 23.2,
  `Cycle(R/I)` = 4, `Cycle length(days)` = 5, `Hip(inch)` = 37, `Waist(inch)` = 32,
  `Waist:Hip Ratio` = 0.86, `Weight gain(Y/N)` = 0, `hair growth(Y/N)` = 1,
  `Skin darkening (Y/N)` = 0, `Hair loss(Y/N)` = 0, `Pimples(Y/N)` = 1,
  `Fast food (Y/N)` = 0, `Reg.Exercise(Y/N)` = 1,
  `Follicle No. (L)` = 12, `Follicle No. (R)` = 14,
  `Avg. F size (L) (mm)` = 9, `Avg. F size (R) (mm)` = 8.5,
  `Endometrium (mm)` = 7.2,
  check.names = FALSE
)
new_patient <- new_patient[, FEATURES]

## ---- XGBoost (no scaling needed) ------------------------------------------
dm <- xgb.DMatrix(data = as.matrix(new_patient))
xgb_proba <- predict(bundle$xgboost, dm)
cat(sprintf("\nXGBoost:              P(PCOS)=%.3f\n", xgb_proba))

## ---- Logistic Regression / SVM (need the SAME scaler used at training) ---
scaled <- sweep(new_patient, 2, bundle$scaler_means, "-")
scaled <- sweep(scaled, 2, bundle$scaler_sds, "/")
scaled <- as.data.frame(scaled)

lr_proba <- predict(bundle$logistic_regression, newdata = scaled, type = "response")
cat(sprintf("Logistic Regression:  P(PCOS)=%.3f\n", lr_proba))

svm_raw <- predict(bundle$svm, newdata = scaled, probability = TRUE)
svm_proba <- attr(svm_raw, "probabilities")[, "Yes"]
cat(sprintf("SVM (radial):         P(PCOS)=%.3f\n", svm_proba))
