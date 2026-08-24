// test_prediction.js
import { runPredictionPipeline } from "./backend/src/ai/predictionRouter.js";

const testAllFields = {
  personal: {
    age: 28, weight: 65, height: 160, bmi: 25.3, pulseRate: 72, respiratoryRate: 16, haemoglobin: 12.5,
    pregnant: "No", fsh: 5, lh: 6, tsh: 2.5, amh: 4.2, prl: 15, vitaminD3: 30, prg: 0.5, rbs: 90,
    hip: 38, waist: 32, waistHipRatio: 0.84, bpSystolic: 120, bpDiastolic: 80, familyHistoryPcos: "No", insulinResistance: "No"
  },
  menstrual: {
    cycleRegularity: "Irregular", periodDuration: 5, follicleNoLeft: 12, follicleNoRight: 14,
    avgFollicleSizeLeft: 8, avgFollicleSizeRight: 9, endometrium: 10
  },
  symptoms: {
    weightGain: "Yes", hairGrowth: "Yes", skinDarkening: "No", hairLoss: "No", pimples: "Yes", acneSeverity: "Mild"
  },
  lifestyle: {
    fastFoodFreq: "Yes", exerciseFreq: "No", sleepHours: 6, stressLevel: "Moderate"
  }
};

const testMissingAmh = JSON.parse(JSON.stringify(testAllFields));
delete testMissingAmh.personal.amh; // AMH missing

const testSymptomsOnly = JSON.parse(JSON.stringify(testAllFields));
// Symptoms only shouldn't need blood or ultrasound

const runTests = async () => {
  console.log("=== TEST 1: Mode symptoms_blood_usg (All Fields) ===");
  try {
    const res1 = await runPredictionPipeline(testAllFields, "symptoms_blood_usg");
    console.log("Result:", res1);
  } catch (err) { console.error("Test failed:", err); }
  
  console.log("\n=== TEST 2: Mode symptoms_blood (AMH Missing) ===");
  try {
    const res2 = await runPredictionPipeline(testMissingAmh, "symptoms_blood");
    console.log("Result:", res2);
  } catch (err) { console.error("Test failed:", err); }

  console.log("\n=== TEST 3: Mode symptoms_usg (All blood fields automatically stripped/nullified) ===");
  try {
    const res3 = await runPredictionPipeline(testAllFields, "symptoms_usg");
    console.log("Result:", res3);
  } catch (err) { console.error("Test failed:", err); }

  console.log("\n=== TEST 4: Mode symptoms_only (Only symptoms) ===");
  try {
    const res4 = await runPredictionPipeline(testSymptomsOnly, "symptoms_only");
    console.log("Result:", res4);
  } catch (err) { console.error("Test failed:", err); }
};

runTests();
