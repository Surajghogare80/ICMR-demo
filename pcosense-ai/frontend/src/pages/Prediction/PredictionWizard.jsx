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
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  BLOOD_GROUP_OPTIONS, CYCLE_REGULARITY_OPTIONS, FLOW_INTENSITY_OPTIONS,
  FAST_FOOD_OPTIONS, EXERCISE_OPTIONS, STRESS_OPTIONS,
} from '../../constants/index.js';
import toast from 'react-hot-toast';
import WheelPicker from '../../components/ui/WheelPicker.jsx';
import PersonalInfoSection from './components/PersonalInfoSection.jsx';
import MenstrualHistorySection from './components/MenstrualHistorySection.jsx';

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
const getStepsList = (mode) => {
  const list = [
    { id: 'personal',   label: 'Personal Info',     description: 'Age, Measurements & Family History' },
    { id: 'menstrual',  label: 'Menstrual History', description: 'Cycle, Regularity & Flow Intensity' },
    { id: 'symptoms',   label: 'Clinical Symptoms', description: 'Physical Symptoms & Signs' },
    { id: 'lifestyle',  label: 'Lifestyle',          description: 'Diet, Exercise & Stress Levels' },
  ];

  if (mode === 'blood' || mode === 'both') {
    list.push({ id: 'blood_report', label: 'Blood Test Results', description: 'Blood Group, FSH, LH, TSH, AMH, Hb & RBS' });
  }

  if (mode === 'ultrasound' || mode === 'both') {
    list.push({ id: 'ultrasound_scan', label: 'Ultrasound Scan', description: 'Follicles, Size, Volume & Endometrium' });
  }

  if (mode === 'symptoms') {
    list.push({ id: 'review', label: 'Review & Submit', description: 'Review all information before submitting' });
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

// ─── Component ────────────────────────────────────────────────────────────────
const PredictionWizard = () => {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { t }         = useTranslation();
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
      bloodGroup: '',
      // Page 1 blood markers
      fsh: '', lh: '', tsh: '', amh: '', hb: '', rbs: '',
      // Page 2 extended markers (RF model features)
      vitaminD3: '', shbg: '', fastingInsulin: '', insulinResistance: '',
    },
    menstrual: {
      cycleLength: 28, cycleRegularity: 'Regular', periodDuration: 5,
      flowIntensity: 'Normal', follicleNo: '', avgFsize: '', ovaryVolume: '',
      endometrium: '',
      familyHistory: false, // new
    },
    symptoms:  { weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false, noneOfAbove: false },
    lifestyle: { fastFoodFreq: 'No', exerciseFreq: 'Yes', stressLevel: 'Moderate', sleepHours: 7 },
  });

  const steps         = getStepsList(screeningMode || 'symptoms');
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
        toast.error('Average Cycle Length must be between 15 and 90 days.'); return false;
      }
      if (periodDuration !== null && (isNaN(periodDuration) || periodDuration < 1 || periodDuration > 15)) {
        toast.error('Period Duration must be between 1 and 15 days.'); return false;
      }
    }

    if (stepId === 'symptoms') {
      const hasSelection = Object.values(formData.symptoms).some(val => val === true);
      if (!hasSelection) {
        toast.error('Please select at least one symptom or "None of the Above".');
        return false;
      }
    }

    if (stepId === 'lifestyle') {
      const sleepHours = formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : null;
      if (sleepHours !== null && (isNaN(sleepHours) || sleepHours < 3 || sleepHours > 12)) {
        toast.error('Sleep hours must be between 3 and 12 hours.'); return false;
      }
    }

    if (stepId === 'blood_report') {
      const checkPositive = (val, name) => {
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          toast.error(`${name} must be a positive number.`);
          return false;
        }
        return true;
      };
      // Page 1 markers
      if (!checkPositive(formData.personal.fsh,  'FSH'))                          return false;
      if (!checkPositive(formData.personal.lh,   'LH'))                           return false;
      if (!checkPositive(formData.personal.tsh,  'TSH'))                          return false;
      if (!checkPositive(formData.personal.amh,  'AMH'))                          return false;
      if (!checkPositive(formData.personal.hb,   'Haemoglobin'))                  return false;
      if (!checkPositive(formData.personal.rbs,  'Random Blood Sugar'))            return false;
      // Page 2 extended markers
      if (!checkPositive(formData.personal.vitaminD3,       'Vitamin D3'))        return false;
      if (!checkPositive(formData.personal.shbg,            'SHBG'))              return false;
      if (!checkPositive(formData.personal.fastingInsulin,  'Fasting Insulin'))   return false;
      if (!checkPositive(formData.personal.insulinResistance, 'Insulin Resistance (HOMA-IR)')) return false;
    }

    if (stepId === 'ultrasound_scan') {
      const checkPositive = (val, name) => {
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          toast.error(`${name} must be a positive number.`);
          return false;
        }
        return true;
      };
      if (!checkPositive(formData.menstrual.follicleNo,  'Number of follicles'))   return false;
      if (!checkPositive(formData.menstrual.avgFsize,    'Average follicle size')) return false;
      if (!checkPositive(formData.menstrual.ovaryVolume, 'Ovary volume'))          return false;
      if (!checkPositive(formData.menstrual.endometrium, 'Endometrium thickness')) return false;
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
          bloodGroup: '',
          fsh: '', lh: '', tsh: '', amh: '', hb: '', rbs: '',
          vitaminD3: '', shbg: '', fastingInsulin: '', insulinResistance: '',
        },
      }));
      setBloodPage(1);
      toast.success('Blood report page skipped.');
    } else if (currentStepId === 'ultrasound_scan') {
      setFormData((prev) => ({
        ...prev,
        menstrual: { ...prev.menstrual, follicleNo: '', avgFsize: '', ovaryVolume: '', endometrium: '' },
      }));
      toast.success('Ultrasound scan page skipped.');
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
        if (formData.personal.tsh         !== '')     personalData.tsh             = Number(formData.personal.tsh);
        if (formData.personal.amh         !== '')     personalData.amh             = Number(formData.personal.amh);
        if (formData.personal.hb          !== '')     personalData.hb              = Number(formData.personal.hb);
        if (formData.personal.rbs         !== '')     personalData.rbs             = Number(formData.personal.rbs);
        // Extended blood markers (Page 2)
        if (formData.personal.vitaminD3       !== '') personalData.vitaminD3       = Number(formData.personal.vitaminD3);
        if (formData.personal.shbg            !== '') personalData.shbg            = Number(formData.personal.shbg);
        if (formData.personal.fastingInsulin  !== '') personalData.fastingInsulin  = Number(formData.personal.fastingInsulin);
        if (formData.personal.insulinResistance !== '') personalData.insulinResistance = Number(formData.personal.insulinResistance);
      }

      if (screeningMode === 'ultrasound' || screeningMode === 'both') {
        if (formData.menstrual.follicleNo  !== '') menstrualData.follicleNo  = Number(formData.menstrual.follicleNo);
        if (formData.menstrual.avgFsize    !== '') menstrualData.avgFsize    = Number(formData.menstrual.avgFsize);
        if (formData.menstrual.ovaryVolume !== '') menstrualData.ovaryVolume = Number(formData.menstrual.ovaryVolume);
        if (formData.menstrual.endometrium !== '') menstrualData.endometrium = Number(formData.menstrual.endometrium);
      }

      const payload = {
        personal:  personalData,
        menstrual: menstrualData,
        symptoms:  formData.symptoms,
        lifestyle: {
          fastFoodFreq: formData.lifestyle.fastFoodFreq || 'No',
          exerciseFreq: formData.lifestyle.exerciseFreq || 'Yes',
          stressLevel:  formData.lifestyle.stressLevel  || 'Moderate',
          sleepHours:   Number(formData.lifestyle.sleepHours) || 7,
        },
      };

      const res = await predictionService.create(payload);
      toast.success('Prediction completed!');
      navigate('/prediction/result', { state: { result: res.data.aiResult, prediction: res.data.prediction } });
    } catch (err) {
      toast.error(err.message || 'Prediction failed. Please try again.');
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
              <Typography variant="h5" fontWeight={700} gutterBottom>Clinical Symptoms</Typography>
              <Typography variant="body1" color="text.secondary">Do you have any of these?</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Select all that apply.</Typography>
            </Box>
            <Grid container spacing={3}>
              {[
                { key: 'hairGrowth',    icon: '👱', label: 'Extra hair on body or face'}, //desc: 'Extra hair on face or body (Hirsutism)' },
                { key: 'skinDarkening', icon: '⚫', label: 'Dark Patches of Skin (neck,armpits)'},                   //desc: 'Dark patches on neck, armpits or groin' },
                { key: 'pimples',       icon: '🔴', label: 'Acne or Skin Problems'},                   //desc: 'Persistent acne or skin problems' },
                { key: 'weightGain',    icon: '⚖️', label: 'Unexplained Weight Gain'},           //desc: 'Sudden weight gain without obvious reason' },
                { key: 'hairLoss',      icon: '🧑‍🦲', label: 'Hair Thinning or loss from scalp'},            // desc: 'Hair thinning or loss from scalp' },
                { key: 'noneOfAbove',   icon: '✋', label: 'None of the Above'},                      //desc: 'No symptoms listed above' },
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
              <Typography variant="h5" fontWeight={800} gutterBottom>{t('lifestyle', 'Lifestyle')}</Typography>
            </Grid>

            {/* Fast Food */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('eat_fast_food_regularly', 'Do you eat fast food regularly?')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.fastFoodFreq}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'fastFoodFreq', val) }}
                  sx={toggleStyle}
                >
                  <ToggleButton value="Yes">{t('yes', 'Yes')}</ToggleButton>
                  <ToggleButton value="No">{t('no', 'No')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Exercise */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('exercise_regularly', 'Do you exercise regularly?')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.exerciseFreq}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'exerciseFreq', val) }}
                  sx={toggleStyle}
                >
                  <ToggleButton value="Yes">{t('yes', 'Yes')}</ToggleButton>
                  <ToggleButton value="No">{t('no', 'No')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Stress Level */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('stress_level', 'Stress Level')}
                </Typography>
                <ToggleButtonGroup
                  value={formData.lifestyle.stressLevel}
                  exclusive
                  onChange={(_, val) => { if (val) updateField('lifestyle', 'stressLevel', val) }}
                  sx={{ ...toggleStyle, '& .MuiToggleButton-root': { ...toggleStyle['& .MuiToggleButton-root'], minWidth: '90px', px: 2 } }}
                >
                  <ToggleButton value="Low">{t('low', 'Low')}</ToggleButton>
                  <ToggleButton value="Moderate">{t('moderate', 'Moderate')}</ToggleButton>
                  <ToggleButton value="High">{t('high', 'High')}</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            {/* Sleep Hours */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: '20px', bgcolor: 'rgba(233, 30, 99, 0.03)', border: '1px solid rgba(233, 30, 99, 0.15)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 2 }}>
                  {t('sleep_hours_per_night', 'Sleep Hours per Night')}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                  <IconButton
                    onClick={() => handleSleepStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 40, height: 40 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1 }}>
                      {formData.lifestyle.sleepHours || 7}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                      {t('hours', 'hours')}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleSleepStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 40, height: 40 }}
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
        const bloodPage1Fields = [
          { key: 'fsh', label: 'FSH (mIU/mL)',                  desc: 'Follicle-Stimulating Hormone' },
          { key: 'lh',  label: 'LH (mIU/mL)',                   desc: 'Luteinizing Hormone' },
          { key: 'tsh', label: 'TSH (mIU/L)',                   desc: 'Thyroid-Stimulating Hormone' },
          { key: 'amh', label: 'AMH (ng/mL)',                   desc: 'Anti-Müllerian Hormone' },
          { key: 'hb',  label: 'Haemoglobin (g/dL)',            desc: 'Oxygen-carrying protein' },
          { key: 'rbs', label: 'Random Blood Sugar (mg/dL)',     desc: 'Random Blood Sugar' },
        ];
        const bloodPage2Fields = [
          { key: 'vitaminD3',         label: 'Vitamin D3 (ng/mL)',          desc: 'Cholecalciferol level' },
          { key: 'shbg',              label: 'SHBG (nmol/L)',               desc: 'Sex Hormone-Binding Globulin' },
          { key: 'fastingInsulin',    label: 'Fasting Insulin (µIU/mL)',    desc: 'Baseline insulin level' },
          { key: 'insulinResistance', label: 'Insulin Resistance (HOMA-IR)',desc: 'HOMA-IR index (fasting glucose × fasting insulin ÷ 405)' },
        ];

        const slideVariants = {
          enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
          center: { opacity: 1, x: 0 },
          exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
        };

        const goToPage2 = () => { setBloodSlideDir(1);  setBloodPage(2); };
        const goToPage1 = () => { setBloodSlideDir(-1); setBloodPage(1); };
        const activeFields = bloodPage === 1 ? bloodPage1Fields : bloodPage2Fields;

        return (
          <Box>
            {/* Header */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6" fontWeight={700}>Recent Blood Test Results (Optional)</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                Optional – improves prediction accuracy. &nbsp;
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Page {bloodPage} of 2
                </Box>
              </Typography>
            </Box>

            {/* Blood Group — always visible on both pages */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={formData.personal.bloodGroup || ''}
                  label="Blood Group"
                  onChange={(e) => updateField('personal', 'bloodGroup', e.target.value)}
                >
                  {BLOOD_GROUP_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            {/* Animated field area */}
            <Box sx={{ overflow: 'hidden', position: 'relative' }}>
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
                    {activeFields.map((f) => (
                      <Grid item xs={12} sm={6} key={f.key}>
                        <TextField
                          fullWidth label={f.label} type="number" placeholder="e.g. 4.5"
                          value={formData.personal[f.key]}
                          onChange={(e) => updateField('personal', f.key, e.target.value)}
                          helperText={f.desc}
                          inputProps={{ step: 'any', min: 0 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* View More / Previous Blood Tests */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {bloodPage === 1
                ? <Button variant="outlined" size="small" onClick={goToPage2} sx={PINK_BTN_SX}>View More ›</Button>
                : <Button variant="outlined" size="small" onClick={goToPage1} sx={PINK_BTN_SX}>‹ Previous Blood Tests</Button>
              }
            </Box>
          </Box>
        );
      }

      // ── Ultrasound Scan ───────────────────────────────────────────────────
      case 'ultrasound_scan':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700}>Ultrasound Scan Metrics (Optional)</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                Optional – improves prediction accuracy.
              </Typography>
            </Grid>
            {[
              { key: 'follicleNo',  label: 'Number of follicles (small cysts) seen', desc: 'Total count of ovarian follicles' },
              { key: 'avgFsize',    label: 'Average follicle size (mm)',              desc: 'Mean size of follicles' },
              { key: 'ovaryVolume', label: 'Ovary volume (mL)',                       desc: 'Total volume of the ovaries' },
              { key: 'endometrium', label: 'Endometrium thickness (mm)',              desc: 'Uterine lining thickness' },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.key}>
                <TextField
                  fullWidth label={f.label} type="number" placeholder="e.g. 6.0"
                  value={formData.menstrual[f.key]}
                  onChange={(e) => updateField('menstrual', f.key, e.target.value)}
                  helperText={f.desc}
                  inputProps={{ step: 'any', min: 0 }}
                />
              </Grid>
            ))}
          </Grid>
        );

      // ── Review ────────────────────────────────────────────────────────────
      case 'review':
        return (
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>Review Your Information</Typography>
            <Grid container spacing={2}>
              {[
                {
                  title: '👤 Personal Info',
                  items: [
                    `Age: ${formData.personal.age} yrs`,
                    `Weight: ${formData.personal.weight} kg`,
                    `Height: ${formData.personal.height} cm`,
                    `BMI: ${formData.personal.bmi}`,
                    ...(formData.personal.waist    ? [`Waist: ${formData.personal.waist}"`]           : []),
                    ...(formData.personal.hip      ? [`Hip: ${formData.personal.hip}"`]               : []),
                    ...(formData.personal.waistHipRatio ? [`WHR: ${formData.personal.waistHipRatio}`] : []),
                  ],
                },
                {
                  title: '🩸 Menstrual History',
                  items: [
                    `Cycle Length: ${formData.menstrual.cycleLength} days`,
                    `Regularity: ${formData.menstrual.cycleRegularity}`,
                    `Duration: ${formData.menstrual.periodDuration || 'N/A'} days`,
                    `Flow: ${formData.menstrual.flowIntensity}`,
                    `Family History: ${formData.menstrual.familyHistory ? 'Yes' : 'No'}`,
                  ],
                },
                {
                  title: '🔬 Clinical Symptoms',
                  items: Object.entries(formData.symptoms)
                    .filter(([, v]) => v)
                    .map(([k]) => k.replace(/([A-Z])/g, ' $1').trim())
                    .map((s) => `✓ ${s}`),
                },
                {
                  title: '🏃 Lifestyle',
                  items: [
                    `Fast Food: ${formData.lifestyle.fastFoodFreq}`,
                    `Exercise: ${formData.lifestyle.exerciseFreq}`,
                    `Stress: ${formData.lifestyle.stressLevel}`,
                    `Sleep: ${formData.lifestyle.sleepHours || 'N/A'} hrs`,
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
                      : <Typography variant="body2" color="text.secondary">None reported</Typography>
                    }
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Medical Disclaimer:</strong> This screening tool is for educational purposes only and does not
                constitute a medical diagnosis. Please consult a qualified healthcare professional for a formal PCOS evaluation.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  // ─── Choice Page (screeningMode === null) ────────────────────────────────────
  if (screeningMode === null) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8, display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                What do you have with you today?
              </Typography>
              <Typography color="text.secondary">
                Pick whichever fits — you can always do a full check later.
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {[
                {
                  id: 'symptoms',
                  title: 'Just my symptoms',
                  tag: 'No reports needed',
                  desc: "I don't have any test reports — just answer questions about my body.",
                  icon: <ListAlt sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#E2E8F0' : '#64748B' }} />,
                },
                {
                  id: 'blood',
                  title: 'I have a blood test report',
                  tag: 'Have blood report',
                  desc: 'From a lab or hospital visit. I can enter the numbers from the report.',
                  icon: <Science sx={{ color: '#E91E63' }} />,
                },
                {
                  id: 'ultrasound',
                  title: 'I have an ultrasound scan',
                  tag: 'Have ultrasound',
                  desc: 'A pelvic or transvaginal scan from a clinic or hospital.',
                  icon: <Biotech sx={{ color: '#1976D2' }} />,
                },
                {
                  id: 'both',
                  title: 'Blood report + ultrasound scan',
                  tag: 'Most complete',
                  desc: 'I have both. This gives the most complete picture.',
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
                Start screening →
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
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2rem' } }}>🧬 PCOS Screening Wizard</Typography>
            <Typography color="text.secondary" variant="body2">Complete the sections for an accurate risk assessment</Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Step {activeStep + 1} of {steps.length}</Typography>
              <Typography variant="caption" color="primary" fontWeight={700}>{Math.round(progress)}% Complete</Typography>
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
              Back
            </Button>

            {(currentStepId === 'blood_report' || currentStepId === 'ultrasound_scan') && (
              <Button variant="outlined" color="warning" onClick={handleSkip}>
                {currentStepId === 'blood_report' ? "Skip (I don't have this)" : 'Skip'}
              </Button>
            )}

            {!isSubmissionStep ? (
              <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext}>
                {currentStepId === 'personal' && personalSubStep === 1 ? 'Next' : 'Next Step'}
              </Button>
            ) : (
              <Button
                variant="contained" startIcon={<Science />}
                onClick={handleSubmit} disabled={isSubmitting}
                sx={{ background: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)', px: 4 }}
              >
                {isSubmitting ? 'Analyzing...' : 'Get My Result'}
              </Button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PredictionWizard;
