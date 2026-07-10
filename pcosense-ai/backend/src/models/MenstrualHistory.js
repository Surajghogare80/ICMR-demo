// src/models/MenstrualHistory.js
import mongoose from 'mongoose';

const menstrualHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cycleLength: {
      type: Number,
      required: [true, 'Cycle length is required'],
      min: [15, 'Cycle length must be at least 15 days'],
      max: [90, 'Cycle length cannot exceed 90 days'],
      comment: 'days between periods',
    },
    cycleRegularity: {
      type: String,
      required: [true, 'Cycle regularity is required'],
      enum: ['Regular', 'Irregular', 'Absent'],
    },
    periodDuration: {
      type: Number,
      min: [1, 'Period duration must be at least 1 day'],
      max: [15, 'Period duration cannot exceed 15 days'],
      comment: 'days per period',
    },
    flowIntensity: {
      type: String,
      enum: ['Light', 'Normal', 'Heavy', 'Very Heavy'],
      default: 'Normal',
    },
    lastPeriodDate: {
      type: Date,
      default: null,
    },
    // Family History of PCOS
    familyHistory: {
      type: Boolean,
      default: false,
      comment: 'Has PCOS been diagnosed in mother, aunt, siblings, cousins, or grandmother',
    },
    // Optional Ultrasound Scan parameters
    follicleNoL: { type: Number, default: null },
    follicleNoR: { type: Number, default: null },
    avgFsizeL: { type: Number, default: null },
    avgFsizeR: { type: Number, default: null },
    ovaryVolume: { type: Number, default: null },
    endometrium: { type: Number, default: null },
  },
  { timestamps: true }
);

const MenstrualHistory = mongoose.model('MenstrualHistory', menstrualHistorySchema);
export default MenstrualHistory;
