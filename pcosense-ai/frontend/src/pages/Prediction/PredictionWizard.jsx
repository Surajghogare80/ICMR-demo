// src/pages/Prediction/PredictionWizard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Stepper, Step,
  StepLabel, Button, TextField, Grid, FormControl, InputLabel,
  Select, MenuItem, Switch, LinearProgress,
  Alert, Chip, ToggleButton, ToggleButtonGroup, Divider,
} from '@mui/material';
import { ArrowBack, ArrowForward, Science, ListAlt, Biotech, Assignment } from '@mui/icons-material';
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
    { id: 'personal',   label: 'Personal Info',      description: 'Age, Weight, Height, Waist & Hip' },
    { id: 'menstrual',  label: 'Menstrual History',  description: 'Cycle, Regularity, Flow & Family History' },
    { id: 'symptoms',   label: 'Clinical Symptoms',  description: 'Physical Symptoms & Signs' },
    { id: 'lifestyle',  label: 'Lifestyle Habits',   description: 'Diet, Exercise & Stress Levels' },
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
  const [screeningMode, setScreeningMode] = useState(null);
  const [selectedMode, setSelectedMode]   = useState(null);
  const [activeStep, setActiveStep]       = useState(0);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  // Personal Info sub-card pagination
  const [personalSubStep, setPersonalSubStep] = useState(1);
  const [personalSlideDir, setPersonalSlideDir] = useState(1);
  // Blood test card pagination
  const [bloodPage, setBloodPage]         = useState(1);
  const [bloodSlideDir, setBloodSlideDir] = useState(1); // 1 = slide left, -1 = slide right

  const [formData, setFormData] = useState({
    personal: {
      age: 25, weight: 60, height: '', bmi: '',
      // Body measurements (new — displayed in Personal step)
      waist: '', hip: '', waistHipRatio: '',
      // Blood group (moved to Blood Test step UI but stored in personal)
      bloodGroup: '',
      // Page 1 blood markers
      fsh: '', lh: '', tsh: '', amh: '', hb: '', rbs: '',
      // Page 2 extended markers (RF model features)
      vitaminD3: '', shbg: '', fastingInsulin: '', insulinResistance: '',
    },
    menstrual: {
      cycleLength: '', cycleRegularity: 'Regular', periodDuration: '',
      flowIntensity: 'Normal', follicleNo: '', avgFsize: '', ovaryVolume: '',
      endometrium: '',
      familyHistory: false, // new
    },
    symptoms:  { weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false },
    lifestyle: { fastFoodFreq: 'Never', exerciseFreq: '1-2 times/week', stressLevel: 'Moderate', sleepHours: '' },
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

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateStep = (stepIdx) => {
    const stepId = steps[stepIdx]?.id;

    if (stepId === 'personal') {
      const age    = Number(formData.personal.age);
      const weight = Number(formData.personal.weight);
      const height = Number(formData.personal.height);

      if (!formData.personal.age || isNaN(age) || age < 10 || age > 70) {
        toast.error('Age must be between 10 and 70 years.'); return false;
      }
      if (!formData.personal.weight || isNaN(weight) || weight < 20 || weight > 200) {
        toast.error('Weight must be between 20 and 200 kg.'); return false;
      }
      if (!formData.personal.height || isNaN(height) || height < 100 || height > 250) {
        toast.error('Height must be between 100 and 250 cm.'); return false;
      }
      if (formData.personal.waist && (isNaN(Number(formData.personal.waist)) || Number(formData.personal.waist) <= 0)) {
        toast.error('Waist size must be a positive number.'); return false;
      }
      if (formData.personal.hip && (isNaN(Number(formData.personal.hip)) || Number(formData.personal.hip) <= 0)) {
        toast.error('Hip size must be a positive number.'); return false;
      }
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
        const age = Number(formData.personal.age);
        if (!formData.personal.age || isNaN(age) || age < 10 || age > 60) {
          toast.error('Please select or enter an age between 10 and 60 years.');
          return;
        }
        setPersonalSlideDir(1);
        setPersonalSubStep(2);
        return;
      }
      if (personalSubStep === 2) {
        const weight = Number(formData.personal.weight);
        const height = Number(formData.personal.height);
        if (!formData.personal.weight || isNaN(weight) || weight <= 0) {
          toast.error('Please enter a valid weight.');
          return;
        }
        if (!formData.personal.height || isNaN(height) || height <= 0) {
          toast.error('Please enter a valid height.');
          return;
        }
        setPersonalSlideDir(1);
        setPersonalSubStep(3);
        return;
      }
      if (personalSubStep === 3) {
        const waist = Number(formData.personal.waist);
        const hip = Number(formData.personal.hip);
        if (!formData.personal.waist || isNaN(waist) || waist <= 0) {
          toast.error('Please enter a valid waist measurement.');
          return;
        }
        if (!formData.personal.hip || isNaN(hip) || hip <= 0) {
          toast.error('Please enter a valid hip measurement.');
          return;
        }

        // Normalize all values right before advancing to keep backend & ML model 100% compatible
        const weightUnit = formData.personal.weightUnit || 'kg';
        const heightUnit = formData.personal.heightUnit || 'cm';
        const waistUnit  = formData.personal.waistUnit || 'cm';
        const hipUnit    = formData.personal.hipUnit || 'cm';

        const normalizedWeight = weightUnit === 'lbs' ? Number((Number(formData.personal.weight) / 2.20462).toFixed(1)) : Number(formData.personal.weight);
        const normalizedHeight = heightUnit === 'inch' ? Number((Number(formData.personal.height) * 2.54).toFixed(1)) : Number(formData.personal.height);
        const normalizedWaist  = waistUnit === 'inch' ? Number((Number(formData.personal.waist) * 2.54).toFixed(1)) : Number(formData.personal.waist);
        const normalizedHip    = hipUnit === 'inch' ? Number((Number(formData.personal.hip) * 2.54).toFixed(1)) : Number(formData.personal.hip);

        const hM = normalizedHeight / 100;
        const finalBmi = Number((normalizedWeight / (hM * hM)).toFixed(1));
        const finalWhr = Number((normalizedWaist / normalizedHip).toFixed(2));

        setFormData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            age: Number(formData.personal.age),
            weight: normalizedWeight,
            height: normalizedHeight,
            waist: normalizedWaist,
            hip: normalizedHip,
            bmi: finalBmi,
            waistHipRatio: finalWhr,
          },
        }));

        if (validateStep(activeStep)) {
          if (currentStepId === 'blood_report') setBloodPage(1);
          setActiveStep((s) => s + 1);
        }
        return;
      }
    }

    if (validateStep(activeStep)) {
      if (currentStepId === 'blood_report') setBloodPage(1);
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStepId === 'personal') {
      if (personalSubStep > 1) {
        setPersonalSlideDir(-1);
        setPersonalSubStep((s) => s - 1);
        return;
      }
      if (personalSubStep === 1) {
        if (activeStep > 0) {
          setActiveStep((s) => s - 1);
        }
        return;
      }
    }

    if (activeStep > 0) {
      const prevStep = steps[activeStep - 1];
      if (prevStep && prevStep.id === 'personal') {
        setPersonalSlideDir(-1);
        setPersonalSubStep(3);
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
          ...formData.lifestyle,
          sleepHours: formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : undefined,
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
            slideDir={personalSlideDir}
          />
        );
      }

      // ── Menstrual History ────────────────────────────────────────────────────
      case 'menstrual':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Menstrual History</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Average Cycle Length (days)" type="number" required
                value={formData.menstrual.cycleLength}
                onChange={(e) => updateField('menstrual', 'cycleLength', e.target.value)}
                inputProps={{ min: 15, max: 90 }} placeholder="e.g. 28"
                helperText="Days from start of one period to the next (15 – 90 days)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Period Duration (days)" type="number"
                value={formData.menstrual.periodDuration}
                onChange={(e) => updateField('menstrual', 'periodDuration', e.target.value)}
                inputProps={{ min: 1, max: 15 }} placeholder="e.g. 5"
                helperText="Days per period (1 – 15 days)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cycle Regularity</InputLabel>
                <Select
                  value={formData.menstrual.cycleRegularity} label="Cycle Regularity"
                  onChange={(e) => updateField('menstrual', 'cycleRegularity', e.target.value)}
                >
                  {CYCLE_REGULARITY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Flow Intensity</InputLabel>
                <Select
                  value={formData.menstrual.flowIntensity} label="Flow Intensity"
                  onChange={(e) => updateField('menstrual', 'flowIntensity', e.target.value)}
                >
                  {FLOW_INTENSITY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* ── Family History Section ──────────────────────────────────── */}
            <Grid item xs={12}>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <Typography variant="h6" fontWeight={700} gutterBottom>Family History</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Family History of PCOS
              </Typography>

              <ToggleButtonGroup
                value={formData.menstrual.familyHistory ? 'yes' : 'no'}
                exclusive
                onChange={(_, val) => {
                  if (val !== null) updateField('menstrual', 'familyHistory', val === 'yes');
                }}
                sx={{
                  '& .MuiToggleButton-root': {
                    px: 3.5, py: 0.8,
                    borderRadius: '20px !important',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: '1.5px solid #E91E63 !important',
                    color: '#E91E63',
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      bgcolor: '#E91E63', color: '#fff',
                      '&:hover': { bgcolor: '#C2185B' },
                    },
                    '&:hover': { bgcolor: 'rgba(233,30,99,0.08)' },
                  },
                  gap: 1,
                }}
              >
                <ToggleButton value="yes">YES</ToggleButton>
                <ToggleButton value="no">NO</ToggleButton>
              </ToggleButtonGroup>

              <AnimatePresence>
                {formData.menstrual.familyHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Alert severity="info" icon={false} sx={{ mt: 2, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Applies when PCOS has been diagnosed in:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mother · Aunt · Siblings · Cousins · Grandmother
                      </Typography>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>
          </Grid>
        );

      // ── Clinical Symptoms ─────────────────────────────────────────────────
      case 'symptoms':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Clinical Symptoms</Typography>
              <Typography variant="body2" color="text.secondary">
                Select all symptoms you have experienced in the last 6 months.
              </Typography>
            </Grid>
            {[
              { key: 'weightGain',    label: 'Unexplained Weight Gain',           desc: 'Sudden or progressive weight gain without dietary changes' },
              { key: 'hairGrowth',    label: 'Excessive Hair Growth (Hirsutism)', desc: 'Unwanted facial or body hair growth' },
              { key: 'skinDarkening', label: 'Skin Darkening',                   desc: 'Dark patches on neck, groin, or underarms (acanthosis nigricans)' },
              { key: 'pimples',       label: 'Acne / Pimples',                   desc: 'Persistent or severe acne on face, chest, or back' },
              { key: 'hairLoss',      label: 'Hair Thinning / Loss',             desc: 'Thinning of scalp hair or hair loss (alopecia)' },
            ].map((sym) => (
              <Grid key={sym.key} item xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: formData.symptoms[sym.key] ? 'primary.main' : 'divider',
                    bgcolor: formData.symptoms[sym.key]
                      ? (t) => t.palette.mode === 'dark' ? 'rgba(21,101,192,0.15)' : 'rgba(21,101,192,0.04)'
                      : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{sym.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{sym.desc}</Typography>
                    </Box>
                    <Switch
                      checked={formData.symptoms[sym.key]}
                      onChange={(e) => updateField('symptoms', sym.key, e.target.checked)}
                      color="primary"
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      // ── Lifestyle Habits ──────────────────────────────────────────────────
      case 'lifestyle':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Lifestyle Habits</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fast Food Frequency</InputLabel>
                <Select value={formData.lifestyle.fastFoodFreq} label="Fast Food Frequency" onChange={(e) => updateField('lifestyle', 'fastFoodFreq', e.target.value)}>
                  {FAST_FOOD_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Exercise Frequency</InputLabel>
                <Select value={formData.lifestyle.exerciseFreq} label="Exercise Frequency" onChange={(e) => updateField('lifestyle', 'exerciseFreq', e.target.value)}>
                  {EXERCISE_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Stress Level</InputLabel>
                <Select value={formData.lifestyle.stressLevel} label="Stress Level" onChange={(e) => updateField('lifestyle', 'stressLevel', e.target.value)}>
                  {STRESS_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Sleep Hours per Night" type="number"
                value={formData.lifestyle.sleepHours}
                onChange={(e) => updateField('lifestyle', 'sleepHours', e.target.value)}
                inputProps={{ min: 3, max: 12 }} placeholder="e.g. 8"
              />
            </Grid>
          </Grid>
        );

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

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined" startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={activeStep === 0 && personalSubStep === 1}
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
                Next Step
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
