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
      required: [true, 'Fast food selection is required'],
      enum: ['Yes', 'No'],
      default: 'No',
    },
    exerciseFreq: {
      type: String,
      required: [true, 'Exercise selection is required'],
      enum: ['Yes', 'No'],
      default: 'Yes',
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate',
    },
    sleepHours: {
      type: Number,
      min: [3, 'Sleep hours must be at least 3'],
      max: [12, 'Sleep hours cannot exceed 12'],
      default: 7,
    },
  },
  { timestamps: true }
);

const LifestyleHabit = mongoose.model('LifestyleHabit', lifestyleHabitSchema);
export default LifestyleHabit;
