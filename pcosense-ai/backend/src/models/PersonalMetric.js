// src/models/PersonalMetric.js
import mongoose from 'mongoose';

const personalMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [10, 'Age must be at least 10'],
      max: [80, 'Age cannot exceed 80'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [300, 'Weight cannot exceed 300 kg'],
      comment: 'kg',
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height cannot exceed 250 cm'],
      comment: 'cm',
    },
    bmi: {
      type: Number,
      comment: 'Auto-calculated: weight(kg) / (height(m))^2',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      default: null,
    },
    // Optional blood report & body metrics
    fsh: { type: Number, default: null },
    lh: { type: Number, default: null },
    tsh: { type: Number, default: null },
    amh: { type: Number, default: null },
    prl: { type: Number, default: null },
    hb: { type: Number, default: null },
    rbs: { type: Number, default: null },
    vitD3: { type: Number, default: null },
    shbg: { type: Number, default: null },           // nmol/L
    fastingInsulin: { type: Number, default: null }, // µIU/mL
    insulinResistance: { type: Number, default: null }, // HOMA-IR
    prg: { type: Number, default: null },
    hip: { type: Number, default: null },
    waist: { type: Number, default: null },
  },
  { timestamps: true }
);

// Auto-calculate BMI before save
personalMetricSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    const heightInM = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInM * heightInM)).toFixed(2));
  }
  next();
});

const PersonalMetric = mongoose.model('PersonalMetric', personalMetricSchema);
export default PersonalMetric;
