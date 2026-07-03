// src/pages/Prediction/PredictionWizard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Stepper, Step,
  StepLabel, Button, TextField, Grid, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch, LinearProgress,
  Alert, Chip,
} from '@mui/material';
import { ArrowBack, ArrowForward, Science, ListAlt, Biotech, Assignment } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { predictionService } from '../../services/predictionService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { BLOOD_GROUP_OPTIONS, CYCLE_REGULARITY_OPTIONS, FLOW_INTENSITY_OPTIONS, FAST_FOOD_OPTIONS, EXERCISE_OPTIONS, STRESS_OPTIONS } from '../../constants/index.js';
import toast from 'react-hot-toast';
import WheelPicker from '../../components/ui/WheelPicker.jsx';

const getStepsList = (mode) => {
  const list = [
    { id: 'personal', label: 'Personal Info', description: 'Age, Weight, Height & Blood Group' },
    { id: 'menstrual', label: 'Menstrual History', description: 'Cycle, Regularity & Flow Details' },
    { id: 'symptoms', label: 'Clinical Symptoms', description: 'Physical Symptoms & Signs' },
    { id: 'lifestyle', label: 'Lifestyle Habits', description: 'Diet, Exercise & Stress Levels' },
  ];
  
  if (mode === 'blood' || mode === 'both') {
    list.push({ id: 'blood_report', label: 'Blood Test Results', description: 'FSH, LH, TSH, AMH, Hb & Prolactin' });
  }
  
  if (mode === 'ultrasound' || mode === 'both') {
    list.push({ id: 'ultrasound_scan', label: 'Ultrasound Scan', description: 'Follicles, Size, Volume & Endometrium' });
  }
  
  if (mode === 'symptoms') {
    list.push({ id: 'review', label: 'Review & Submit', description: 'Review all information before submitting' });
  }
  
  return list;
};

const PredictionWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [screeningMode, setScreeningMode] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    personal: { age: 25, weight: 60, height: '', bmi: '', bloodGroup: '', fsh: '', lh: '', tsh: '', amh: '', hb: '', prl: '' },
    menstrual: { cycleLength: '', cycleRegularity: 'Regular', periodDuration: '', flowIntensity: 'Normal', follicleNo: '', avgFsize: '', ovaryVolume: '', endometrium: '' },
    symptoms: { weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false },
    lifestyle: { fastFoodFreq: 'Never', exerciseFreq: '1-2 times/week', stressLevel: 'Moderate', sleepHours: '' },
  });

  const steps = getStepsList(screeningMode || 'symptoms');
  const progress = ((activeStep) / (steps.length - 1)) * 100;
  const currentStepId = steps[activeStep]?.id;

  // Auto-calculate BMI
  useEffect(() => {
    const { weight, height } = formData.personal;
    if (weight && height && height > 0) {
      const heightM = Number(height) / 100;
      const bmi = (Number(weight) / (heightM * heightM)).toFixed(1);
      setFormData((prev) => ({ ...prev, personal: { ...prev.personal, bmi } }));
    }
  }, [formData.personal.weight, formData.personal.height]);

  const updateField = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const validateStep = (stepIdx) => {
    const stepId = steps[stepIdx]?.id;
    if (stepId === 'personal') {
      const age = Number(formData.personal.age);
      const weight = Number(formData.personal.weight);
      const height = Number(formData.personal.height);

      if (!formData.personal.age || isNaN(age) || age < 10 || age > 70) {
        toast.error('Age must be between 10 and 70 years.');
        return false;
      }
      if (!formData.personal.weight || isNaN(weight) || weight < 20 || weight > 200) {
        toast.error('Weight must be between 20 and 200 kg.');
        return false;
      }
      if (!formData.personal.height || isNaN(height) || height < 100 || height > 250) {
        toast.error('Height must be between 100 and 250 cm.');
        return false;
      }
    }

    if (stepId === 'menstrual') {
      const cycleLength = Number(formData.menstrual.cycleLength);
      const periodDuration = formData.menstrual.periodDuration ? Number(formData.menstrual.periodDuration) : null;

      if (!formData.menstrual.cycleLength || isNaN(cycleLength) || cycleLength < 15 || cycleLength > 90) {
        toast.error('Average Cycle Length must be between 15 and 90 days.');
        return false;
      }
      if (periodDuration !== null && (isNaN(periodDuration) || periodDuration < 1 || periodDuration > 15)) {
        toast.error('Period Duration must be between 1 and 15 days.');
        return false;
      }
    }

    if (stepId === 'lifestyle') {
      const sleepHours = formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : null;
      if (sleepHours !== null && (isNaN(sleepHours) || sleepHours < 3 || sleepHours > 12)) {
        toast.error('Sleep hours must be between 3 and 12 hours.');
        return false;
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
      if (!checkPositive(formData.personal.fsh, 'FSH')) return false;
      if (!checkPositive(formData.personal.lh, 'LH')) return false;
      if (!checkPositive(formData.personal.tsh, 'TSH')) return false;
      if (!checkPositive(formData.personal.amh, 'AMH')) return false;
      if (!checkPositive(formData.personal.hb, 'Haemoglobin')) return false;
      if (!checkPositive(formData.personal.prl, 'Prolactin')) return false;
    }

    if (stepId === 'ultrasound_scan') {
      const checkPositive = (val, name) => {
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          toast.error(`${name} must be a positive number.`);
          return false;
        }
        return true;
      };
      if (!checkPositive(formData.menstrual.follicleNo, 'Number of follicles')) return false;
      if (!checkPositive(formData.menstrual.avgFsize, 'Average follicle size')) return false;
      if (!checkPositive(formData.menstrual.ovaryVolume, 'Ovary volume')) return false;
      if (!checkPositive(formData.menstrual.endometrium, 'Endometrium thickness')) return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    if (currentStepId === 'blood_report') {
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fsh: '', lh: '', tsh: '', amh: '', hb: '', prl: ''
        }
      }));
      toast.success('Blood report page skipped.');
    } else if (currentStepId === 'ultrasound_scan') {
      setFormData((prev) => ({
        ...prev,
        menstrual: {
          ...prev.menstrual,
          follicleNo: '', avgFsize: '', ovaryVolume: '', endometrium: ''
        }
      }));
      toast.success('Ultrasound scan page skipped.');
    }

    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    try {
      const personalData = {
        age: Number(formData.personal.age),
        weight: Number(formData.personal.weight),
        height: Number(formData.personal.height),
        bmi: Number(formData.personal.bmi),
        bloodGroup: formData.personal.bloodGroup || undefined,
      };

      const menstrualData = {
        cycleLength: Number(formData.menstrual.cycleLength),
        periodDuration: formData.menstrual.periodDuration ? Number(formData.menstrual.periodDuration) : undefined,
        cycleRegularity: formData.menstrual.cycleRegularity,
        flowIntensity: formData.menstrual.flowIntensity,
      };

      if (screeningMode === 'blood' || screeningMode === 'both') {
        if (formData.personal.fsh !== '') personalData.fsh = Number(formData.personal.fsh);
        if (formData.personal.lh !== '') personalData.lh = Number(formData.personal.lh);
        if (formData.personal.tsh !== '') personalData.tsh = Number(formData.personal.tsh);
        if (formData.personal.amh !== '') personalData.amh = Number(formData.personal.amh);
        if (formData.personal.hb !== '') personalData.hb = Number(formData.personal.hb);
        if (formData.personal.prl !== '') personalData.prl = Number(formData.personal.prl);
      }

      if (screeningMode === 'ultrasound' || screeningMode === 'both') {
        if (formData.menstrual.follicleNo !== '') menstrualData.follicleNo = Number(formData.menstrual.follicleNo);
        if (formData.menstrual.avgFsize !== '') menstrualData.avgFsize = Number(formData.menstrual.avgFsize);
        if (formData.menstrual.ovaryVolume !== '') menstrualData.ovaryVolume = Number(formData.menstrual.ovaryVolume);
        if (formData.menstrual.endometrium !== '') menstrualData.endometrium = Number(formData.menstrual.endometrium);
      }

      const payload = {
        personal: personalData,
        menstrual: menstrualData,
        symptoms: formData.symptoms,
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

  const getBMILabel = (bmi) => {
    const b = Number(bmi);
    if (!b) return null;
    if (b < 18.5) return { label: 'Underweight', color: 'info' };
    if (b < 25) return { label: 'Normal', color: 'success' };
    if (b < 30) return { label: 'Overweight', color: 'warning' };
    return { label: 'Obese', color: 'error' };
  };

  const bmiInfo = getBMILabel(formData.personal.bmi);

  const renderStep = () => {
    switch (currentStepId) {
      case 'personal':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Personal Information</Typography>
            </Grid>
            
            {/* Age scroll WheelPicker */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">Age Selection</Typography>
              <WheelPicker
                value={formData.personal.age}
                onChange={(val) => updateField('personal', 'age', val)}
                min={10}
                max={70}
                unit="years"
              />
            </Grid>

            {/* Weight scroll WheelPicker */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">Weight Selection</Typography>
              <WheelPicker
                value={formData.personal.weight}
                onChange={(val) => updateField('personal', 'weight', val)}
                min={20}
                max={200}
                unit="kg"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={formData.personal.height}
                onChange={(e) => updateField('personal', 'height', e.target.value)}
                inputProps={{ min: 100, max: 250 }}
                placeholder="e.g. 165"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
            {formData.personal.bmi && (
              <Grid item xs={12}>
                <Alert severity={bmiInfo?.color === 'success' ? 'success' : bmiInfo?.color === 'warning' ? 'warning' : bmiInfo?.color === 'error' ? 'error' : 'info'} icon={false}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>Calculated BMI: {formData.personal.bmi}</Typography>
                    {bmiInfo && <Chip label={bmiInfo.label} color={bmiInfo.color} size="small" />}
                  </Box>
                </Alert>
              </Grid>
            )}
          </Grid>
        );

      case 'menstrual':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" fontWeight={700} gutterBottom>Menstrual History</Typography></Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Average Cycle Length (days)"
                type="number"
                value={formData.menstrual.cycleLength}
                onChange={(e) => updateField('menstrual', 'cycleLength', e.target.value)}
                inputProps={{ min: 15, max: 90 }}
                placeholder="e.g. 28"
                helperText="Days from start of one period to the next (15 - 90 days)"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Period Duration (days)"
                type="number"
                value={formData.menstrual.periodDuration}
                onChange={(e) => updateField('menstrual', 'periodDuration', e.target.value)}
                inputProps={{ min: 1, max: 15 }}
                placeholder="e.g. 5"
                helperText="Days per period (1 - 15 days)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cycle Regularity</InputLabel>
                <Select value={formData.menstrual.cycleRegularity} label="Cycle Regularity" onChange={(e) => updateField('menstrual', 'cycleRegularity', e.target.value)}>
                  {CYCLE_REGULARITY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Flow Intensity</InputLabel>
                <Select value={formData.menstrual.flowIntensity} label="Flow Intensity" onChange={(e) => updateField('menstrual', 'flowIntensity', e.target.value)}>
                  {FLOW_INTENSITY_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'symptoms':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><Typography variant="h6" fontWeight={700} gutterBottom>Clinical Symptoms</Typography>
              <Typography variant="body2" color="text.secondary">Select all symptoms you have experienced in the last 6 months.</Typography>
            </Grid>
            {[
              { key: 'weightGain', label: 'Unexplained Weight Gain', desc: 'Sudden or progressive weight gain without dietary changes' },
              { key: 'hairGrowth', label: 'Excessive Hair Growth (Hirsutism)', desc: 'Unwanted facial or body hair growth' },
              { key: 'skinDarkening', label: 'Skin Darkening', desc: 'Dark patches on neck, groin, or underarms (acanthosis nigricans)' },
              { key: 'pimples', label: 'Acne / Pimples', desc: 'Persistent or severe acne on face, chest, or back' },
              { key: 'hairLoss', label: 'Hair Thinning / Loss', desc: 'Thinning of scalp hair or hair loss (alopecia)' },
            ].map((sym) => (
              <Grid key={sym.key} item xs={12} sm={6}>
                <Card variant="outlined" sx={{ p: 2, borderColor: formData.symptoms[sym.key] ? 'primary.main' : 'divider', bgcolor: formData.symptoms[sym.key] ? (theme) => theme.palette.mode === 'dark' ? 'rgba(21, 101, 192, 0.15)' : 'rgba(21, 101, 192, 0.04)' : 'transparent', transition: 'all 0.2s' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{sym.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{sym.desc}</Typography>
                    </Box>
                    <Switch checked={formData.symptoms[sym.key]} onChange={(e) => updateField('symptoms', sym.key, e.target.checked)} color="primary" />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 'lifestyle':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" fontWeight={700} gutterBottom>Lifestyle Habits</Typography></Grid>
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
              <TextField fullWidth label="Sleep Hours per Night" type="number" value={formData.lifestyle.sleepHours} onChange={(e) => updateField('lifestyle', 'sleepHours', e.target.value)} inputProps={{ min: 3, max: 12 }} placeholder="e.g. 8" />
            </Grid>
          </Grid>
        );

      case 'blood_report':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={700}>Recent Blood Test Results (Optional)</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                Optional – improves prediction accuracy.
              </Typography>
            </Grid>
            {[
              { key: 'fsh', label: 'FSH (mIU/mL)', desc: 'Follicle-Stimulating Hormone' },
              { key: 'lh', label: 'LH (mIU/mL)', desc: 'Luteinizing Hormone' },
              { key: 'tsh', label: 'TSH (mIU/L)', desc: 'Thyroid-Stimulating Hormone' },
              { key: 'amh', label: 'AMH (ng/mL)', desc: 'Anti-Mullerian Hormone' },
              { key: 'hb', label: 'Haemoglobin (g/dL)', desc: 'Oxygen-carrying protein' },
              { key: 'prl', label: 'Prolactin (ng/mL)', desc: 'Pituitary gland hormone' },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.key}>
                <TextField
                  fullWidth
                  label={f.label}
                  type="number"
                  placeholder="e.g. 4.5"
                  value={formData.personal[f.key]}
                  onChange={(e) => updateField('personal', f.key, e.target.value)}
                  helperText={f.desc}
                  inputProps={{ step: 'any', min: 0 }}
                />
              </Grid>
            ))}
          </Grid>
        );

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
              { key: 'follicleNo', label: 'Number of follicles (small cysts) seen', desc: 'Total count of ovarian follicles' },
              { key: 'avgFsize', label: 'Average follicle size (mm)', desc: 'Mean size of follicles' },
              { key: 'ovaryVolume', label: 'Ovary volume (mL)', desc: 'Total volume of the ovaries' },
              { key: 'endometrium', label: 'Endometrium thickness (mm)', desc: 'Uterine lining thickness' },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.key}>
                <TextField
                  fullWidth
                  label={f.label}
                  type="number"
                  placeholder="e.g. 6.0"
                  value={formData.menstrual[f.key]}
                  onChange={(e) => updateField('menstrual', f.key, e.target.value)}
                  helperText={f.desc}
                  inputProps={{ step: 'any', min: 0 }}
                />
              </Grid>
            ))}
          </Grid>
        );

      case 'review':
        return (
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>Review Your Information</Typography>
            <Grid container spacing={2}>
              {[
                { title: '👤 Personal Info', items: [`Age: ${formData.personal.age} yrs`, `Weight: ${formData.personal.weight} kg`, `Height: ${formData.personal.height} cm`, `BMI: ${formData.personal.bmi}`, `Blood Group: ${formData.personal.bloodGroup || 'Not specified'}`] },
                { title: '🩸 Menstrual History', items: [`Cycle Length: ${formData.menstrual.cycleLength} days`, `Regularity: ${formData.menstrual.cycleRegularity}`, `Duration: ${formData.menstrual.periodDuration || 'N/A'} days`, `Flow: ${formData.menstrual.flowIntensity}`] },
                { title: '🔬 Clinical Symptoms', items: Object.entries(formData.symptoms).filter(([, v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').trim()).map((s) => `✓ ${s}`) },
                { title: '🏃 Lifestyle', items: [`Fast Food: ${formData.lifestyle.fastFoodFreq}`, `Exercise: ${formData.lifestyle.exerciseFreq}`, `Stress: ${formData.lifestyle.stressLevel}`, `Sleep: ${formData.lifestyle.sleepHours || 'N/A'} hrs`] },
              ].map((section) => (
                <Grid key={section.title} item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>{section.title}</Typography>
                    {section.items.length > 0 ? section.items.map((item) => (
                      <Typography key={item} variant="body2" color="text.secondary" sx={{ py: 0.3 }}>{item}</Typography>
                    )) : <Typography variant="body2" color="text.secondary">None reported</Typography>}
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Medical Disclaimer:</strong> This screening tool is for educational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for a formal PCOS evaluation.
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  // 1. New Screen Before Screening Starts: Choice Page
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
                  color: 'default',
                  desc: "I don't have any test reports — just answer questions about my body.",
                  icon: <ListAlt color="primary" />
                },
                {
                  id: 'blood',
                  title: 'I have a blood test report',
                  tag: 'Have blood report',
                  color: 'secondary',
                  desc: 'From a lab or hospital visit. I can enter the numbers from the report.',
                  icon: <Science color="secondary" />
                },
                {
                  id: 'ultrasound',
                  title: 'I have an ultrasound scan',
                  tag: 'Have ultrasound',
                  color: 'info',
                  desc: 'A pelvic or transvaginal scan from a clinic or hospital.',
                  icon: <Biotech color="info" />
                },
                {
                  id: 'both',
                  title: 'Blood report + ultrasound scan',
                  tag: 'Most complete',
                  color: 'error',
                  desc: 'I have both. This gives the most complete picture.',
                  icon: <Assignment color="error" />
                }
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
                          ? (theme) => theme.palette.mode === 'dark' ? 'rgba(21, 101, 192, 0.15)' : 'rgba(21, 101, 192, 0.04)'
                          : 'background.paper',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(21,101,192,0.12)',
                        }
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1.5, borderRadius: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                          {option.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {option.title}
                            </Typography>
                            <Chip label={option.tag} size="small" color={option.color} variant="outlined" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {option.desc}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: isSelected ? 'primary.main' : 'text.disabled',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
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
                variant="contained"
                fullWidth
                size="large"
                disabled={!selectedMode}
                onClick={() => setScreeningMode(selectedMode)}
                sx={{
                  py: 1.8,
                  fontSize: '1rem',
                  borderRadius: 3,
                  background: selectedMode ? 'linear-gradient(135deg, #1565C0 0%, #00897B 100%)' : undefined,
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

  // Determine if this is the last questionnaire/report step before prediction submission
  const isSubmissionStep = currentStepId === 'review' || 
                           (currentStepId === 'blood_report' && screeningMode === 'blood') ||
                           (currentStepId === 'ultrasound_scan');

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>🧬 PCOS Screening Wizard</Typography>
            <Typography color="text.secondary">Complete the sections for an accurate risk assessment</Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Step {activeStep + 1} of {steps.length}</Typography>
              <Typography variant="caption" color="primary" fontWeight={700}>{Math.round(progress)}% Complete</Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {/* Step Labels */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
            {steps.map((s) => (
              <Step key={s.id}>
                <StepLabel><Typography variant="caption" fontWeight={600}>{s.label}</Typography></StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
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
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep((s) => s - 1)}
              disabled={activeStep === 0}
            >
              Back
            </Button>

            {/* Skip Button for optional report pages */}
            {(currentStepId === 'blood_report' || currentStepId === 'ultrasound_scan') && (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleSkip}
              >
                {currentStepId === 'blood_report' ? "Skip (I don't have this)" : "Skip"}
              </Button>
            )}

            {!isSubmissionStep ? (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNext}
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<Science />}
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{ background: 'linear-gradient(135deg, #1565C0 0%, #00897B 100%)', px: 4 }}
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
