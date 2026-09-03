## train_dataset2_models.R
##
## Trains three models on Dataset 3 (the richer, 33-feature multimodal-ish
## dataset -- clinical/physical + hormonal + biochemical + vitals):
##   - XGBoost (tree-based, recommended)
##   - Logistic Regression (glm, binomial)
##   - SVM (radial kernel, e1071, probability output enabled)
##
## LR and SVM require scaled features (same pattern as the earlier Python
## reduced-model bundle: scaler fit on training data only, reused at
## inference -- never refit on new data).
##
## Outputs: one .rds per model + one combined bundle .rds + a feature
## importance ranking + validation metrics.

suppressMessages({
  library(xgboost)
  library(e1071)
})
set.seed(42)

df <- read.csv("Dataset3_clean.csv", stringsAsFactors = FALSE, check.names = FALSE)
names(df) <- trimws(names(df))
target_col <- "PCOS (Y/N)"

feature_cols <- setdiff(names(df), target_col)
cat("Total features:", length(feature_cols), "\n")

y <- factor(df[[target_col]], levels = c(0, 1), labels = c("No", "Yes"))
X <- df[, feature_cols]

## ---- train/test split (80/20, stratified) --------------------------------
n <- nrow(df)
idx_yes <- which(y == "Yes"); idx_no <- which(y == "No")
test_idx <- c(sample(idx_yes, size = round(0.2 * length(idx_yes))),
              sample(idx_no,  size = round(0.2 * length(idx_no))))
train_idx <- setdiff(seq_len(n), test_idx)

X_train <- X[train_idx, ]; y_train <- y[train_idx]
X_test  <- X[test_idx, ];  y_test  <- y[test_idx]

## ---- scaler: fit on TRAIN only, matches earlier Python bundle pattern ----
train_means <- sapply(X_train, mean)
train_sds   <- sapply(X_train, sd)
train_sds[train_sds == 0] <- 1  # guard against constant columns

scale_with <- function(data, means, sds) {
  scaled <- sweep(data, 2, means, "-")
  scaled <- sweep(scaled, 2, sds, "/")
  as.data.frame(scaled)
}
X_train_scaled <- scale_with(X_train, train_means, train_sds)
X_test_scaled  <- scale_with(X_test, train_means, train_sds)

## ============================================================= XGBoost
dtrain <- xgb.DMatrix(data = as.matrix(X_train), label = as.numeric(y_train) - 1)
dtest  <- xgb.DMatrix(data = as.matrix(X_test),  label = as.numeric(y_test) - 1)

xgb_model <- xgb.train(
  data = dtrain, nrounds = 300,
  params = list(objective = "binary:logistic", eval_metric = "logloss",
                max_depth = 4, eta = 0.05, subsample = 0.9, colsample_bytree = 0.9)
)

## ============================================================= Logistic Regression
lr_data_train <- cbind(X_train_scaled, PCOS = y_train)
lr_model <- glm(PCOS ~ ., data = lr_data_train, family = binomial())

## ============================================================= SVM (radial kernel)
svm_data_train <- cbind(X_train_scaled, PCOS = y_train)
svm_model <- svm(PCOS ~ ., data = svm_data_train, kernel = "radial",
                  probability = TRUE, cost = 1, gamma = 1 / ncol(X_train_scaled))

