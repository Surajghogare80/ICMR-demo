# backend/ai/predict_symptoms_blood_usg_missing_capable.R
# PRABHA "Symptoms + Blood + Ultrasound" (Mode 4 — the last screening option)
# MISSING-VALUE-CAPABLE ENGINE  — 3-model fallback cascade
#
# Runs for Mode 4 (predictionMode "symptoms_blood_usg") whenever the user left
# one or more inputs blank. It never opens rf_model_new.rds.
#
# The cascade picks the richest model the SUPPLIED (non-blank) data can feed:
#
#   1. DS1_Karnika_Clinical.rds   — needs all 10 DS1 mandatory fields (both
#                                   follicle counts, Age, Waist, and 6 symptom
#                                   /cycle fields). $full variant if every one of
#                                   its 35 clinical fields is present, else its
#                                   $mandatory variant.
#   2. DS2_LucasSouza_Synthetic.rds — used when the DS1 mandatory set is NOT all
#                                   present but menstrual regularity AND
#                                   Testosterone (ng/dL) are. $full variant if
#                                   Age and BMI are present too, else $mandatory.
#   3. DS3_72Countries_Filtered.rds — used when neither of the above qualifies
#                                   but Age AND BMI are present. $mandatory
#                                   variant only (Age, BMI band, Acne Severity);
#                                   Acne Severity is approximated from the
#                                   yes/no "pimples" symptom (Moderate / None).
#   4. none of the above           — hard "missing information" alert (HTTP 400).
#
# Each *.rds bundle is a gradient-boosted tree ensemble (XGBoost, binary
# logistic) serialised as a plain R list so it can be scored with no xgboost
# dependency.  list(features, base_score, trees, type[, one-hot metadata]).
# Internal node: list(nodeid, depth, split, split_condition, yes, no, missing,
# children); leaf: list(nodeid, leaf).  Routing at a node:
#   value <  split_condition -> child $yes
#   value >= split_condition -> child $no
#   value is NA              -> child $missing
# margin = qlogis(base_score) + sum(leaf values over all trees); p = plogis(margin).
#
# DS3 is type = "mixed_onehot": its trees split on positional keys "f0".."f8"
# that index $output_feature_names (num__Age + the BMI and Acne one-hot columns).

suppressPackageStartupMessages({
  if (!requireNamespace("jsonlite", quietly = TRUE)) {
    install.packages("jsonlite", repos = "https://cloud.r-project.org")
  }
  library(jsonlite)
})

# ─── 1. Read input JSON path from args ────────────────────────────────────────
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  cat(toJSON(list(error = "No input file path provided."), auto_unbox = TRUE)); quit(status = 1)
}
input_path <- args[1]
if (!file.exists(input_path)) {
  cat(toJSON(list(error = paste("Input file not found:", input_path)), auto_unbox = TRUE)); quit(status = 1)
}

payload <- tryCatch(fromJSON(input_path, simplifyVector = FALSE), error = function(e) {
  cat(toJSON(list(error = paste("Failed to parse JSON:", e$message)), auto_unbox = TRUE)); quit(status = 1)
})
features_list <- payload$features
if (is.null(features_list)) {
  cat(toJSON(list(error = "Payload must contain features."), auto_unbox = TRUE)); quit(status = 1)
}

# ─── 2. Locate the three model bundles ──────────────────────────────────────
find_file <- function(name) {
  for (cand in c(name, file.path("ai", name), file.path(dirname(input_path), name))) {
    if (file.exists(cand)) return(cand)
  }
  NULL
}
read_bundle <- function(name) {
  p <- find_file(name)
  if (is.null(p)) {
    cat(toJSON(list(error = paste(name, "not found.")), auto_unbox = TRUE)); quit(status = 1)
  }
  tryCatch(readRDS(p), error = function(e) {
    cat(toJSON(list(error = paste("Failed to read", name, "-", e$message)), auto_unbox = TRUE)); quit(status = 1)
  })
}
DS1 <- read_bundle("DS1_Karnika_Clinical.rds")
DS2 <- read_bundle("DS2_LucasSouza_Synthetic.rds")
DS3 <- read_bundle("DS3_72Countries_Filtered.rds")

# ─── 3. Raw value access (keys are featureMapping.js mode-4 dotted keys) ─────
is_missing <- function(v) is.null(v) || length(v) == 0 || (length(v) == 1 && is.na(v))
num <- function(key) {
  v <- features_list[[key]]
  if (is_missing(v)) return(NA_real_)
  suppressWarnings(as.numeric(v))
}

