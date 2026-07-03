// src/pages/Prediction/PredictionWizard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Card, CardContent, Typography, Stepper, Step,
  StepLabel, Button, TextField, Grid, FormControl, InputLabel,
  Select, MenuItem, FormControlLabel, Switch, LinearProgress,
  Alert, Chip,
} from '@mui/material';
import { ArrowBack, ArrowForward, Science } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { predictionService } from '../../services/predictionService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { PREDICTION_STEPS, BLOOD_GROUP_OPTIONS, CYCLE_REGULARITY_OPTIONS, FLOW_INTENSITY_OPTIONS, FAST_FOOD_OPTIONS, EXERCISE_OPTIONS, STRESS_OPTIONS } from '../../constants/index.js';
import toast from 'react-hot-toast';

const steps = PREDICTION_STEPS;

const PredictionWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personal: { age: '', weight: '', height: '', bmi: '', bloodGroup: '' },
    menstrual: { cycleLength: '', cycleRegularity: 'Regular', periodDuration: '', flowIntensity: 'Normal' },
    symptoms: { weightGain: false, hairGrowth: false, skinDarkening: false, pimples: false, hairLoss: false },
    lifestyle: { fastFoodFreq: 'Never', exerciseFreq: '1-2 times/week', stressLevel: 'Moderate', sleepHours: '' },
  });

  const progress = ((activeStep) / (steps.length - 1)) * 100;

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

  const validateStep = (step) => {
    if (step === 0) {
      const age = Number(formData.personal.age);
      const weight = Number(formData.personal.weight);
      const height = Number(formData.personal.height);

      if (!formData.personal.age || isNaN(age) || age < 10 || age > 80) {
        toast.error('Age must be between 10 and 80 years.');
        return false;
      }
      if (!formData.personal.weight || isNaN(weight) || weight < 20 || weight > 300) {
        toast.error('Weight must be between 20 and 300 kg.');
        return false;
      }
      if (!formData.personal.height || isNaN(height) || height < 100 || height > 250) {
        toast.error('Height must be between 100 and 250 cm.');
        return false;
      }
    }

    if (step === 1) {
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

    if (step === 3) {
      const sleepHours = formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : null;
      if (sleepHours !== null && (isNaN(sleepHours) || sleepHours < 3 || sleepHours > 12)) {
        toast.error('Sleep hours must be between 3 and 12 hours.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((s) => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        personal: {
          ...formData.personal,
          age: Number(formData.personal.age),
          weight: Number(formData.personal.weight),
          height: Number(formData.personal.height),
          bmi: Number(formData.personal.bmi)
        },
        menstrual: {
          ...formData.menstrual,
          cycleLength: Number(formData.menstrual.cycleLength),
          periodDuration: formData.menstrual.periodDuration ? Number(formData.menstrual.periodDuration) : undefined
        },
        lifestyle: {
          ...formData.lifestyle,
          sleepHours: formData.lifestyle.sleepHours ? Number(formData.lifestyle.sleepHours) : undefined
        }
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
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" fontWeight={700} gutterBottom>Personal Information</Typography></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Age (years)" type="number" value={formData.personal.age} onChange={(e) => updateField('personal', 'age', e.target.value)} inputProps={{ min: 10, max: 80 }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select value={formData.personal.bloodGroup} label="Blood Group" onChange={(e) => updateField('personal', 'bloodGroup', e.target.value)}>
                  {BLOOD_GROUP_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Weight (kg)" type="number" value={formData.personal.weight} onChange={(e) => updateField('personal', 'weight', e.target.value)} inputProps={{ min: 20, max: 300 }} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Height (cm)" type="number" value={formData.personal.height} onChange={(e) => updateField('personal', 'height', e.target.value)} inputProps={{ min: 100, max: 250 }} required />
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

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6" fontWeight={700} gutterBottom>Menstrual History</Typography></Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Average Cycle Length (days)" type="number" value={formData.menstrual.cycleLength} onChange={(e) => updateField('menstrual', 'cycleLength', e.target.value)} inputProps={{ min: 15, max: 90 }} helperText="Days from start of one period to the next (15 - 90 days)" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Period Duration (days)" type="number" value={formData.menstrual.periodDuration} onChange={(e) => updateField('menstrual', 'periodDuration', e.target.value)} inputProps={{ min: 1, max: 15 }} helperText="Days per period (1 - 15 days)" />
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

      case 2:
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
                <Card variant="outlined" sx={{ p: 2, borderColor: formData.symptoms[sym.key] ? 'primary.main' : 'divider', bgcolor: formData.symptoms[sym.key] ? 'primary.50' : 'transparent', transition: 'all 0.2s' }}>
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

      case 3:
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
              <TextField fullWidth label="Sleep Hours per Night" type="number" value={formData.lifestyle.sleepHours} onChange={(e) => updateField('lifestyle', 'sleepHours', e.target.value)} inputProps={{ min: 3, max: 12 }} />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>Review Your Information</Typography>
            <Grid container spacing={2}>
              {[
                { title: '👤 Personal Info', items: [`Age: ${formData.personal.age} yrs`, `Weight: ${formData.personal.weight} kg`, `Height: ${formData.personal.height} cm`, `BMI: ${formData.personal.bmi}`, `Blood Group: ${formData.personal.bloodGroup || 'Not specified'}`] },
                { title: '🩸 Menstrual History', items: [`Cycle Length: ${formData.menstrual.cycleLength} days`, `Regularity: ${formData.menstrual.cycleRegularity}`, `Duration: ${formData.menstrual.periodDuration} days`, `Flow: ${formData.menstrual.flowIntensity}`] },
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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>🧬 PCOS Screening Wizard</Typography>
            <Typography color="text.secondary">Complete all 4 sections for an accurate risk assessment</Typography>
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
              <Step key={s.label}>
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

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep((s) => s - 1)}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            {activeStep < steps.length - 1 ? (
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
                sx={{ background: 'linear-gradient(135deg, #1976D2, #00897B)', px: 4 }}
              >
                {isSubmitting ? 'Analyzing...' : 'Submit & Get Results'}
              </Button>
            )}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PredictionWizard;
