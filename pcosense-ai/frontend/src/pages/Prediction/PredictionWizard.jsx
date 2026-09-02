// src/pages/Prediction/PredictionWizard.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Stepper, Step,
  StepLabel, Button, TextField, Grid, FormControl, InputLabel,
  Select, MenuItem, Switch, LinearProgress, Checkbox,
  Alert, Chip, ToggleButton, ToggleButtonGroup, Divider, Stack, IconButton,
} from '@mui/material';
import { ArrowBack, ArrowForward, Science, ListAlt, Biotech, Assignment, RadioButtonUnchecked, CheckCircle, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { predictionService } from '../../services/predictionService.js';
import {
  BLOOD_GROUP_OPTIONS, CYCLE_REGULARITY_OPTIONS, FLOW_INTENSITY_OPTIONS,
  FAST_FOOD_OPTIONS, EXERCISE_OPTIONS, STRESS_OPTIONS,
} from '../../constants/index.js';
import toast from 'react-hot-toast';
import WheelPicker from '../../components/ui/WheelPicker.jsx';
import PersonalInfoSection from './components/PersonalInfoSection.jsx';
import MenstrualHistorySection from './components/MenstrualHistorySection.jsx';
import ScreeningConsent from './components/ScreeningConsent.jsx';
import { translateOptionValue } from '../../utils/optionTranslation.js';

// ─── Shared pink outlined button style ────────────────────────────────────────
const PINK_BTN_SX = {
  borderRadius: '20px',
  borderColor: '#E91E63',
  color: '#E91E63',
  px: 2.5,
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: 0.3,
  transition: 'all 0.22s',
  '&:hover': {
    bgcolor: 'rgba(233,30,99,0.08)',
    borderColor: '#C2185B',
    color: '#C2185B',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 14px rgba(233,30,99,0.22)',
  },
};

// ─── Step list builder ────────────────────────────────────────────────────────
const getStepsList = (mode, t) => {
  const stepMeta = (id) => ({ id, label: t(`prediction.steps.${id}.label`), description: t(`prediction.steps.${id}.description`) });

  const list = [
    stepMeta('personal'),
    stepMeta('menstrual'),
    stepMeta('symptoms'),
    stepMeta('lifestyle'),
  ];

  if (mode === 'blood' || mode === 'both') {
    list.push(stepMeta('blood_report'));
  }

  if (mode === 'ultrasound' || mode === 'both') {
    list.push(stepMeta('ultrasound_scan'));
  }

  if (mode === 'symptoms') {
    list.push(stepMeta('review'));
  }

  return list;
};

// ─── Color helpers (number-only, no text labels) ──────────────────────────────
const getBMIColor = (bmi) => {
  const b = Number(bmi);
  if (!b) return null;
  if (b < 18.5) return '#2196F3'; // Blue  – Underweight
  if (b < 25)   return '#4CAF50'; // Green – Normal
  if (b < 30)   return '#FF9800'; // Orange – Overweight
  return '#F44336';               // Red   – Obese
};

const getWHRColor = (whr) => {
  const w = Number(whr);
  if (!w) return null;
  if (w < 0.80) return '#4CAF50'; // Green  – Low risk
  if (w < 0.85) return '#FF9800'; // Orange – Moderate risk
  return '#F44336';               // Red    – High risk
};

// Canonical option values (sent to the backend/model) are never translated —
// only their on-screen label is looked up through this map.
const translateOption = (t, group, value) => translateOptionValue(t, `options.${group}`, value);

// ─── Component ────────────────────────────────────────────────────────────────
const PredictionWizard = () => {
  const navigate      = useNavigate();
  const { t }         = useTranslation();
  const [hasGivenConsent, setHasGivenConsent] = useState(false);
  const [screeningMode, setScreeningMode] = useState(null);
  const [selectedMode, setSelectedMode]   = useState(null);
  const [activeStep, setActiveStep]       = useState(0);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [personalSubStep, setPersonalSubStep] = useState(1);
  // Blood test card pagination
  const [bloodPage, setBloodPage]         = useState(1);
  const [bloodSlideDir, setBloodSlideDir] = useState(1); // 1 = slide left, -1 = slide right

  const [formData, setFormData] = useState({
    personal: {
      age: 25, weight: 60, weightUnit: 'kg', height: 165, heightUnit: 'cm', bmi: 22.0,
      // Body measurements (new — displayed in Personal step)
      waist: 75, waistUnit: 'cm', hip: 95, hipUnit: 'cm', waistHipRatio: 0.79, familyHistory: false,
      // Blood group (moved to Blood Test step UI but stored in personal)
      bloodGroup: 'O+',
      // Page 1 blood markers
      fsh: '', lh: '', tsh: '', amh: '', testosterone: '', shbg: '', prl: '', prg: '',
      // Page 2 extended markers
      vitaminD3: '', haemoglobin: '', bpSystolic: '', bpDiastolic: '', fastingBloodGlucose: '', fastingInsulin: '',
      pulseRate: '', respiratoryRate: '', rbs: '', insulinResistance: null,
    },
    menstrual: {
      cycleLength: 28, cycleRegularity: 'Regular', periodDuration: 5,
      flowIntensity: 'Normal',
      // Ultrasound fields — exact dataset field names used by the RF model
      follicleNoLeft: '',       // Follicle No. (L)
      follicleNoRight: '',      // Follicle No. (R)
      avgFollicleSizeLeft: '',  // Avg. F size (L) (mm)
      avgFollicleSizeRight: '', // Avg. F size (R) (mm)
      endometrium: '',          // Endometrium (mm)
      familyHistory: false,
    },
    symptoms:  { weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false, noneOfAbove: false },
    lifestyle: { fastFoodFreq: 'No', exerciseFreq: 'Yes', stressLevel: 'Moderate', sleepHours: 7 },
  });

  const steps         = getStepsList(screeningMode || 'symptoms', t);
  const progress      = ((activeStep) / (steps.length - 1)) * 100;
  const currentStepId = steps[activeStep]?.id;

  // Auto-calculate BMI
  useEffect(() => {
    const { weight, height } = formData.personal;
    if (weight && height && Number(height) > 0) {
      const heightM = Number(height) / 100;
      const bmi = (Number(weight) / (heightM * heightM)).toFixed(1);
      setFormData((prev) => ({ ...prev, personal: { ...prev.personal, bmi } }));
    }
  }, [formData.personal.weight, formData.personal.height]);

  // Auto-calculate Waist-Hip Ratio
  useEffect(() => {
    const { waist, hip } = formData.personal;
    if (waist && hip && Number(hip) > 0) {
      const whr = (Number(waist) / Number(hip)).toFixed(2);
      setFormData((prev) => ({ ...prev, personal: { ...prev.personal, waistHipRatio: whr } }));
    } else {
      setFormData((prev) => ({ ...prev, personal: { ...prev.personal, waistHipRatio: '' } }));
    }
  }, [formData.personal.waist, formData.personal.hip]);

  const updateField = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSleepStep = (isPlus) => {
    const current = Number(formData.lifestyle.sleepHours) || 7;
    const next = isPlus ? Math.min(12, current + 1) : Math.max(3, current - 1);
    updateField('lifestyle', 'sleepHours', next);
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateStep = (stepIdx) => {
    const stepId = steps[stepIdx]?.id;

    if (stepId === 'personal') {
      return true;
    }

    if (stepId === 'menstrual') {
      const cycleLength    = Number(formData.menstrual.cycleLength);
      const periodDuration = formData.menstrual.periodDuration ? Number(formData.menstrual.periodDuration) : null;

      if (!formData.menstrual.cycleLength || isNaN(cycleLength) || cycleLength < 15 || cycleLength > 90) {
        toast.error(t('prediction.validation.cycle_length_range')); return false;
      }
      if (periodDuration !== null && (isNaN(periodDuration) || periodDuration < 1 || periodDuration > 15)) {
        toast.error(t('prediction.validation.period_duration_range')); return false;
      }
    }

    if (stepId === 'symptoms') {
      const hasSelection = Object.values(formData.symptoms).some(val => val === true);
      if (!hasSelection) {
        toast.error(t('prediction.validation.at_least_one_symptom'));
        return false;
      }
    }

    if (stepId === 'lifestyle') {
      const sleepHours = formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : null;
      if (sleepHours !== null && (isNaN(sleepHours) || sleepHours < 3 || sleepHours > 12)) {
        toast.error(t('prediction.validation.sleep_hours_range')); return false;
      }
    }

    if (stepId === 'blood_report') {
      const checkPositive = (val, name) => {
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          toast.error(t('prediction.validation.must_be_positive', { field: name }));
          return false;
        }
        return true;
      };
      // Page 1 markers
      if (!checkPositive(formData.personal.fsh,  'FSH'))                          return false;
      if (!checkPositive(formData.personal.lh,   'LH'))                           return false;
      if (!checkPositive(formData.personal.tsh,  'TSH'))                          return false;
      if (!checkPositive(formData.personal.amh,  'AMH'))                          return false;
      if (!checkPositive(formData.personal.testosterone, 'Testosterone'))         return false;
      if (!checkPositive(formData.personal.shbg,         'SHBG'))                 return false;
      if (!checkPositive(formData.personal.prl,          'Prolactin (PRL)'))      return false;
      if (!checkPositive(formData.personal.prg,          'Progesterone (PRG)'))   return false;
      // Page 2 extended markers
      if (!checkPositive(formData.personal.vitaminD3,       'Vitamin D3'))                return false;
      if (!checkPositive(formData.personal.haemoglobin,     'Haemoglobin'))               return false;
      if (!checkPositive(formData.personal.bpSystolic,      'Blood Pressure (Systolic)')) return false;
      if (!checkPositive(formData.personal.bpDiastolic,     'Blood Pressure (Diastolic)'))return false;
      if (!checkPositive(formData.personal.fastingBloodGlucose, 'Fasting Blood Glucose')) return false;
      if (!checkPositive(formData.personal.fastingInsulin,  'Fasting Insulin'))           return false;
      if (!checkPositive(formData.personal.pulseRate,       'Pulse Rate'))                return false;
      if (!checkPositive(formData.personal.respiratoryRate, 'Respiratory Rate'))          return false;
      if (!checkPositive(formData.personal.rbs,             'RBS'))                       return false;
    }

    if (stepId === 'ultrasound_scan') {
      const checkPositive = (val, name) => {
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          toast.error(t('prediction.validation.must_be_positive', { field: name }));
          return false;
        }
        return true;
      };
      // All fields optional — only validate format if a value is entered
      if (!checkPositive(formData.menstrual.follicleNoLeft,       'Follicle No. (L)'))        return false;
      if (!checkPositive(formData.menstrual.follicleNoRight,      'Follicle No. (R)'))        return false;
      if (!checkPositive(formData.menstrual.avgFollicleSizeLeft,  'Avg. F size (L) (mm)'))   return false;
      if (!checkPositive(formData.menstrual.avgFollicleSizeRight, 'Avg. F size (R) (mm)'))   return false;
      if (!checkPositive(formData.menstrual.endometrium,          'Endometrium (mm)'))        return false;
    }

    return true;
  };

  // ─── Navigation ──────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStepId === 'personal') {
      if (personalSubStep === 1) {
        setPersonalSubStep(2);
        return;
      }

      const rawAge = Number(formData.personal.age) || 25;
      const rawWeight = Number(formData.personal.weight) || 60;
      const rawHeight = Number(formData.personal.height) || 165;
      const rawWaist = Number(formData.personal.waist) || 75;
      const rawHip = Number(formData.personal.hip) || 95;

      const weightUnit = formData.personal.weightUnit || 'kg';
      const heightUnit = formData.personal.heightUnit || 'cm';
      const waistUnit  = formData.personal.waistUnit || 'cm';
      const hipUnit    = formData.personal.hipUnit || 'cm';

      const normalizedWeight = weightUnit === 'lbs' ? Number((rawWeight / 2.20462).toFixed(1)) : rawWeight;
      const normalizedHeight = heightUnit === 'inch' ? Number((rawHeight * 2.54).toFixed(1)) : rawHeight;
      const normalizedWaist  = waistUnit === 'inch' ? Number((rawWaist * 2.54).toFixed(1)) : rawWaist;
      const normalizedHip    = hipUnit === 'inch' ? Number((rawHip * 2.54).toFixed(1)) : rawHip;

      const hM = normalizedHeight / 100;
      const finalBmi = Number((normalizedWeight / (hM * hM)).toFixed(1));
      const finalWhr = Number((normalizedWaist / normalizedHip).toFixed(2));
      const familyHistory = formData.personal.familyHistory !== undefined ? formData.personal.familyHistory : false;

      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          age: rawAge,
          weight: normalizedWeight,
          height: normalizedHeight,
          waist: normalizedWaist,
          hip: normalizedHip,
          bmi: finalBmi,
          waistHipRatio: finalWhr,
          familyHistory,
        },
        menstrual: {
          ...prev.menstrual,
          familyHistory,
        },
      }));

      if (currentStepId === 'blood_report') setBloodPage(1);
      setActiveStep((s) => s + 1);
      return;
    }

    if (validateStep(activeStep)) {
      if (currentStepId === 'blood_report') setBloodPage(1);
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStepId === 'personal' && personalSubStep === 2) {
      setPersonalSubStep(1);
      return;
    }
    if (activeStep > 0) {
      if (steps[activeStep - 1]?.id === 'personal') {
        setPersonalSubStep(2);
      }
      setActiveStep((s) => s - 1);
    }
  };

  const handleSkip = () => {
    if (currentStepId === 'blood_report') {
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          bloodGroup: 'O+',
          fsh: '', lh: '', tsh: '', amh: '', testosterone: '', shbg: '', prl: '', prg: '',
          vitaminD3: '', haemoglobin: '', bpSystolic: '', bpDiastolic: '', fastingBloodGlucose: '', fastingInsulin: '',
          pulseRate: '', respiratoryRate: '', rbs: '', insulinResistance: null,
        },
      }));
      setBloodPage(1);
      toast.success(t('prediction.validation.blood_skipped'));
    } else if (currentStepId === 'ultrasound_scan') {
      setFormData((prev) => ({
        ...prev,
        menstrual: {
          ...prev.menstrual,
          fot: '', follicleNoRight: '',
          avgFollicleSizeLeft: '', avgFollicleSizeRight: '',
          endometrium: '',
        },
      }));
      toast.success(t('prediction.validation.ultrasound_skipped'));
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    try {
      const personalData = {
        age:    Number(formData.personal.age),
        weight: Number(formData.personal.weight),
        height: Number(formData.personal.height),
        bmi:    Number(formData.personal.bmi),
      };

      // Body measurements
      if (formData.personal.waist        !== '') personalData.waist        = Number(formData.personal.waist);
      if (formData.personal.hip          !== '') personalData.hip          = Number(formData.personal.hip);
      if (formData.personal.waistHipRatio !== '') personalData.waistHipRatio = Number(formData.personal.waistHipRatio);

      const menstrualData = {
        cycleLength:    Number(formData.menstrual.cycleLength),
        periodDuration: formData.menstrual.periodDuration ? Number(formData.menstrual.periodDuration) : undefined,
        cycleRegularity: formData.menstrual.cycleRegularity,
        flowIntensity:   formData.menstrual.flowIntensity,
        familyHistory:   formData.menstrual.familyHistory,
      };

      if (screeningMode === 'blood' || screeningMode === 'both') {
        if (formData.personal.bloodGroup)             personalData.bloodGroup      = formData.personal.bloodGroup;
        if (formData.personal.fsh         !== '')     personalData.fsh             = Number(formData.personal.fsh);
        if (formData.personal.lh          !== '')     personalData.lh              = Number(formData.personal.lh);
        
        // Auto-calculate both ratios — model requires LH:FSH and FSH/LH as distinct features
        if (formData.personal.lh !== '' && formData.personal.fsh !== '' && Number(formData.personal.fsh) !== 0) {
          const fshVal = Number(formData.personal.fsh);
          const lhVal  = Number(formData.personal.lh);
          personalData.lhFshRatio = Number((lhVal / fshVal).toFixed(4)); // LH:FSH
          personalData.fshLhRatio = Number((fshVal / lhVal).toFixed(4)); // FSH/LH
        }

        if (formData.personal.tsh         !== '')     personalData.tsh             = Number(formData.personal.tsh);
        if (formData.personal.amh         !== '')     personalData.amh             = Number(formData.personal.amh);
        if (formData.personal.testosterone !== '')    personalData.testosterone    = Number(formData.personal.testosterone);
        if (formData.personal.shbg        !== '')     personalData.shbg            = Number(formData.personal.shbg);
        if (formData.personal.prl         !== '')     personalData.prl             = Number(formData.personal.prl);
        if (formData.personal.prg         !== '')     personalData.prg             = Number(formData.personal.prg);
        // Extended blood markers (Page 2)
        if (formData.personal.vitaminD3           !== '') personalData.vitaminD3           = Number(formData.personal.vitaminD3);
        if (formData.personal.haemoglobin         !== '') personalData.haemoglobin         = Number(formData.personal.haemoglobin);
        if (formData.personal.bpSystolic          !== '') personalData.bpSystolic          = Number(formData.personal.bpSystolic);
        if (formData.personal.bpDiastolic         !== '') personalData.bpDiastolic         = Number(formData.personal.bpDiastolic);
        if (formData.personal.fastingBloodGlucose !== '') personalData.fastingBloodGlucose = Number(formData.personal.fastingBloodGlucose);
        if (formData.personal.fastingInsulin      !== '') personalData.fastingInsulin      = Number(formData.personal.fastingInsulin);
        if (formData.personal.pulseRate           !== '') personalData.pulseRate           = Number(formData.personal.pulseRate);
        if (formData.personal.respiratoryRate     !== '') personalData.respiratoryRate     = Number(formData.personal.respiratoryRate);
        if (formData.personal.rbs                 !== '') personalData.rbs                 = Number(formData.personal.rbs);
        if (formData.personal.insulinResistance   !== null) personalData.insulinResistance = formData.personal.insulinResistance;
      }

      if (screeningMode === 'ultrasound' || screeningMode === 'both') {
        // Exact dataset field names — mapped directly to the RF model features
        if (formData.menstrual.follicleNoLeft       !== '') menstrualData.follicleNoLeft       = Number(formData.menstrual.follicleNoLeft);
        if (formData.menstrual.follicleNoRight      !== '') menstrualData.follicleNoRight      = Number(formData.menstrual.follicleNoRight);
        if (formData.menstrual.avgFollicleSizeLeft  !== '') menstrualData.avgFollicleSizeLeft  = Number(formData.menstrual.avgFollicleSizeLeft);
        if (formData.menstrual.avgFollicleSizeRight !== '') menstrualData.avgFollicleSizeRight = Number(formData.menstrual.avgFollicleSizeRight);
        if (formData.menstrual.endometrium          !== '') menstrualData.endometrium          = Number(formData.menstrual.endometrium);
      }

      // Map frontend screeningMode to the backend predictionMode routing key
      const modeMap = {
        symptoms:   'symptoms_only',
        blood:      'symptoms_blood',
        ultrasound: 'symptoms_usg',
        both:       'symptoms_blood_usg',
      };
      const predictionMode = modeMap[screeningMode] || 'symptoms_only';

      const payload = {
        personal:  personalData,
        menstrual: menstrualData,
        symptoms:  formData.symptoms,
        lifestyle: {
          fastFoodFreq: formData.lifestyle.fastFoodFreq,
          exerciseFreq: formData.lifestyle.exerciseFreq,
          stressLevel:  formData.lifestyle.stressLevel,
          sleepHours:   formData.lifestyle.sleepHours !== '' ? Number(formData.lifestyle.sleepHours) : null,
        },
        predictionMode,  // Explicit model routing — no guessing
      };

      const res = await predictionService.create(payload);
      toast.success(t('prediction.validation.prediction_success'));
      navigate('/prediction/result', { state: { result: res.data.aiResult, prediction: res.data.prediction } });
    } catch (err) {
      toast.error(err.message || t('prediction.validation.prediction_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Step renderer ───────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStepId) {

      // ── Personal Information ─────────────────────────────────────────────────
      case 'personal': {
        return (
          <PersonalInfoSection
            formData={formData}
            setFormData={setFormData}
            subStep={personalSubStep}
            onNext={handleNext}
          />
        );
      }

      // ── Menstrual History ────────────────────────────────────────────────────
      case 'menstrual':
        return (
          <MenstrualHistorySection formData={formData} updateField={updateField} />
        );

      // ── Clinical Symptoms ─────────────────────────────────────────────────
      case 'symptoms':
        return (
          <Box>
            <Box textAlign="center" mb={4}>
              <Typography variant="h5" fontWeight={700} gutterBottom>{t('prediction.symptoms.title')}</Typography>
              <Typography variant="body1" color="text.secondary">{t('prediction.symptoms.subtitle_do_you_have')}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>{t('prediction.symptoms.subtitle_select_all')}</Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { key: 'hairGrowth',    icon: '👱', label: t('prediction.symptoms.hair_growth') },
                { key: 'skinDarkening', icon: '⚫', label: t('prediction.symptoms.skin_darkening') },
                { key: 'pimples',       icon: '🔴', label: t('prediction.symptoms.pimples') },
                { key: 'weightGain',    icon: '⚖️', label: t('prediction.symptoms.weight_gain') },
                { key: 'hairLoss',      icon: '🧑‍🦲', label: t('prediction.symptoms.hair_loss') },
                { key: 'noneOfAbove',   icon: '✋', label: t('prediction.symptoms.none_of_above') },
              ].map((sym) => {
                const isChecked = formData.symptoms[sym.key];
                return (
                  <Grid key={sym.key} item xs={12} sm={6}>
                    <Card
                      variant="outlined"
                      onClick={() => {
                        setFormData((prev) => {
                          const currentSym = prev.symptoms;
                          if (sym.key === 'noneOfAbove') {
                            return {
                              ...prev,
                              symptoms: {
                                ...currentSym,
                                weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false,
                                noneOfAbove: !currentSym.noneOfAbove,
                              }
                            };
                          } else {
                            return {
                              ...prev,
                              symptoms: {
                                ...currentSym,
                                [sym.key]: !currentSym[sym.key],
                                noneOfAbove: false,
                              }
                            };
                          }
                        });
                      }}
                      sx={{
                        p: 2,
                        height: '100%',
                        cursor: 'pointer',
                        borderRadius: 3,
                        borderColor: isChecked ? '#E91E63' : 'divider',
                        bgcolor: isChecked
                          ? (t) => t.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.12)' : 'rgba(233, 30, 99, 0.04)'
                          : 'background.paper',
                        transform: isChecked ? 'scale(1.02)' : 'scale(1)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: isChecked ? '#E91E63' : 'text.secondary',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Typography sx={{ fontSize: '2rem', mr: 2, lineHeight: 1, filter: isChecked ? 'drop-shadow(0px 0px 4px rgba(233,30,99,0.4))' : 'none', transition: 'all 0.2s' }}>
                          {sym.icon}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} color={isChecked ? '#E91E63' : 'text.primary'} sx={{ transition: 'color 0.2s' }}>
                            {sym.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {sym.desc}
                          </Typography>
                        </Box>
                        <Checkbox
                          checked={isChecked}
                          disableRipple
                          icon={<RadioButtonUnchecked color="action" />}
                          checkedIcon={<CheckCircle sx={{ color: '#E91E63' }} />}
                          sx={{ p: 0, ml: 2 }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );

      // ── Lifestyle ──────────────────────────────────────────────────
      case 'lifestyle': {
        const toggleStyle = {
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
          '& .MuiToggleButton-root': {
            px: 4.5,
            py: 1,
            borderRadius: '24px !important',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: '2px solid rgba(233, 30, 99, 0.35) !important',
            color: '#E91E63',
            transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: '125px',
            '&.Mui-selected': {
              bgcolor: '#E91E63',
              color: '#fff',
              borderColor: '#E91E63 !important',
              boxShadow: '0 4px 16px rgba(233, 30, 99, 0.35)',
              '&:hover': { bgcolor: '#C2185B' },
            },
            '&:hover': {
              bgcolor: 'rgba(233, 30, 99, 0.08)',
              transform: 'translateY(-1px)',
            },
          },
        };

        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={800} gutterBottom>{t('prediction.lifestyle.title')}</Typography>
            </Grid>

            {/* Fast Food */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('prediction.lifestyle.fast_food_question')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.fastFoodFreq}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'fastFoodFreq', val) }}
                  sx={toggleStyle}
                >
                  <ToggleButton value="Yes">{t('common.yes')}</ToggleButton>
                  <ToggleButton value="No">{t('common.no')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Exercise */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('prediction.lifestyle.exercise_question')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.exerciseFreq}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'exerciseFreq', val) }}
                  sx={toggleStyle}
                >
                  <ToggleButton value="Yes">{t('common.yes')}</ToggleButton>
                  <ToggleButton value="No">{t('common.no')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Stress Level */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('prediction.lifestyle.stress_level')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.stressLevel}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'stressLevel', val) }}
                  sx={{ ...toggleStyle, '& .MuiToggleButton-root': { ...toggleStyle['& .MuiToggleButton-root'], minWidth: '90px', px: 2 } }}
                >
                  <ToggleButton value="Low">{t('options.stress.low')}</ToggleButton>
                  <ToggleButton value="Moderate">{t('options.stress.moderate')}</ToggleButton>
                  <ToggleButton value="High">{t('options.stress.high')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Sleep Hours */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('prediction.lifestyle.sleep_hours_per_night')}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <IconButton
                    onClick={() => handleSleepStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 40, height: 40 }}
                    aria-label={t('prediction.lifestyle.decrease_sleep_hours')}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1 }}>
                      {formData.lifestyle.sleepHours || 7}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                      {t('units.hours_label')}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleSleepStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 40, height: 40 }}
                    aria-label={t('prediction.lifestyle.increase_sleep_hours')}
                  >
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        );
      }

      // ── Blood Test Results ────────────────────────────────────────────────
      case 'blood_report': {
        const slideVariants = {
          enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
          center: { opacity: 1, x: 0 },
          exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
        };

        const goToPage2 = () => { setBloodSlideDir(1);  setBloodPage(2); };
        const goToPage1 = () => { setBloodSlideDir(-1); setBloodPage(1); };

        let calculatedRatio = '--';
        if (formData.personal.lh !== '' && formData.personal.fsh !== '') {
          const fshNum = Number(formData.personal.fsh);
          const lhNum = Number(formData.personal.lh);
          if (fshNum === 0) {
            calculatedRatio = '--';
          } else {
            calculatedRatio = (lhNum / fshNum).toFixed(2);
          }
        }

        return (
          <Box>
            {/* Header */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" fontWeight={700}>{t('prediction.blood.header_title')}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                {t('prediction.blood.header_subtitle')} &nbsp;
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {t('prediction.blood.page_of', { page: bloodPage })}
                </Box>
              </Typography>
            </Box>

            {/* Animated field area */}
            <Box sx={{ overflow: 'hidden', position: 'relative', pt: 1.5 }}>
              <AnimatePresence mode="wait" custom={bloodSlideDir}>
                <motion.div
                  key={`blood-page-${bloodPage}`}
                  custom={bloodSlideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                >
                  <Grid container spacing={3}>
                    {bloodPage === 1 ? (
                      <>
                        {/* Row 1 */}
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel id="blood-group-select-label">{t('prediction.blood.blood_group')}</InputLabel>
                            <Select
                              labelId="blood-group-select-label"
                              value={formData.personal.bloodGroup || 'O+'}
                              label={t('prediction.blood.blood_group')}
                              onChange={(e) => updateField('personal', 'bloodGroup', e.target.value)}
                            >
                              {BLOOD_GROUP_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.fsh_label')} type="number" value={formData.personal.fsh} onChange={(e) => updateField('personal', 'fsh', e.target.value)} helperText={t('prediction.blood.fsh_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>

                        {/* Row 2 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.lh_label')} type="number" value={formData.personal.lh} onChange={(e) => updateField('personal', 'lh', e.target.value)} helperText={t('prediction.blood.lh_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.lh_fsh_ratio_label')} value={calculatedRatio} helperText={t('prediction.blood.lh_fsh_ratio_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} InputProps={{ readOnly: true }} disabled sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(233, 30, 99, 0.8)', fontWeight: 600 } }} />
                        </Grid>

                        {/* Row 3 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.tsh_label')} type="number" value={formData.personal.tsh} onChange={(e) => updateField('personal', 'tsh', e.target.value)} helperText={t('prediction.blood.tsh_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.amh_label')} type="number" value={formData.personal.amh} onChange={(e) => updateField('personal', 'amh', e.target.value)} helperText={t('prediction.blood.amh_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>

                        {/* Row 4 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.testosterone_label')} type="number" value={formData.personal.testosterone} onChange={(e) => updateField('personal', 'testosterone', e.target.value)} helperText={t('prediction.blood.testosterone_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.shbg_label')} type="number" value={formData.personal.shbg} onChange={(e) => updateField('personal', 'shbg', e.target.value)} helperText={t('prediction.blood.shbg_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>

                        {/* Row 5 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.prl_label')} type="number" value={formData.personal.prl} onChange={(e) => updateField('personal', 'prl', e.target.value)} helperText={t('prediction.blood.prl_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.prg_label')} type="number" value={formData.personal.prg} onChange={(e) => updateField('personal', 'prg', e.target.value)} helperText={t('prediction.blood.prg_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                      </>
                    ) : (
                      <>
                        {/* Row 1 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.vitamin_d3_label')} type="number" value={formData.personal.vitaminD3} onChange={(e) => updateField('personal', 'vitaminD3', e.target.value)} helperText={t('prediction.blood.vitamin_d3_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.haemoglobin_label')} type="number" value={formData.personal.haemoglobin} onChange={(e) => updateField('personal', 'haemoglobin', e.target.value)} helperText={t('prediction.blood.haemoglobin_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        {/* Row 2 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.pulse_rate_label')} type="number" value={formData.personal.pulseRate} onChange={(e) => updateField('personal', 'pulseRate', e.target.value)} helperText={t('prediction.blood.pulse_rate_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.respiratory_rate_label')} type="number" value={formData.personal.respiratoryRate} onChange={(e) => updateField('personal', 'respiratoryRate', e.target.value)} helperText={t('prediction.blood.respiratory_rate_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        {/* Row 3 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.bp_systolic_label')} type="number" value={formData.personal.bpSystolic} onChange={(e) => updateField('personal', 'bpSystolic', e.target.value)} helperText={t('prediction.blood.bp_systolic_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.bp_diastolic_label')} type="number" value={formData.personal.bpDiastolic} onChange={(e) => updateField('personal', 'bpDiastolic', e.target.value)} helperText={t('prediction.blood.bp_diastolic_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        {/* Row 4 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.fasting_glucose_label')} type="number" value={formData.personal.fastingBloodGlucose} onChange={(e) => updateField('personal', 'fastingBloodGlucose', e.target.value)} helperText={t('prediction.blood.fasting_glucose_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.fasting_insulin_label')} type="number" value={formData.personal.fastingInsulin} onChange={(e) => updateField('personal', 'fastingInsulin', e.target.value)} helperText={t('prediction.blood.fasting_insulin_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        {/* Row 5 */}
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label={t('prediction.blood.rbs_label')} type="number" value={formData.personal.rbs} onChange={(e) => updateField('personal', 'rbs', e.target.value)} helperText={t('prediction.blood.rbs_helper')} FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }} inputProps={{ step: 'any', min: 0 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{ height: '100%', justifyContent: 'flex-start' }}>
                             <Box sx={{
                                border: '1px solid',
                                borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                borderRadius: 1,
                                p: 1.5,
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '&:hover': { borderColor: (t) => t.palette.mode === 'dark' ? '#fff' : '#000' }
                             }}>
                                <Typography variant="caption" sx={{ position: 'absolute', top: '-10px', left: '10px', bgcolor: 'background.paper', px: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                                  {t('prediction.blood.insulin_resistance_label')}
                                </Typography>
                                <ToggleButtonGroup
                                  value={formData.personal.insulinResistance}
                                  exclusive
                                  onChange={(_, val) => { if (val) updateField('personal', 'insulinResistance', val) }}
                                  sx={{
                                    gap: 1.5, display: 'flex',
                                    '& .MuiToggleButton-root': {
                                      px: 3, py: 0.5, borderRadius: '20px !important', fontWeight: 800, fontSize: '0.85rem',
                                      border: '2px solid rgba(233, 30, 99, 0.35) !important', color: '#E91E63',
                                      transition: 'all 0.22s', minWidth: '80px', textTransform: 'none',
                                      '&.Mui-selected': { bgcolor: '#E91E63', color: '#fff', borderColor: '#E91E63 !important', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)', '&:hover': { bgcolor: '#C2185B' } },
                                      '&:hover': { bgcolor: 'rgba(233, 30, 99, 0.08)', transform: 'translateY(-1px)' }
                                    }
                                  }}
                                >
                                  <ToggleButton value="Yes">{t('common.yes')}</ToggleButton>
                                  <ToggleButton value="No">{t('common.no')}</ToggleButton>
                                </ToggleButtonGroup>
                             </Box>
                          </FormControl>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* View More / Previous Blood Tests */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {bloodPage === 1
                ? <Button variant="outlined" size="small" onClick={goToPage2} sx={PINK_BTN_SX}>{t('prediction.blood.view_more')}</Button>
                : <Button variant="outlined" size="small" onClick={goToPage1} sx={PINK_BTN_SX}>{t('prediction.blood.previous_blood_tests')}</Button>
              }
            </Box>
          </Box>
        );
      }

      // ── Ultrasound Scan ───────────────────────────────────────────────────
      case 'ultrasound_scan':
        return (
          <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700}>{t('prediction.ultrasound.header_title')}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }} />
            </Grid>

            {/* Row 1 — Follicle counts */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('prediction.ultrasound.follicle_left_label')}
                type="number"
                placeholder={t('prediction.ultrasound.follicle_left_placeholder')}
                value={formData.menstrual.follicleNoLeft}
                onChange={(e) => updateField('menstrual', 'follicleNoLeft', e.target.value)}
                helperText={t('prediction.ultrasound.follicle_left_helper')}
                FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }}
                inputProps={{ step: '1', min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('prediction.ultrasound.follicle_right_label')}
                type="number"
                placeholder={t('prediction.ultrasound.follicle_right_placeholder')}
                value={formData.menstrual.follicleNoRight}
                onChange={(e) => updateField('menstrual', 'follicleNoRight', e.target.value)}
                helperText={t('prediction.ultrasound.follicle_right_helper')}
                FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }}
                inputProps={{ step: '1', min: 0 }}
              />
            </Grid>

            {/* Row 2 — Average follicle sizes */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('prediction.ultrasound.avg_size_left_label')}
                type="number"
                placeholder={t('prediction.ultrasound.avg_size_left_placeholder')}
                value={formData.menstrual.avgFollicleSizeLeft}
                onChange={(e) => updateField('menstrual', 'avgFollicleSizeLeft', e.target.value)}
                helperText={t('prediction.ultrasound.avg_size_left_helper')}
                FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }}
                inputProps={{ step: 'any', min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('prediction.ultrasound.avg_size_right_label')}
                type="number"
                placeholder={t('prediction.ultrasound.avg_size_right_placeholder')}
                value={formData.menstrual.avgFollicleSizeRight}
                onChange={(e) => updateField('menstrual', 'avgFollicleSizeRight', e.target.value)}
                helperText={t('prediction.ultrasound.avg_size_right_helper')}
                FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }}
                inputProps={{ step: 'any', min: 0 }}
              />
            </Grid>

            {/* Row 3 — Endometrium full-width */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('prediction.ultrasound.endometrium_label')}
                type="number"
                placeholder={t('prediction.ultrasound.endometrium_placeholder')}
                value={formData.menstrual.endometrium}
                onChange={(e) => updateField('menstrual', 'endometrium', e.target.value)}
                helperText={t('prediction.ultrasound.endometrium_helper')}
                FormHelperTextProps={{ sx: { color: 'text.secondary', fontSize: '0.75rem' } }}
                inputProps={{ step: 'any', min: 0 }}
              />
            </Grid>
          </Grid>
        );

      // ── Review ────────────────────────────────────────────────────────────
      case 'review':
        return (
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>{t('prediction.review.title')}</Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: t('prediction.review.sections.personal_info'),
                  items: [
                    t('prediction.review.age_yrs', { value: formData.personal.age }),
                    t('prediction.review.weight_kg', { value: formData.personal.weight }),
                    t('prediction.review.height_cm', { value: formData.personal.height }),
                    t('prediction.review.bmi', { value: formData.personal.bmi }),
                    ...(formData.personal.waist    ? [t('prediction.review.waist_in', { value: formData.personal.waist })] : []),
                    ...(formData.personal.hip      ? [t('prediction.review.hip_in', { value: formData.personal.hip })]     : []),
                    ...(formData.personal.waistHipRatio ? [t('prediction.review.whr', { value: formData.personal.waistHipRatio })] : []),
                  ],
                },
                {
                  title: t('prediction.review.sections.menstrual_history'),
                  items: [
                    t('prediction.review.cycle_length_days', { value: formData.menstrual.cycleLength }),
                    t('prediction.review.regularity', { value: translateOption(t, 'cycleRegularity', formData.menstrual.cycleRegularity) }),
                    t('prediction.review.duration_days', { value: formData.menstrual.periodDuration || t('prediction.review.not_available') }),
                    t('prediction.review.flow', { value: translateOption(t, 'flowIntensity', formData.menstrual.flowIntensity) }),
                    t('prediction.review.family_history', { value: formData.menstrual.familyHistory ? t('common.yes') : t('common.no') }),
                  ],
                },
                {
                  title: t('prediction.review.sections.clinical_symptoms'),
                  items: Object.entries(formData.symptoms)
                    .filter(([, v]) => v)
                    .map(([k]) => t(`prediction.symptoms.${k.replace(/([A-Z])/g, '_$1').toLowerCase()}`, { defaultValue: k.replace(/([A-Z])/g, ' $1').trim() }))
                    .map((s) => `✓ ${s}`),
                },
                {
                  title: t('prediction.review.sections.lifestyle'),
                  items: [
                    t('prediction.review.fast_food', { value: translateOption(t, 'yesNo', formData.lifestyle.fastFoodFreq) }),
                    t('prediction.review.exercise', { value: translateOption(t, 'yesNo', formData.lifestyle.exerciseFreq) }),
                    t('prediction.review.stress', { value: translateOption(t, 'stress', formData.lifestyle.stressLevel) }),
                    t('prediction.review.sleep_hrs', { value: formData.lifestyle.sleepHours || t('prediction.review.not_available') }),
                  ],
                },
              ].map((section) => (
                <Grid key={section.title} item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>{section.title}</Typography>
                    {section.items.length > 0
                      ? section.items.map((item) => (
                          <Typography key={item} variant="body2" color="text.secondary" sx={{ py: 0.3 }}>{item}</Typography>
                        ))
                      : <Typography variant="body2" color="text.secondary">{t('prediction.review.none_reported')}</Typography>
                    }
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Medical Disclaimer:</strong> This screening tool is for educational purposes only and does not
                constitute a medical diagnosis. Please consult a qualified healthcare professional for a formal PMOS evaluation.
              </Typography>
            </Alert> */}
          </Box>
        );

      default:
        return null;
    }
  };

  // ─── Consent Gate (must accept before any screening step is reachable) ───────
  if (!hasGivenConsent) {
    return <ScreeningConsent onStart={() => setHasGivenConsent(true)} />;
  }

  // ─── Choice Page (screeningMode === null) ────────────────────────────────────
  if (screeningMode === null) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8, display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {t('prediction.choice.heading')}
              </Typography>
              <Typography color="text.secondary">
                {t('prediction.choice.subheading')}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {[
                {
                  id: 'symptoms',
                  title: t('prediction.choice.options.symptoms.title'),
                  tag: t('prediction.choice.options.symptoms.tag'),
                  desc: t('prediction.choice.options.symptoms.desc'),
                  icon: <ListAlt sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#E2E8F0' : '#64748B' }} />,
                },
                {
                  id: 'blood',
                  title: t('prediction.choice.options.blood.title'),
                  tag: t('prediction.choice.options.blood.tag'),
                  desc: t('prediction.choice.options.blood.desc'),
                  icon: <Science sx={{ color: '#E91E63' }} />,
                },
                {
                  id: 'ultrasound',
                  title: t('prediction.choice.options.ultrasound.title'),
                  tag: t('prediction.choice.options.ultrasound.tag'),
                  desc: t('prediction.choice.options.ultrasound.desc'),
                  icon: <Biotech sx={{ color: '#1976D2' }} />,
                },
                {
                  id: 'both',
                  title: t('prediction.choice.options.both.title'),
                  tag: t('prediction.choice.options.both.tag'),
                  desc: t('prediction.choice.options.both.desc'),
                  icon: <Assignment sx={{ color: '#EF5350' }} />,
                },
              ].map((option) => {
                const isSelected = selectedMode === option.id;
                return (
                  <Grid item xs={12} key={option.id}>
                    <Card
                      onClick={() => setSelectedMode(option.id)}
                      sx={{
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        bgcolor: isSelected
                          ? (t) => t.palette.mode === 'dark' ? 'rgba(233,30,99,0.15)' : 'rgba(233,30,99,0.04)'
                          : 'background.paper',
                        boxShadow: isSelected
                          ? (t) => t.palette.mode === 'dark' ? '0 8px 24px rgba(233,30,99,0.25)' : '0 8px 20px rgba(233,30,99,0.06)'
                          : 'none',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          borderColor: isSelected ? 'primary.main' : 'primary.light',
                          boxShadow: (t) => t.palette.mode === 'dark' ? '0 12px 40px rgba(233,30,99,0.3)' : '0 12px 32px rgba(233,30,99,0.08)',
                        },
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
                        <Box
                          sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            p: 1.5, borderRadius: 3,
                            bgcolor: (t) => {
                              const d = t.palette.mode === 'dark';
                              switch (option.id) {
                                case 'symptoms':   return d ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                                case 'blood':      return d ? 'rgba(233,30,99,0.15)'  : 'rgba(233,30,99,0.08)';
                                case 'ultrasound': return d ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.08)';
                                case 'both':       return d ? 'rgba(239,83,80,0.15)'  : 'rgba(239,83,80,0.08)';
                                default:           return 'divider';
                              }
                            },
                          }}
                        >
                          {option.icon}
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ mb: 0.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700}>{option.title}</Typography>
                            <Chip
                              label={option.tag}
                              size="small"
                              sx={{
                                height: 20, fontSize: '0.7rem', fontWeight: 600, border: 'none',
                                bgcolor: (t) => {
                                  const d = t.palette.mode === 'dark';
                                  switch (option.id) {
                                    case 'symptoms':   return d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
                                    case 'blood':      return d ? 'rgba(233,30,99,0.18)'   : 'rgba(233,30,99,0.08)';
                                    case 'ultrasound': return d ? 'rgba(33,150,243,0.18)'  : 'rgba(33,150,243,0.08)';
                                    case 'both':       return d ? 'rgba(239,83,80,0.18)'   : 'rgba(239,83,80,0.08)';
                                    default:           return 'divider';
                                  }
                                },
                                color: (t) => {
                                  const d = t.palette.mode === 'dark';
                                  switch (option.id) {
                                    case 'symptoms':   return d ? '#E2E8F0' : '#475569';
                                    case 'blood':      return d ? '#F48FB1' : '#C2185B';
                                    case 'ultrasound': return d ? '#90CAF9' : '#1565C0';
                                    case 'both':       return d ? '#EF5350' : '#C62828';
                                    default:           return 'text.primary';
                                  }
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">{option.desc}</Typography>
                        </Box>

                        <Box
                          sx={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: '2px solid',
                            borderColor: isSelected ? 'primary.main' : 'text.disabled',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {isSelected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained" fullWidth size="large"
                disabled={!selectedMode}
                onClick={() => setScreeningMode(selectedMode)}
                sx={{
                  py: 1.8, fontSize: '1rem', borderRadius: 3,
                  background: selectedMode ? 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)' : undefined,
                }}
              >
                {t('prediction.choice.start_button')}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // ─── Wizard scaffold ─────────────────────────────────────────────────────────
  const isSubmissionStep =
    currentStepId === 'review' ||
    (currentStepId === 'blood_report' && screeningMode === 'blood') ||
    currentStepId === 'ultrasound_scan';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 1.5, md: 2 } }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 1.5, md: 2 } }}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>{t('prediction.header.title')}</Typography>
            <Typography color="text.secondary" variant="body2">{t('prediction.header.subtitle')}</Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">{t('prediction.header.step_of', { current: activeStep + 1, total: steps.length })}</Typography>
              <Typography variant="caption" color="primary" fontWeight={700}>{t('prediction.header.percent_complete', { percent: Math.round(progress) })}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
          </Box>

          {/* Step Labels */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: { xs: 1.5, md: 2 }, display: { xs: 'none', md: 'flex' } }}>
            {steps.map((s) => (
              <Step key={s.id}>
                <StepLabel><Typography variant="caption" fontWeight={600}>{s.label}</Typography></StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Buttons (handled uniformly outside Card for all steps) */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined" startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={activeStep === 0 && (currentStepId !== 'personal' || personalSubStep === 1)}
            >
              {t('prediction.nav.back')}
            </Button>

            {(currentStepId === 'blood_report' || currentStepId === 'ultrasound_scan') && (
              <Button variant="outlined" color="warning" onClick={handleSkip}>
                {currentStepId === 'blood_report' ? t('prediction.nav.skip_blood') : t('prediction.nav.skip')}
              </Button>
            )}

            {!isSubmissionStep ? (
              <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}>
                {currentStepId === 'personal' && personalSubStep === 1 ? t('prediction.nav.next') : t('prediction.nav.next_step')}
              </Button>
            ) : (
              <Button
                variant="contained" startIcon={<Science />}
                onClick={handleSubmit} disabled={isSubmitting}
                sx={{ background: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)', px: 4 }}
              >
                {isSubmitting ? t('prediction.nav.analyzing') : t('prediction.nav.get_my_result')}
              </Button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PredictionWizard;
