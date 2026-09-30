# PCOS Dataset 1 (R Version) — Used vs. Masked Features, SHAP Ranking, and the Missing-Value-Capable Model

This is the **R** counterpart to the Python/XGBoost missing-value-capable model delivered
earlier — same dataset, same mandatory/optional feature contract.

**Update:** R's `xgboost` package isn't available on CRAN through this sandbox's network
(no route to a CRAN mirror — only Ubuntu apt packages and GitHub are reachable), and apt
doesn't ship an R build of it either. Rather than settle for the weaker randomForest +
imputation fallback, I built `xgboost` for R from source: pulled the package sources plus
its `dmlc-core` dependency directly from GitHub, compiled the full C++ core with `R CMD
INSTALL` (~5 minutes), and confirmed it loads and trains correctly. **This model is real
R xgboost, trained the same way as the Python version** — not a workaround.

Both versions are included below since they demonstrate a genuinely different point about
missing-value handling in R.

## 1. Source data

Dataset 1 (D1_Physical): 2,000 rows, 16 raw physical-exam features, target `PCOS`,
positive rate 30.4%, no missing values in the raw data.

## 2. Used (mandatory) vs. masked (optional) features

Same top-10 / bottom-6 split as the Python version, based on the XGBoost SHAP ranking from
the earlier reduced-model analysis:

| Status | Feature (R column name) |
|---|---|
| ✅ Used — mandatory | Skin_darkening |
| ✅ Used — mandatory | hair_growth |
| ✅ Used — mandatory | Weight_gain |
| ✅ Used — mandatory | Fast_food |
| ✅ Used — mandatory | Age |
| ✅ Used — mandatory | Waist |
| ✅ Used — mandatory | Pimples |
| ✅ Used — mandatory | Cycle_RI |
| ✅ Used — mandatory | Cycle_length |
| ✅ Used — mandatory | Hip |
| ⬜ Masked — optional | Weight_Kg |
| ⬜ Masked — optional | Waist_Hip_Ratio |
| ⬜ Masked — optional | Height_Cm |
| ⬜ Masked — optional | Reg_Exercise |
| ⬜ Masked — optional | BMI |
| ⬜ Masked — optional | Hair_loss |

## 3. Two R implementations, and why they differ

| | `pcos_missing_capable_xgboost.R` (primary) | `pcos_missing_capable_model.R` (fallback) |
|---|---|---|
| Package | `xgboost` (built from source) | `randomForest` (apt) |
| Missing-value mechanism | Native per-node NA routing, learned via missingness-augmented training — identical design to the Python model | Median/mode imputation computed from the training set |
| Accuracy, mandatory-only | **94.75%** / AUC 0.990 | 90.50% / AUC 0.947 |
| Recall, mandatory-only | **86.07%** | 75.41% |

The xgboost version is the one that actually matches the Python model's design and should
be preferred. The randomForest version is kept as a working fallback in case a future
environment can't compile xgboost from source (no compiler, no network to GitHub, etc.).

## 4. Validation results — R xgboost (primary model)

| Scenario | Accuracy | AUC | Precision | Recall | F1 |
|---|---|---|---|---|---|
| All 16 features present | 97.50% | 0.997 | 0.975 | 0.943 | 0.958 |
| Only 10 mandatory present (6 optional NA) | 94.75% | 0.990 | 0.963 | 0.861 | 0.909 |
| 10 mandatory + ~40% of optional fields missing | 97.50% | 0.995 | 0.983 | 0.934 | 0.958 |
| 10 mandatory + ~70% of optional fields missing | 96.50% | 0.991 | 0.974 | 0.910 | 0.941 |

Comparable to the Python model's 96.25%/0.993 AUC at the same mandatory-only point — the
small remaining gap is a reasonable training-run difference (different random split,
different augmentation draws), not a mechanism difference; both use the identical
"train on missingness-augmented data, let XGBoost's own NA routing do the work" design.

## 5. Validation results — R randomForest (fallback, imputation-based)

| Scenario | Accuracy | AUC | Precision | Recall | F1 |
|---|---|---|---|---|---|
| All 16 features present | 97.75% | 0.998 | 0.967 | 0.959 | 0.963 |
| Only 10 mandatory present (6 optional imputed) | 90.50% | 0.947 | 0.920 | 0.754 | 0.829 |
| 10 mandatory + ~40% of optional fields imputed | 95.00% | 0.987 | 0.955 | 0.877 | 0.915 |

This degrades more under heavy missingness because a static median/mode guess can't adapt
to the rest of that specific patient's values, unlike learned NA-routing.

## 6. Enforcement of "mandatory"

Both R models use the same pattern: an R Reference Class with a `predict_patient()` method
that checks every mandatory field is present before calling the model, raising a descriptive
error naming the missing field(s) if not. Missing optional fields are either passed as `NA`
(xgboost version) or filled with the stored median/mode (randomForest version).

## 7. Files delivered

| File | Purpose |
|---|---|
| `pcos_missing_capable_xgboost.R` | **Primary.** Training script for the R xgboost model (native NA routing) |
| `pcos_missing_capable_xgb_R.model` | The trained xgboost model (UBJSON format, `xgb.load()`) |
| `pcos_xgb_R_meta.rds` | Feature lists + validation results for the xgboost model |
| `pcos_predictor_xgb.R` | `PCOSPredictorXGB` wrapper: enforces mandatory fields, loads the model, runs 3 test cases |
| `pcos_xgb_R_validation_results.csv` | Metrics behind the table in §4 |
| `pcos_missing_capable_model.R` | Fallback training script for the R randomForest + imputation model |
| `pcos_missing_capable_rf_model.rds` / `pcos_missing_capable_router.rds` | Fallback model + router |
| `predict_example.R` | Example script for the randomForest fallback router |
| `pcos_r_validation_results.csv` | Metrics behind the table in §5 |
| `D1_physical.csv` | Training data (R-friendly column names) |

