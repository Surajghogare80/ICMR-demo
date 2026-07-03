// src/models/ClinicalSymptom.js
import mongoose from 'mongoose';

const clinicalSymptomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weightGain: {
      type: Boolean,
      required: true,
      comment: 'Unexplained weight gain',
    },
    hairGrowth: {
      type: Boolean,
      required: true,
      comment: 'Excessive facial/body hair (hirsutism)',
    },
    skinDarkening: {
      type: Boolean,
      required: true,
      comment: 'Darkening of skin (acanthosis nigricans)',
    },
    pimples: {
      type: Boolean,
      required: true,
      comment: 'Acne / pimples',
    },
    hairLoss: {
      type: Boolean,
      required: true,
      comment: 'Hair thinning or loss on scalp',
    },
    moodSwings: {
      type: Boolean,
      default: false,
    },
    fatigue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ClinicalSymptom = mongoose.model('ClinicalSymptom', clinicalSymptomSchema);
export default ClinicalSymptom;
