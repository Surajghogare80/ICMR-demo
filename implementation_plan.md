# PRABHA Prediction System Refactor

Refactor the AI prediction architecture to use the new 4-tier model strategy (`All_4_RF_Models.rds`). The new pipeline will route users strictly to the diagnostic model that matches their submitted data, with exact dataset column names and factor levels.

## Open Questions

None currently. The exact feature names, factor levels, and predictors have been successfully extracted from `All_4_RF_Models.rds`.

## Proposed Changes

We will restructure the backend to move mapping and validation out of `predict.R` and into a centralized Node.js registry for better testability and type-safety. The R script will act simply as a strict evaluation engine.

### Backend Routing and Validation

#### [NEW] `backend/src/ai/modelRegistry.js`
A centralized registry containing the configurations for all 4 models:
- Model 1: Symptoms Only (Dataset 1 - 16 features)
- Model 2: Symptoms + Blood (Dataset 2 - 33 features)
- Model 3: Symptoms + Ultrasound (Dataset 3 - 22 features)
- Model 4: Combined (Dataset 4 - 40 features)
Defines the `predictionMode` to `model_name` mapping and the exact expected predictor column names.

#### [NEW] `backend/src/ai/featureMapping.js`
A pure function that transforms the raw frontend JSON input into the exact R dataframe structure:
- Maps `Age` -> `Age (yrs)`
- Handles categorical encoding explicitly:
  - Yes/No -> `1` / `0`
  - Cycle Regularity: Regular -> `2`, Irregular -> `4`, Absent -> `5`
  - Blood Group: A+ -> `11`, etc.
- Explicitly keeps `FSH/LH` and `LH:FSH` separate.

#### [NEW] `backend/src/ai/predictionRouter.js`
Determines which model to use based on the user's data (e.g. `hasBloodTest`, `hasUltrasound`). Validates the mapped features against the `modelRegistry` before spawning the R process.

#### [MODIFY] `backend/src/services/predictionService.js`
Integrate the new `predictionRouter` instead of the old monolithic `predict.R` call.

### R Script Simplification

#### [MODIFY] `backend/ai/predict.R`
Refactor this script to be a "dumb" executor:
- Accept two arguments: `model_name` and `features_json`.
- Load `All_4_RF_Models.rds`.
- Extract the specified model.
- Parse `features_json`. Ensure factors are correctly cast with the exact levels.
- Run `predict()` and return probabilities.
- Remove all the business logic, if/else mapping, and fallback logic (handled by Node now).

### Frontend Updates

#### [MODIFY] `frontend/src/pages/Prediction/PredictionWizard.jsx`
Update the payload to pass explicit flags `hasBloodTest` and `hasUltrasound` to make routing deterministic.

## Verification Plan

### Automated Tests
I will add tests to verify the routing logic:
- A user submitting symptoms only gets routed to `RF_Model_1_Dataset_1`.
- A user submitting blood test data is evaluated using exactly 33 predictors.
- The `PCOS (Y/N)` target column is never included in the input payload.

### Manual Verification
- Test all 4 permutations using the frontend UI and ensure the backend logs show the correct model being invoked.
