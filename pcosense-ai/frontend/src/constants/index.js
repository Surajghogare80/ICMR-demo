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
  { label: 'Lifestyle', description: 'Diet, Exercise & Stress Levels' },
  { label: 'Review & Submit', description: 'Review all information before submitting' },
];

export const CYCLE_REGULARITY_OPTIONS = ['Regular', 'Irregular', 'Absent'];
export const FLOW_INTENSITY_OPTIONS = ['Light', 'Normal', 'Heavy', 'Very Heavy'];
export const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
export const FAST_FOOD_OPTIONS = ['Yes', 'No'];
export const EXERCISE_OPTIONS = ['Yes', 'No'];
export const STRESS_OPTIONS = ['Low', 'Moderate', 'High'];
