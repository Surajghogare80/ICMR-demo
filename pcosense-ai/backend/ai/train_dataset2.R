## train_dataset2_xgboost_missing_capable.R
##
## XGBoost on Dataset 2 (32 features), trained the SAME way as the Dataset 1
## missing-value-capable model: top-10 by importance are MANDATORY, the
## remaining 22 are OPTIONAL, and the model is trained on missingness-
## augmented data so its native NA routing is genuinely learned rather than
## just tolerated (see the Dataset 1 write-up for why the naive version
## without augmentation fails).

suppressMessages(library(xgboost))
set.seed(42)

df <- read.csv("Dataset2_clean.csv", stringsAsFactors = FALSE, check.names = FALSE)
names(df) <- trimws(names(df))
target_col <- "PCOS (Y/N)"
feature_cols <- setdiff(names(df), target_col)
y <- as.numeric(df[[target_col]])
X <- df[, feature_cols]

## Mandatory/optional split chosen via a feature-count sweep (see
## sweep_dataset2.R): k=10 already reaches 97.75% accuracy / 95.1% recall in
## the worst case (mandatory fields only), matching Dataset 1's convention;
## gains beyond k=10 are modest relative to the extra fields required.
imp <- read.csv("Dataset2_feature_importance.csv")
ranked_features <- imp$Feature
MANDATORY <- ranked_features[1:10]
OPTIONAL  <- setdiff(ranked_features, MANDATORY)
ALL_FEATURES <- c(MANDATORY, OPTIONAL)

cat("Mandatory (10):\n"); print(MANDATORY)
cat("\nOptional (22):\n"); print(OPTIONAL)

n <- nrow(df)
idx_yes <- which(y == 1); idx_no <- which(y == 0)
test_idx <- c(sample(idx_yes, size = round(0.2 * length(idx_yes))),
              sample(idx_no,  size = round(0.2 * length(idx_no))))
train_idx <- setdiff(seq_len(n), test_idx)
X_train <- X[train_idx, ALL_FEATURES]; y_train <- y[train_idx]
X_test  <- X[test_idx, ALL_FEATURES];  y_test  <- y[test_idx]

## ---- missingness-augmented training set -----------------------------------
N_COPIES <- 6
frames <- list(X_train); labels <- list(y_train)
for (c in seq_len(N_COPIES)) {
  tc <- X_train
  per_row_rate <- runif(nrow(tc), 0, 1)
  for (f in OPTIONAL) {
    drop <- runif(nrow(tc)) < per_row_rate
    tc[[f]][drop] <- NA
  }
  frames[[length(frames) + 1]] <- tc
  labels[[length(labels) + 1]] <- y_train
}
X_train_aug <- do.call(rbind, frames)
y_train_aug <- unlist(labels)
cat("\nAugmented training set:", nrow(X_train_aug), "rows\n")

dtrain <- xgb.DMatrix(data = as.matrix(X_train_aug), label = y_train_aug, missing = NA)
model <- xgb.train(
  data = dtrain, nrounds = 400,
  params = list(objective = "binary:logistic", eval_metric = "logloss",
                max_depth = 4, eta = 0.05, subsample = 0.9, colsample_bytree = 0.9)
)

## ---- evaluation -------------------------------------------------------------
manual_auc <- function(proba, actual) {
  pos <- proba[actual == 1]; neg <- proba[actual == 0]
  n_pos <- length(pos); n_neg <- length(neg)
  ranks <- rank(c(pos, neg))
  (sum(ranks[seq_len(n_pos)]) - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)
}
evaluate <- function(data, actual, label) {
  dm <- xgb.DMatrix(data = as.matrix(data), missing = NA)
  proba <- predict(model, dm)
  pred <- as.numeric(proba > 0.5)
  acc <- mean(pred == actual)
  auc <- manual_auc(proba, actual)
  tp <- sum(pred==1 & actual==1); fp <- sum(pred==1 & actual==0); fn <- sum(pred==0 & actual==1)
  precision <- tp/(tp+fp); recall <- tp/(tp+fn)
  f1 <- 2*precision*recall/(precision+recall)
  cat(sprintf("%-45s Acc=%.4f  AUC=%.4f  Prec=%.4f  Rec=%.4f  F1=%.4f\n",
              label, acc, auc, precision, recall, f1))
  list(accuracy=acc, auc=auc, precision=precision, recall=recall, f1=f1)
}

cat("\n=== Held-out test set, Dataset 2, XGBoost native NA routing ===\n")
results <- list()
results$full_32 <- evaluate(X_test, y_test, "All 32 present")

X_mand <- X_test; for (f in OPTIONAL) X_mand[[f]] <- NA
results$mandatory_only <- evaluate(X_mand, y_test, "Only 10 mandatory (22 optional NA)")

X_40 <- X_test
for (f in OPTIONAL) { drop <- runif(nrow(X_40)) < 0.4; X_40[[f]][drop] <- NA }
results$partial_40 <- evaluate(X_40, y_test, "~40% random missing among optional")

X_70 <- X_test
for (f in OPTIONAL) { drop <- runif(nrow(X_70)) < 0.7; X_70[[f]][drop] <- NA }
results$partial_70 <- evaluate(X_70, y_test, "~70% random missing among optional")

## ---- save -------------------------------------------------------------------
xgb.save(model, "Dataset2_missing_capable_xgb.model")
saveRDS(list(mandatory = MANDATORY, optional = OPTIONAL, all_features = ALL_FEATURES,
             results = results), "Dataset2_missing_capable_meta.rds")
write.csv(
  data.frame(Scenario = c("All 32 present", "Only 10 mandatory", "~40% optional missing", "~70% optional missing"),
             Accuracy = sapply(results, function(r) r$accuracy),
             AUC = sapply(results, function(r) r$auc),
             Precision = sapply(results, function(r) r$precision),
             Recall = sapply(results, function(r) r$recall),
             F1 = sapply(results, function(r) r$f1)),
  "Dataset2_missing_capable_validation.csv", row.names = FALSE
)
cat("\nSaved Dataset2 missing-capable XGBoost model + metadata.\n")
