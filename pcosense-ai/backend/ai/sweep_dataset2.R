suppressMessages(library(xgboost))
set.seed(42)

df <- read.csv("Dataset2_clean.csv", stringsAsFactors = FALSE, check.names = FALSE)
names(df) <- trimws(names(df))
target_col <- "PCOS (Y/N)"
feature_cols <- setdiff(names(df), target_col)
y <- as.numeric(df[[target_col]])
X <- df[, feature_cols]

n <- nrow(df)
idx_yes <- which(y == 1); idx_no <- which(y == 0)
test_idx <- c(sample(idx_yes, size = round(0.2 * length(idx_yes))),
              sample(idx_no,  size = round(0.2 * length(idx_no))))
train_idx <- setdiff(seq_len(n), test_idx)
X_train <- X[train_idx, ]; y_train <- y[train_idx]
X_test <- X[test_idx, ]; y_test <- y[test_idx]

# importance order from the already-trained full model
imp <- read.csv("Dataset2_feature_importance.csv")
ranked_features <- imp$Feature

train_augmented_eval <- function(mandatory, optional) {
  all_feats <- c(mandatory, optional)
  N_COPIES <- 5
  frames <- list(X_train[, all_feats])
  labels <- list(y_train)
  for (c in seq_len(N_COPIES)) {
    tc <- X_train[, all_feats]
    per_row_rate <- runif(nrow(tc), 0, 1)
    for (f in optional) {
      drop <- runif(nrow(tc)) < per_row_rate
      tc[[f]][drop] <- NA
    }
    frames[[length(frames) + 1]] <- tc
    labels[[length(labels) + 1]] <- y_train
  }
  X_aug <- do.call(rbind, frames)
  y_aug <- unlist(labels)
  dtrain <- xgb.DMatrix(data = as.matrix(X_aug), label = y_aug, missing = NA)
  model <- xgb.train(data = dtrain, nrounds = 250,
                      params = list(objective = "binary:logistic", eval_metric = "logloss",
                                    max_depth = 4, eta = 0.07, subsample = 0.9, colsample_bytree = 0.9))
  # mandatory-only eval
  X_test_mand <- X_test[, all_feats]
  for (f in optional) X_test_mand[[f]] <- NA
  dtest <- xgb.DMatrix(data = as.matrix(X_test_mand), missing = NA)
  proba <- predict(model, dtest)
  pred <- as.numeric(proba > 0.5)
  acc <- mean(pred == y_test)
  tp <- sum(pred==1 & y_test==1); fp <- sum(pred==1 & y_test==0); fn <- sum(pred==0 & y_test==1)
  rec <- tp/(tp+fn)
  list(acc=acc, rec=rec)
}

for (k in c(6, 8, 10, 12, 15, 20)) {
  mandatory <- ranked_features[1:k]
  optional <- setdiff(ranked_features, mandatory)
  res <- train_augmented_eval(mandatory, optional)
  cat(sprintf("k=%2d mandatory -> mandatory-only Acc=%.4f  Recall=%.4f\n", k, res$acc, res$rec))
}