# ─── 4. Scorers ────────────────────────────────────────────────────────────
child_by_id <- function(node, id) {
  for (c in node$children) if (isTRUE(c$nodeid == id)) return(c)
  NULL
}
# numeric ensemble (DS1, DS2): getval(feature_name) -> number or NA
score_numeric <- function(model, getval) {
  one <- function(node) {
    while (!is.null(node$children)) {
      x   <- getval(node$split)
      nxt <- if (is.na(x)) node$missing else if (x < node$split_condition) node$yes else node$no
      ch  <- child_by_id(node, nxt)
      if (is.null(ch)) return(0)
      node <- ch
    }
    as.numeric(node$leaf)
  }
  plogis(qlogis(model$base_score) + sum(vapply(model$trees, one, numeric(1))))
}
# one-hot ensemble (DS3): vec indexed 1..length($output_feature_names); trees
# split on "f<idx0>" (0-based) into that vector.
score_onehot <- function(model, vec) {
  one <- function(node) {
    while (!is.null(node$children)) {
      idx <- as.integer(sub("^f", "", node$split)) + 1L
      x   <- vec[idx]
      nxt <- if (is.na(x)) node$missing else if (x < node$split_condition) node$yes else node$no
      ch  <- child_by_id(node, nxt)
      if (is.null(ch)) return(0)
      node <- ch
    }
    as.numeric(node$leaf)
  }
  plogis(qlogis(model$base_score) + sum(vapply(model$trees, one, numeric(1))))
}

# ─── 5a. DS1 bridge (35 clinical fields; some model names carry stray spaces) ─
DS1_NAME2KEY <- c(
  "Follicle No. (R)"     = "Follicle.No...R.",   "Follicle No. (L)"     = "Follicle.No...L.",
  "Weight gain(Y/N)"     = "Weight.gain.Y.N.",   "Skin darkening (Y/N)" = "Skin.darkening..Y.N.",
  "hair growth(Y/N)"     = "hair.growth.Y.N.",   "Cycle(R/I)"           = "Cycle.R.I.",
  "Cycle length(days)"   = "Cycle.length.days.", "Pimples(Y/N)"         = "Pimples.Y.N.",
  "Age (yrs)"            = "Age..yrs.",          "Waist(inch)"          = "Waist.inch.",
  "Avg. F size (R) (mm)" = "Avg..F.size..R...mm.", "Hip(inch)"          = "Hip.inch.",
  "FSH(mIU/mL)"          = "FSH.mIU.mL.",        "Weight (Kg)"          = "Weight..Kg.",
  "TSH (mIU/L)"          = "TSH..mIU.L.",        "Avg. F size (L) (mm)" = "Avg..F.size..L...mm.",
  "Hb(g/dl)"             = "Hb.g.dl.",           "BMI"                  = "BMI",
  "Hair loss(Y/N)"       = "Hair.loss.Y.N.",     "PRL(ng/mL)"           = "PRL.ng.mL.",
  "RBS(mg/dl)"           = "RBS.mg.dl.",         "AMH(ng/mL)"           = "AMH.ng.mL.",
  "FSH/LH"               = "FSH.LH",             "LH(mIU/mL)"           = "LH.mIU.mL.",
  "Vit D3 (ng/mL)"       = "Vit.D3..ng.mL.",     "Waist:Hip Ratio"      = "Waist.Hip.Ratio",
  "PRG(ng/mL)"           = "PRG.ng.mL.",         "Reg.Exercise(Y/N)"    = "Reg.Exercise.Y.N.",
  "Endometrium (mm)"     = "Endometrium..mm.",   "Height(Cm)"           = "Height.Cm.",
  "BP _Diastolic (mmHg)" = "BP._Diastolic..mmHg.", "RR (breaths/min)"   = "RR..breaths.min.",
  "Pulse rate(bpm)"      = "Pulse.rate.bpm.",    "BP _Systolic (mmHg)"  = "BP._Systolic..mmHg.",
  "Pregnant(Y/N)"        = "Pregnant.Y.N."
)
DS1_MANDATORY <- c(
  "Follicle No. (R)", "Follicle No. (L)", "Weight gain(Y/N)", "Skin darkening (Y/N)",
  "hair growth(Y/N)", "Cycle(R/I)", "Cycle length(days)", "Pimples(Y/N)",
  "Age (yrs)", "Waist(inch)"
)
ds1_get <- function(name) num(unname(DS1_NAME2KEY[trimws(name)]))

# ─── 5b. DS2 bridge ─────────────────────────────────────────────────────────
# menstrual_regularity is binary in the model (only ever split at 1.0):
# 0 = regular, 1 = irregular/absent.  Cycle.R.I. is 2=Regular, 4=Irregular, 5=Absent.
ds2_menstrual <- function() { c <- num("Cycle.R.I."); if (is.na(c)) NA_real_ else if (c == 2) 0 else 1 }
ds2_get <- function(name) switch(name,
  "menstrual_regularity"      = ds2_menstrual(),
  "Testosterone_Level(ng/dL)" = num("Testosterone"),
  "age"                       = num("Age..yrs."),
  "BMI"                       = num("BMI"),
  NA_real_
)