## ---- evaluation helpers ----------------------------------------------------
manual_auc <- function(proba, actual_binary) {
  pos <- proba[actual_binary == 1]; neg <- proba[actual_binary == 0]
  n_pos <- length(pos); n_neg <- length(neg)
  ranks <- rank(c(pos, neg))
  (sum(ranks[seq_len(n_pos)]) - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)
}
metrics <- function(pred_class, proba, actual, label) {
  actual_bin <- as.numeric(actual == "Yes")
  pred_bin <- as.numeric(pred_class == "Yes")
  acc <- mean(pred_bin == actual_bin)
  auc <- manual_auc(proba, actual_bin)
  tp <- sum(pred_bin == 1 & actual_bin == 1); fp <- sum(pred_bin == 1 & actual_bin == 0)
  fn <- sum(pred_bin == 0 & actual_bin == 1)
  precision <- tp / (tp + fp); recall <- tp / (tp + fn)
  f1 <- 2 * precision * recall / (precision + recall)
  cat(sprintf("%-22s Acc=%.4f  AUC=%.4f  Prec=%.4f  Rec=%.4f  F1=%.4f\n",
              label, acc, auc, precision, recall, f1))
  list(accuracy = acc, auc = auc, precision = precision, recall = recall, f1 = f1)
}

cat("\n=== Held-out test set performance (Dataset 3, all", length(feature_cols), "features) ===\n")
results <- list()

xgb_proba <- predict(xgb_model, dtest)
xgb_pred  <- factor(ifelse(xgb_proba > 0.5, "Yes", "No"), levels = c("No", "Yes"))
results$xgboost <- metrics(xgb_pred, xgb_proba, y_test, "XGBoost")

lr_proba <- predict(lr_model, newdata = X_test_scaled, type = "response")
lr_pred  <- factor(ifelse(lr_proba > 0.5, "Yes", "No"), levels = c("No", "Yes"))
results$logistic_regression <- metrics(lr_pred, lr_proba, y_test, "Logistic Regression")

svm_pred_raw <- predict(svm_model, newdata = X_test_scaled, probability = TRUE)
svm_proba <- attr(svm_pred_raw, "probabilities")[, "Yes"]
results$svm <- metrics(svm_pred_raw, svm_proba, y_test, "SVM (radial)")

## ---- feature importance (XGBoost gain, closest R analogue to SHAP here) --
cat("\n=== XGBoost feature importance (Gain) ===\n")
imp <- xgb.importance(model = xgb_model, feature_names = feature_cols)
print(imp[1:min(15, nrow(imp)), c("Feature", "Gain")])

## ---- save everything -------------------------------------------------------
saveRDS(xgb_model, "Dataset3_xgboost_model.rds")
saveRDS(lr_model, "Dataset3_logistic_regression_model.rds")
saveRDS(svm_model, "Dataset3_svm_model.rds")

bundle <- list(
  features = feature_cols,
  scaler_means = train_means,
  scaler_sds = train_sds,
  xgboost = xgb_model,
  logistic_regression = lr_model,
  svm = svm_model,
  validation_results = results,
  feature_importance = imp,
  notes = paste("Dataset 3 (33 features: clinical, physical, hormonal, biochemical, vitals).",
                "LR and SVM require scaling with scaler_means/scaler_sds (fit on training",
                "data only). XGBoost uses raw (unscaled) features directly.")
)
saveRDS(bundle, "Dataset3_models_bundle.rds")

write.csv(imp, "Dataset3_feature_importance.csv", row.names = FALSE)
write.csv(
  data.frame(
    Model = c("XGBoost", "Logistic Regression", "SVM (radial)"),
    Accuracy = c(results$xgboost$accuracy, results$logistic_regression$accuracy, results$svm$accuracy),
    AUC = c(results$xgboost$auc, results$logistic_regression$auc, results$svm$auc),
    Precision = c(results$xgboost$precision, results$logistic_regression$precision, results$svm$precision),
    Recall = c(results$xgboost$recall, results$logistic_regression$recall, results$svm$recall),
    F1 = c(results$xgboost$f1, results$logistic_regression$f1, results$svm$f1)
  ),
  "Dataset3_validation_results.csv", row.names = FALSE
)

cat("\nSaved: Dataset3_xgboost_model.rds, Dataset3_logistic_regression_model.rds,\n")
cat("       Dataset3_svm_model.rds, Dataset3_models_bundle.rds,\n")
cat("       Dataset3_feature_importance.csv, Dataset3_validation_results.csv\n")
