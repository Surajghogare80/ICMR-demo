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
    // Optional Ultrasound Scan parameters — exact dataset field names used by the RF model
    follicleNoLeft:       { type: Number, default: null, comment: 'Follicle No. (L) — number of follicles in the left ovary' },
    follicleNoRight:      { type: Number, default: null, comment: 'Follicle No. (R) — number of follicles in the right ovary' },
    avgFollicleSizeLeft:  { type: Number, default: null, comment: 'Avg. F size (L) (mm) — average follicle size in the left ovary' },
    avgFollicleSizeRight: { type: Number, default: null, comment: 'Avg. F size (R) (mm) — average follicle size in the right ovary' },
    endometrium:          { type: Number, default: null, comment: 'Endometrium (mm) — thickness of the endometrium' },
  },
  { timestamps: true }
);

const MenstrualHistory = mongoose.model('MenstrualHistory', menstrualHistorySchema);
export default MenstrualHistory;
