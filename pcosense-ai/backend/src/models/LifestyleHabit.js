// src/models/LifestyleHabit.js
import mongoose from 'mongoose';

const lifestyleHabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fastFoodFreq: {
      type: String,
      required: [true, 'Fast food frequency is required'],
      enum: ['Never', 'Rarely', '1-2 times/week', '3-4 times/week', 'Daily'],
    },
    exerciseFreq: {
      type: String,
      required: [true, 'Exercise frequency is required'],
      enum: ['Never', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'Daily'],
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Very High'],
      default: 'Moderate',
    },
    sleepHours: {
      type: Number,
      min: [3, 'Sleep hours must be at least 3'],
      max: [12, 'Sleep hours cannot exceed 12'],
      comment: 'hours per night',
    },
    smokingStatus: {
      type: String,
      enum: ['Never', 'Former', 'Current'],
      default: 'Never',
    },
    alcoholConsumption: {
      type: String,
      enum: ['Never', 'Occasional', 'Moderate', 'Heavy'],
      default: 'Never',
    },
  },
  { timestamps: true }
);

const LifestyleHabit = mongoose.model('LifestyleHabit', lifestyleHabitSchema);
export default LifestyleHabit;
