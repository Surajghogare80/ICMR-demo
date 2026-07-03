// src/models/Prediction.js
import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalMetricId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PersonalMetric',
      required: true,
    },
    menstrualHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenstrualHistory',
      required: true,
    },
    clinicalSymptomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClinicalSymptom',
      required: true,
    },
    lifestyleHabitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LifestyleHabit',
      required: true,
    },
    // Prediction result from AI/dummy service
    result: {
      type: String,
      required: true,
      enum: ['Low Risk', 'High Risk', 'Positive', 'Negative'],
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      comment: 'Percentage probability (0-100)',
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      comment: 'Model confidence score (0-100)',
    },
    recommendation: {
      type: [String],
      default: [],
    },
    aiModelVersion: {
      type: String,
      default: 'dummy-v1.0',
      comment: 'Version of AI model used (dummy until real model integrated)',
    },
    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Risk level label
predictionSchema.virtual('riskLabel').get(function () {
  if (this.probability >= 70) return 'High Risk';
  if (this.probability >= 40) return 'Moderate Risk';
  return 'Low Risk';
});

// Index for efficient queries
predictionSchema.index({ userId: 1, createdAt: -1 });

const Prediction = mongoose.model('Prediction', predictionSchema);
export default Prediction;
