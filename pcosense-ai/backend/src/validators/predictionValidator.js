// src/validators/predictionValidator.js
import { body } from 'express-validator';

const optPositive = (field, section = 'personal') =>
  body(`${section}.${field}`)
    .optional({ nullable: true, checkFalsy: false })
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a non-negative number`);

export const predictionValidator = [
  // ── Personal / core ──────────────────────────────────────────────────────
  body('personal.age')
    .exists().withMessage('Age is required')
    .isFloat({ min: 10, max: 70 }).withMessage('Age must be between 10 and 70'),

  body('personal.weight')
    .exists().withMessage('Weight is required')
    .isFloat({ min: 20, max: 200 }).withMessage('Weight must be between 20 and 200 kg'),

  body('personal.height')
    .exists().withMessage('Height is required')
    .isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),

  body('personal.bmi')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('BMI must be a non-negative number'),

  body('personal.bloodGroup')
    .optional({ nullable: true })
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood group'),

  // ── Standard blood markers (Page 1) ──────────────────────────────────────
  optPositive('fsh'),
  optPositive('lh'),
  optPositive('tsh'),
  optPositive('amh'),
  optPositive('hb'),
  optPositive('prl'),

  // ── Extended blood markers (Page 2 — used by RF model) ───────────────────
  optPositive('vitaminD3'), // ng/mL
  optPositive('shbg'),      // nmol/L
  optPositive('fastingInsulin'),   // µIU/mL
  optPositive('insulinResistance'), // HOMA-IR

  // ── Menstrual ─────────────────────────────────────────────────────────────
  body('menstrual.cycleLength')
    .exists().withMessage('Cycle length is required')
    .isFloat({ min: 15, max: 90 }).withMessage('Cycle length must be 15–90 days'),

  body('menstrual.periodDuration')
    .optional({ nullable: true })
    .isFloat({ min: 1, max: 15 }).withMessage('Period duration must be 1–15 days'),

  body('menstrual.cycleRegularity')
    .optional()
    .isIn(['Regular', 'Irregular', 'Absent']).withMessage('Invalid cycle regularity'),

  body('menstrual.flowIntensity')
    .optional()
    .isIn(['Light', 'Normal', 'Heavy']).withMessage('Invalid flow intensity'),

  // ── Ultrasound (optional) ─────────────────────────────────────────────────
  optPositive('follicleNo', 'menstrual'),
  optPositive('avgFsize', 'menstrual'),
  optPositive('ovaryVolume', 'menstrual'),
  optPositive('endometrium', 'menstrual'),

  // ── Symptoms ──────────────────────────────────────────────────────────────
  body('symptoms.weightGain').optional().isBoolean(),
  body('symptoms.hairGrowth').optional().isBoolean(),
  body('symptoms.skinDarkening').optional().isBoolean(),
  body('symptoms.pimples').optional().isBoolean(),
  body('symptoms.hairLoss').optional().isBoolean(),

  // ── Lifestyle ─────────────────────────────────────────────────────────────
  body('lifestyle.fastFoodFreq').optional().isString(),
  body('lifestyle.exerciseFreq').optional().isString(),
  body('lifestyle.stressLevel').optional().isString(),
  body('lifestyle.sleepHours')
    .optional({ nullable: true })
    .isFloat({ min: 3, max: 12 }).withMessage('Sleep hours must be 3–12'),
];
