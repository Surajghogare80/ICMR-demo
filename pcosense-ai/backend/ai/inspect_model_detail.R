# inspect_model_detail.R
# Deep inspection of factor levels and per-feature NA tolerance

suppressPackageStartupMessages({
  library(randomForest)
  library(jsonlite)
})

obj <- readRDS("E:/Suraj ICMR/ICMR-demo/pcosense-ai/backend/ai/rf_model_new.rds")

# ─── Dataset1_RF — check every predictor's type and level ──────────────────
cat("=== Dataset1_RF — Full Predictor Detail ===\n")
m1 <- obj$Dataset1_RF
pnames <- names(m1$forest$ncat)
xlevels <- m1$forest$xlevels
ncat <- m1$forest$ncat

for (p in pnames) {
  lv <- xlevels[[p]]
  nc <- ncat[p]
  if (!is.null(lv) && length(lv) > 1) {
    cat(sprintf("  [FACTOR]  %s  levels: %s\n", p, paste(lv, collapse=" | ")))
  } else {
    cat(sprintf("  [NUMERIC] %s  ncat=%d\n", p, nc))
  }
}

cat("\nTarget classes:", paste(m1$classes, collapse=", "), "\n")

# ─── Per-feature NA test for Dataset1_RF ───────────────────────────────────
cat("\n=== Dataset1_RF — Per-feature NA tolerance ===\n")
base_row <- list()
for (p in pnames) {
  lv <- xlevels[[p]]
  nc <- ncat[p]
  if (!is.null(lv) && length(lv) > 1) {
    base_row[[p]] <- factor(lv[1], levels=lv)
  } else {
    base_row[[p]] <- 1.0
  }
}
base_df <- as.data.frame(base_row, stringsAsFactors=FALSE)

for (p in pnames) {
  test_df <- base_df
  lv <- xlevels[[p]]
  nc <- ncat[p]
  if (!is.null(lv) && length(lv) > 1) {
    test_df[[p]] <- factor(NA, levels=lv)
  } else {
    test_df[[p]] <- NA_real_
  }
  result <- tryCatch({
    predict(m1, newdata=test_df, type="prob")
    "OK (accepts NA)"
  }, error=function(e) paste("ERROR:", e$message))
  cat(sprintf("  %s: %s\n", p, result))
}

# ─── Dataset3_RF — what happens when only factor features are NA ───────────
cat("\n=== Dataset3_RF — Per-feature NA tolerance ===\n")
m3 <- obj$Dataset3_RF
p3 <- names(m3$forest$ncat)
xlevels3 <- m3$forest$xlevels

base_row3 <- list()
for (p in p3) {
  lv <- xlevels3[[p]]
  if (!is.null(lv) && length(lv) > 1) {
    base_row3[[p]] <- factor(lv[1], levels=lv)
  } else {
    base_row3[[p]] <- 1.0
  }
}
base_df3 <- as.data.frame(base_row3, stringsAsFactors=FALSE)

for (p in p3) {
  test_df3 <- base_df3
  lv <- xlevels3[[p]]
  if (!is.null(lv) && length(lv) > 1) {
    test_df3[[p]] <- factor(NA, levels=lv)
  } else {
    test_df3[[p]] <- NA_real_
  }
  result <- tryCatch({
    predict(m3, newdata=test_df3, type="prob")
    "OK (accepts NA)"
  }, error=function(e) paste("ERROR:", e$message))
  cat(sprintf("  %s: %s\n", p, result))
}

# ─── Dataset2_RF — per feature NA ──────────────────────────────────────────
cat("\n=== Dataset2_RF — Per-feature NA tolerance ===\n")
m2 <- obj$Dataset2_RF
p2 <- names(m2$forest$ncat)
xlevels2 <- m2$forest$xlevels
ncat2 <- m2$forest$ncat

base_row2 <- list()
for (p in p2) {
  lv <- xlevels2[[p]]
  if (!is.null(lv) && length(lv) > 1) {
    base_row2[[p]] <- factor(lv[1], levels=lv)
  } else {
    base_row2[[p]] <- 1.0
  }
}
base_df2 <- as.data.frame(base_row2, stringsAsFactors=FALSE)

for (p in p2) {
  test_df2 <- base_df2
  lv <- xlevels2[[p]]
  if (!is.null(lv) && length(lv) > 1) {
    test_df2[[p]] <- factor(NA, levels=lv)
  } else {
    test_df2[[p]] <- NA_real_
  }
  result <- tryCatch({
    predict(m2, newdata=test_df2, type="prob")
    "OK (accepts NA)"
  }, error=function(e) paste("ERROR:", e$message))
  cat(sprintf("  %s: %s\n", p, result))
}

cat("\n=== DONE ===\n")