# ─── 5c. DS3 one-hot vector (mandatory variant: Age + BMI band + Acne band) ──
bmi_band <- function(b) {
  if (is.na(b)) return(NA_character_)
  if (b < 18.5) "Underweight" else if (b < 25) "Normal" else if (b < 30) "Overweight" else "Obese"
}
acne_band <- function() {           # approximated from the yes/no "pimples" symptom
  p <- num("Pimples.Y.N.")
  if (is.na(p)) NA_character_ else if (p >= 1) "Moderate" else "None"
}
ds3_mandatory_vec <- function() {
  ofn  <- unlist(DS3$mandatory$output_feature_names)   # 9 names, fixed order
  age  <- num("Age..yrs.")
  band <- bmi_band(num("BMI"))
  acne <- acne_band()
  vapply(ofn, function(col) {
    if (col == "num__Age") return(age)
    if (startsWith(col, "cat__BMI_")) {
      if (is.na(band)) return(NA_real_)
      return(as.numeric(sub("cat__BMI_", "", col) == band))
    }
    if (startsWith(col, "cat__Acne Severity_")) {
      if (is.na(acne)) return(NA_real_)
      return(as.numeric(sub("cat__Acne Severity_", "", col) == acne))
    }
    NA_real_
  }, numeric(1))
}

# ─── 6. Cascade selection ──────────────────────────────────────────────────
ds1_missing_mand <- DS1_MANDATORY[vapply(DS1_MANDATORY, function(n) is.na(ds1_get(n)), logical(1))]
ds1_missing_all  <- names(DS1_NAME2KEY)[vapply(names(DS1_NAME2KEY), function(n) is.na(ds1_get(n)), logical(1))]

pick <- NULL
if (length(ds1_missing_mand) == 0) {
  variant <- if (length(ds1_missing_all) == 0) "full" else "mandatory"
  pick <- list(model = DS1[[variant]], scorer = "numeric", getval = ds1_get,
               modelUsed = "DS1_Karnika_Clinical_missing_capable",
               modelSource = "DS1_Karnika_Clinical.rds", variant = variant)
} else if (!is.na(ds2_get("menstrual_regularity")) && !is.na(ds2_get("Testosterone_Level(ng/dL)"))) {
  variant <- if (!is.na(num("Age..yrs.")) && !is.na(num("BMI"))) "full" else "mandatory"
  pick <- list(model = DS2[[variant]], scorer = "numeric", getval = ds2_get,
               modelUsed = "DS2_LucasSouza_Synthetic_missing_capable",
               modelSource = "DS2_LucasSouza_Synthetic.rds", variant = variant)
} else if (!is.na(num("Age..yrs.")) && !is.na(num("BMI"))) {
  pick <- list(model = DS3$mandatory, scorer = "onehot", vec = ds3_mandatory_vec(),
               modelUsed = "DS3_72Countries_Filtered_mandatory",
               modelSource = "DS3_72Countries_Filtered.rds", variant = "mandatory")
}

# ─── 7. Predict / report ───────────────────────────────────────────────────
result_out <- tryCatch({
  if (is.null(pick)) {
    list(
      error = paste("The trained model requires the following missing information to make a safe prediction:",
                    paste(unname(DS1_NAME2KEY[ds1_missing_mand]), collapse = ", ")),
      type = "MISSING_FEATURES",
      missingFields = unname(DS1_NAME2KEY[ds1_missing_mand])
    )
  } else {
    prob_pcos <- if (pick$scorer == "onehot") score_onehot(pick$model, pick$vec)
                 else score_numeric(pick$model, pick$getval)

    prob_val       <- round(prob_pcos * 100, 1)
    confidence_val <- round(max(prob_pcos, 1 - prob_pcos) * 100, 1)
    ui_result      <- ifelse(prob_pcos >= 0.5, "High Risk", "Low Risk")

    recommendations <- if (ui_result == "High Risk") {
      c(
        "Consult a gynecologist or endocrinologist immediately.",
        "Review your hormonal panel and ovarian ultrasound with a specialist.",
        "Complete any measurements left blank in this screening for a more precise assessment.",
        "Follow a low-glycemic index diet to manage insulin resistance.",
        "Start a regular exercise program (30 min/day, 5 days/week)."
      )
    } else {
      c(
        "Maintain your current healthy lifestyle — great work!",
        "Continue exercising regularly (150 min/week of moderate activity).",
        "Keep a balanced, nutritious diet rich in vegetables and whole grains.",
        "Consider completing the measurements left blank for a more precise screening."
      )
    }

    list(
      result         = ui_result,
      probability    = prob_val,
      confidence     = confidence_val,
      recommendation = recommendations,
      engineType     = "ds_tree_missing_capable_cascade",
      modelUsed      = pick$modelUsed,
      modelSource    = pick$modelSource,
      variantUsed    = pick$variant
    )
  }
}, error = function(e) {
  list(error = paste("Prediction failed:", e$message))
})

cat(toJSON(result_out, auto_unbox = TRUE))
