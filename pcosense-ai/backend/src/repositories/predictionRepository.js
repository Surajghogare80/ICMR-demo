// src/repositories/predictionRepository.js
import Prediction from '../models/Prediction.js';
import PersonalMetric from '../models/PersonalMetric.js';
import MenstrualHistory from '../models/MenstrualHistory.js';
import ClinicalSymptom from '../models/ClinicalSymptom.js';
import LifestyleHabit from '../models/LifestyleHabit.js';

const mockPersonalMetrics = [];
const mockMenstrualHistories = [];
const mockClinicalSymptoms = [];
const mockLifestyleHabits = [];
const mockPredictions = [];

export const predictionRepository = {
  async createPersonalMetric(data) {
    if (global.dbMode === 'mock') {
      const metric = {
        _id: 'mock_metric_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockPersonalMetrics.push(metric);
      return metric;
    }
    return PersonalMetric.create(data);
  },

  async createMenstrualHistory(data) {
    if (global.dbMode === 'mock') {
      const history = {
        _id: 'mock_menstrual_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockMenstrualHistories.push(history);
      return history;
    }
    return MenstrualHistory.create(data);
  },

  async createClinicalSymptom(data) {
    if (global.dbMode === 'mock') {
      const symptom = {
        _id: 'mock_symptom_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockClinicalSymptoms.push(symptom);
      return symptom;
    }
    return ClinicalSymptom.create(data);
  },

  async createLifestyleHabit(data) {
    if (global.dbMode === 'mock') {
      const habit = {
        _id: 'mock_lifestyle_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockLifestyleHabits.push(habit);
      return habit;
    }
    return LifestyleHabit.create(data);
  },

  async createPrediction(data) {
    if (global.dbMode === 'mock') {
      const prediction = {
        _id: 'mock_prediction_' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        ...data,
      };
      mockPredictions.push(prediction);
      return prediction;
    }
    return Prediction.create(data);
  },

  async findByUserId(userId, options = {}) {
    if (global.dbMode === 'mock') {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;
      
      const userPreds = mockPredictions
        .filter((p) => p.userId.toString() === userId.toString())
        .sort((a, b) => b.createdAt - a.createdAt);

      const populated = userPreds.slice(skip, skip + limit).map((p) => {
        return {
          ...p,
          personalMetricId: mockPersonalMetrics.find((m) => m._id === p.personalMetricId),
          menstrualHistoryId: mockMenstrualHistories.find((m) => m._id === p.menstrualHistoryId),
          clinicalSymptomId: mockClinicalSymptoms.find((m) => m._id === p.clinicalSymptomId),
          lifestyleHabitId: mockLifestyleHabits.find((m) => m._id === p.lifestyleHabitId),
        };
      });

      return {
        predictions: populated,
        total: userPreds.length,
        page,
        limit,
        totalPages: Math.ceil(userPreds.length / limit),
      };
    }

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const [predictions, total] = await Promise.all([
      Prediction.find({ userId })
        .populate('personalMetricId')
        .populate('menstrualHistoryId')
        .populate('clinicalSymptomId')
        .populate('lifestyleHabitId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prediction.countDocuments({ userId }),
    ]);
    return { predictions, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async findById(id) {
    if (global.dbMode === 'mock') {
      const p = mockPredictions.find((pred) => pred._id === id);
      if (!p) return null;
      return {
        ...p,
        personalMetricId: mockPersonalMetrics.find((m) => m._id === p.personalMetricId),
        menstrualHistoryId: mockMenstrualHistories.find((m) => m._id === p.menstrualHistoryId),
        clinicalSymptomId: mockClinicalSymptoms.find((m) => m._id === p.clinicalSymptomId),
        lifestyleHabitId: mockLifestyleHabits.find((m) => m._id === p.lifestyleHabitId),
      };
    }

    return Prediction.findById(id)
      .populate('personalMetricId')
      .populate('menstrualHistoryId')
      .populate('clinicalSymptomId')
      .populate('lifestyleHabitId')
      .populate('userId', 'name email');
  },

  async deleteById(id) {
    if (global.dbMode === 'mock') {
      const idx = mockPredictions.findIndex((p) => p._id === id);
      if (idx === -1) return null;
      const deleted = mockPredictions[idx];
      mockPredictions.splice(idx, 1);
      return deleted;
    }
    return Prediction.findByIdAndDelete(id);
  },

  async countAll() {
    if (global.dbMode === 'mock') {
      return mockPredictions.length;
    }
    return Prediction.countDocuments();
  },

  async getStatsByResult() {
    if (global.dbMode === 'mock') {
      const statsMap = mockPredictions.reduce((acc, p) => {
        acc[p.result] = (acc[p.result] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(statsMap).map(([_id, count]) => ({ _id, count }));
    }

    return Prediction.aggregate([
      { $group: { _id: '$result', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  },

  async getRecentPredictions(limit = 10) {
    if (global.dbMode === 'mock') {
      return mockPredictions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    }

    return Prediction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  },
};

