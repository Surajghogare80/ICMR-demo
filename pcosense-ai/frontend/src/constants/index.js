// src/constants/index.js
export const API_BASE_URL = '/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PREDICTION: '/prediction',
  PREDICTION_RESULT: '/prediction/result',
  HISTORY: '/history',
  LIFESTYLE: '/lifestyle',
  LIFESTYLE_ARTICLE: '/lifestyle/:id',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_LOGS: '/admin/logs',
  NOT_FOUND: '*',
};

export const PREDICTION_STEPS = [
  { label: 'Personal Info', description: 'Age, Weight, Height & Blood Group' },
  { label: 'Menstrual History', description: 'Cycle, Regularity & Flow Details' },
  { label: 'Clinical Symptoms', description: 'Physical Symptoms & Signs' },
  { label: 'Lifestyle Habits', description: 'Diet, Exercise & Stress Levels' },
  { label: 'Review & Submit', description: 'Review all information before submitting' },
];

export const CYCLE_REGULARITY_OPTIONS = ['Regular', 'Irregular', 'Absent'];
export const FLOW_INTENSITY_OPTIONS = ['Light', 'Normal', 'Heavy', 'Very Heavy'];
export const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const FAST_FOOD_OPTIONS = ['Never', 'Rarely', '1-2 times/week', '3-4 times/week', 'Daily'];
export const EXERCISE_OPTIONS = ['Never', '1-2 times/week', '3-4 times/week', '5-6 times/week', 'Daily'];
export const STRESS_OPTIONS = ['Low', 'Moderate', 'High', 'Very High'];
