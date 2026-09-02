## pcos_missing_capable_xgboost.R
##
## R xgboost version -- mirrors the Python model exactly:
##  - trained on Dataset 1's 16 features
##  - top-10 SHAP features MANDATORY, bottom-6 OPTIONAL
##  - trained on missingness-augmented data so xgboost's native NA routing
##    is genuinely learned (not just tolerated), matching the Python design

suppressMessages(library(xgboost))
set.seed(42)

df <- read.csv("D1_physical.csv", stringsAsFactors = FALSE)
names(df) <- c(
  "Age", "Weight_Kg", "Height_Cm", "BMI", "Cycle_RI", "Cycle_length",
  "Hip", "Waist", "Waist_Hip_Ratio", "Weight_gain", "hair_growth",
  "Skin_darkening", "Hair_loss", "Pimples", "Fast_food", "Reg_Exercise",
  "PCOS"
)

MANDATORY <- c("Skin_darkening", "hair_growth", "Weight_gain", "Fast_food",
               "Age", "Waist", "Pimples", "Cycle_RI", "Cycle_length", "Hip")
OPTIONAL  <- c("Weight_Kg", "Waist_Hip_Ratio", "Height_Cm", "Reg_Exercise",
               "BMI", "Hair_loss")
ALL_FEATURES <- c(MANDATORY, OPTIONAL)

n <- nrow(df)
idx_yes <- which(df$PCOS == 1)
idx_no  <- which(df$PCOS == 0)
test_idx <- c(sample(idx_yes, size = round(0.2 * length(idx_yes))),
              sample(idx_no,  size = round(0.2 * length(idx_no))))
train_idx <- setdiff(seq_len(n), test_idx)

train <- df[train_idx, ]
test  <- df[test_idx, ]

## ---- build missingness-augmented training set (same scheme as Python) ----
N_COPIES <- 6
aug_list <- list(train)
for (c in seq_len(N_COPIES)) {
  tc <- train
  per_row_rate <- runif(nrow(tc), 0, 1)
  for (f in OPTIONAL) {
    drop <- runif(nrow(tc)) < per_row_rate
    tc[[f]][drop] <- NA
  }
  aug_list[[length(aug_list) + 1]] <- tc
}
train_aug <- do.call(rbind, aug_list)
cat("Augmented training set:", nrow(train_aug), "rows\n")

dtrain <- xgb.DMatrix(data = as.matrix(train_aug[, ALL_FEATURES]),
                       label = train_aug$PCOS, missing = NA)

model <- xgb.train(
  data = dtrain,
  nrounds = 400,
  params = list(objective = "binary:logistic", eval_metric = "logloss",
                max_depth = 4, eta = 0.05, subsample = 0.9, colsample_bytree = 0.9)
)

manual_auc <- function(proba, actual_binary) {
  pos <- proba[actual_binary == 1]; neg <- proba[actual_binary == 0]
  n_pos <- length(pos); n_neg <- length(neg)
  ranks <- rank(c(pos, neg))
  (sum(ranks[seq_len(n_pos)]) - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)
}

evaluate <- function(data, label) {
  dm <- xgb.DMatrix(data = as.matrix(data[, ALL_FEATURES]), missing = NA)
  proba <- predict(model, dm)
  pred <- as.numeric(proba > 0.5)
  actual <- data$PCOS
  acc <- mean(pred == actual)
  auc <- manual_auc(proba, actual)
  tp <- sum(pred == 1 & actual == 1); fp <- sum(pred == 1 & actual == 0)
  fn <- sum(pred == 0 & actual == 1)
  precision <- tp / (tp + fp); recall <- tp / (tp + fn)
  f1 <- 2 * precision * recall / (precision + recall)
  cat(sprintf("%-45s Acc=%.4f  AUC=%.4f  Prec=%.4f  Rec=%.4f  F1=%.4f\n",
              label, acc, auc, precision, recall, f1))
  list(accuracy = acc, auc = auc, precision = precision, recall = recall, f1 = f1)
}

cat("\n=== Held-out test set, xgboost native NA routing ===\n")
results <- list()
results$full_16 <- evaluate(test, "All 16 present")

test_mand <- test; for (f in OPTIONAL) test_mand[[f]] <- NA
results$mandatory_only <- evaluate(test_mand, "Only 10 mandatory (6 optional NA)")

test_40 <- test
for (f in OPTIONAL) { drop <- runif(nrow(test_40)) < 0.4; test_40[[f]][drop] <- NA }
results$partial_40 <- evaluate(test_40, "~40% random missing among optional")

test_70 <- test
for (f in OPTIONAL) { drop <- runif(nrow(test_70)) < 0.7; test_70[[f]][drop] <- NA }
results$partial_70 <- evaluate(test_70, "~70% random missing among optional")

xgb.save(model, "pcos_missing_capable_xgb_R.model")
saveRDS(list(mandatory = MANDATORY, optional = OPTIONAL, all_features = ALL_FEATURES,
             results = results), "pcos_xgb_R_meta.rds")
write.csv(
  data.frame(Scenario = c("All 16 present", "Only 10 mandatory", "~40% optional missing", "~70% optional missing"),
             Accuracy = sapply(results, function(r) r$accuracy),
             AUC = sapply(results, function(r) r$auc),
             Precision = sapply(results, function(r) r$precision),
             Recall = sapply(results, function(r) r$recall),
             F1 = sapply(results, function(r) r$f1)),
  "pcos_xgb_R_validation_results.csv", row.names = FALSE
)
cat("\nSaved xgboost R model + metadata.\n")
