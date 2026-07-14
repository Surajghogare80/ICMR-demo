// src/pages/Prediction/components/PersonalInfoSection.jsx
import { useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, IconButton,
  ToggleButton, ToggleButtonGroup, Stack
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Favorite as FavoriteIcon, MonitorHeart as MonitorHeartIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import WheelPicker from '../../../components/ui/WheelPicker.jsx';

// Color-only status helpers (no text labels)
const getBMIColor = (bmi) => {
  const b = Number(bmi);
  if (!b || isNaN(b)) return '#757575';
  if (b < 18.5) return '#2196F3'; // Blue
  if (b < 25) return '#4CAF50';   // Green
  if (b < 30) return '#FF9800';   // Orange
  return '#F44336';               // Red
};

const getWHRColor = (whr) => {
  const w = Number(whr);
  if (!w || isNaN(w)) return '#757575';
  if (w < 0.80) return '#4CAF50'; // Green
  if (w < 0.85) return '#FF9800'; // Orange
  return '#F44336';               // Red
};

const PersonalInfoSection = ({ formData, setFormData, subStep = 1, slideDir = 1 }) => {
  const { t } = useTranslation();
  const personal = formData?.personal || {};

  // Initialize values or fallbacks
  const age = Number(personal.age) || 25;
  const weight = Number(personal.weight) || 60;
  const weightUnit = personal.weightUnit || 'kg';
  const height = Number(personal.height) || 165;
  const heightUnit = personal.heightUnit || 'cm';
  const waist = Number(personal.waist) || 75;
  const waistUnit = personal.waistUnit || 'cm';
  const hip = Number(personal.hip) || 95;
  const hipUnit = personal.hipUnit || 'cm';

  const updatePersonal = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: val,
      },
    }));
  };

  const updateMultiplePersonal = (updates) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        ...updates,
      },
    }));
  };

  // Real-time BMI calculation whenever weight/height change
  useEffect(() => {
    const wKg = weightUnit === 'lbs' ? weight / 2.20462 : weight;
    const hCm = heightUnit === 'inch' ? height * 2.54 : height;
    if (wKg > 0 && hCm > 0) {
      const hM = hCm / 100;
      const calculatedBmi = Number((wKg / (hM * hM)).toFixed(1));
      if (personal.bmi !== calculatedBmi) {
        updatePersonal('bmi', calculatedBmi);
      }
    }
  }, [weight, weightUnit, height, heightUnit]);

  // Real-time WHR calculation whenever waist/hip change
  useEffect(() => {
    const wCm = waistUnit === 'inch' ? waist * 2.54 : waist;
    const hCm = hipUnit === 'inch' ? hip * 2.54 : hip;
    if (wCm > 0 && hCm > 0) {
      const calculatedWhr = Number((wCm / hCm).toFixed(2));
      if (personal.waistHipRatio !== calculatedWhr) {
        updatePersonal('waistHipRatio', calculatedWhr);
      }
    }
  }, [waist, waistUnit, hip, hipUnit]);

  // Unit conversion handlers
  const handleWeightUnitChange = (newUnit) => {
    if (!newUnit || newUnit === weightUnit) return;
    const converted = newUnit === 'lbs'
      ? Number((weight * 2.20462).toFixed(1))
      : Number((weight / 2.20462).toFixed(1));
    updateMultiplePersonal({ weight: converted, weightUnit: newUnit });
  };

  const handleHeightUnitChange = (newUnit) => {
    if (!newUnit || newUnit === heightUnit) return;
    const converted = newUnit === 'inch'
      ? Number((height / 2.54).toFixed(1))
      : Number((height * 2.54).toFixed(1));
    updateMultiplePersonal({ height: converted, heightUnit: newUnit });
  };

  const handleWaistUnitChange = (newUnit) => {
    if (!newUnit || newUnit === waistUnit) return;
    const converted = newUnit === 'inch'
      ? Number((waist / 2.54).toFixed(1))
      : Number((waist * 2.54).toFixed(1));
    updateMultiplePersonal({ waist: converted, waistUnit: newUnit });
  };

  const handleHipUnitChange = (newUnit) => {
    if (!newUnit || newUnit === hipUnit) return;
    const converted = newUnit === 'inch'
      ? Number((hip / 2.54).toFixed(1))
      : Number((hip * 2.54).toFixed(1));
    updateMultiplePersonal({ hip: converted, hipUnit: newUnit });
  };

  // Framer Motion configuration (exact 300ms horizontal slide)
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 240 : -240,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 240 : -240,
      opacity: 0,
    }),
  };

  return (
    <Box sx={{ width: '100%', py: 0 }}>
      {/* Sub-step indicator pill */}
      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            px: 2.5, py: 0.4, borderRadius: '16px',
            bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.15)' : 'rgba(233, 30, 99, 0.08)',
            border: '1px solid', borderColor: 'rgba(233, 30, 99, 0.3)',
          }}
        >
          <Typography variant="caption" fontWeight={700} sx={{ color: '#E91E63', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            {subStep === 1 && `${t('step_1_of_3', 'Step 1 of 3: Age')}`}
            {subStep === 2 && `${t('step_2_of_3', 'Step 2 of 3: Weight & Height')}`}
            {subStep === 3 && `${t('step_3_of_3', 'Step 3 of 3: Waist & Hip')}`}
          </Typography>
        </Box>
      </Box>

      {/* Animated Sub-step Container without any inner border/card and ultra-compact spacing */}
      <Box sx={{ position: 'relative', minHeight: '260px', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={slideDir} mode="wait">
          
          {/* ==========================================================
              SUB-STEP 1: AGE SELECTION
             ========================================================== */}
          {subStep === 1 && (
            <motion.div
              key="substep1_age"
              custom={slideDir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.5 }}>
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: 'text.primary', textAlign: 'center', mb: 0 }}>
                  {t('how_old_are_you', 'How old are you?')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, textAlign: 'center', display: 'block', fontWeight: 600 }}>
                  {t('age_selection', 'Age Selection')} (10 – 60 {t('years', 'years')})
                </Typography>

                {/* Compact Wheel Picker */}
                <Box sx={{ width: '100%', maxWidth: '280px', my: 0.5 }}>
                  <WheelPicker
                    value={age}
                    onChange={(val) => updatePersonal('age', Number(val))}
                    min={10}
                    max={60}
                    step={1}
                    unit={t('years', 'years')}
                  />
                </Box>

                {/* Synchronized Manual Input directly below */}
                <Box sx={{ width: '100%', maxWidth: '240px', mt: 1 }}>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 0.4 }}>
                    {t('or_enter_age_manually', 'Or Enter Age Manually')}
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    size="small"
                    value={age || ''}
                    onChange={(e) => updatePersonal('age', e.target.value ? Number(e.target.value) : '')}
                    inputProps={{ min: 10, max: 60, style: { textAlign: 'center', fontWeight: 700 } }}
                    placeholder="e.g. 25"
                  />
                </Box>
              </Box>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-STEP 2: WEIGHT & HEIGHT
             ========================================================== */}
          {subStep === 2 && (
            <motion.div
              key="substep2_weight_height"
              custom={slideDir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Box sx={{ py: 0 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', textAlign: 'center', mb: 1.5 }}>
                  {t('weight_and_height', 'Weight & Height')}
                </Typography>

                <Grid container spacing={2}>
                  {/* WEIGHT COLUMN - Flat, Borderless, Compact */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ px: 1.5, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '240px', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">{t('weight', 'Weight')}</Typography>
                        <ToggleButtonGroup
                          value={weightUnit}
                          exclusive
                          onChange={(e, val) => handleWeightUnitChange(val)}
                          size="small"
                          sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.2, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                        >
                          <ToggleButton value="kg">{t('kg', 'kg')}</ToggleButton>
                          <ToggleButton value="lbs">{t('lbs', 'lbs')}</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>

                      {/* Value Display + Minus & Plus Buttons */}
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('weight', Number((weight - (weightUnit === 'lbs' ? 1 : 0.5)).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '100px', textAlign: 'center' }}>
                          {weight} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(weightUnit)}</Typography>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('weight', Number((weight + (weightUnit === 'lbs' ? 1 : 0.5)).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* Compact Wheel Picker */}
                      <WheelPicker
                        value={weight}
                        onChange={(val) => updatePersonal('weight', Number(val))}
                        min={weightUnit === 'lbs' ? 44 : 20}
                        max={weightUnit === 'lbs' ? 440 : 200}
                        step={weightUnit === 'lbs' ? 1 : 0.5}
                        unit={t(weightUnit)}
                      />

                      {/* Directly below: Manual Input */}
                      <Box sx={{ width: '100%', maxWidth: '240px', mt: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 0.3, fontSize: '0.72rem' }}>
                          {t('or_enter_weight_manually', 'Or Enter Weight Manually')}
                        </Typography>
                        <TextField
                          fullWidth size="small" type="number"
                          value={weight || ''}
                          onChange={(e) => updatePersonal('weight', e.target.value ? Number(e.target.value) : '')}
                          inputProps={{ step: 'any', style: { textAlign: 'center', fontWeight: 700 } }}
                        />
                      </Box>

                    </Box>
                  </Grid>

                  {/* HEIGHT COLUMN - Flat, Borderless, Compact */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ px: 1.5, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '240px', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">{t('height', 'Height')}</Typography>
                        <ToggleButtonGroup
                          value={heightUnit}
                          exclusive
                          onChange={(e, val) => handleHeightUnitChange(val)}
                          size="small"
                          sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.2, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                        >
                          <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                          <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>

                      {/* Value Display + Minus & Plus Buttons */}
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('height', Number((height - 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '100px', textAlign: 'center' }}>
                          {height} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(heightUnit)}</Typography>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('height', Number((height + 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* Compact Wheel Picker */}
                      <WheelPicker
                        value={height}
                        onChange={(val) => updatePersonal('height', Number(val))}
                        min={heightUnit === 'inch' ? 39 : 100}
                        max={heightUnit === 'inch' ? 98 : 250}
                        step={0.5}
                        unit={t(heightUnit)}
                      />

                      {/* Directly below: Manual Input */}
                      <Box sx={{ width: '100%', maxWidth: '240px', mt: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 0.3, fontSize: '0.72rem' }}>
                          {t('or_enter_height_manually', 'Or Enter Height Manually')}
                        </Typography>
                        <TextField
                          fullWidth size="small" type="number"
                          value={height || ''}
                          onChange={(e) => updatePersonal('height', e.target.value ? Number(e.target.value) : '')}
                          inputProps={{ step: 'any', style: { textAlign: 'center', fontWeight: 700 } }}
                        />
                      </Box>

                    </Box>
                  </Grid>
                </Grid>

                {/* PREMIUM SLEEK BMI CARD (Two-column layout, two-line title with icon, 40-48px right-aligned colored number, hover animation) */}
                <Box
                  sx={{
                    mt: 1.5,
                    py: 1.5,
                    px: { xs: 2.5, sm: 3 },
                    borderRadius: 3,
                    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(233,30,99,0.03)',
                    border: '1px solid',
                    borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(233,30,99,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '360px',
                    mx: 'auto',
                    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.05)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: '#E91E63',
                      boxShadow: (t) => t.palette.mode === 'dark'
                        ? '0 6px 20px rgba(233, 30, 99, 0.25)'
                        : '0 6px 20px rgba(233, 30, 99, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Left Side: Small BMI Icon + Two-line Title ("BMI" bold, "Body Mass Index" lighter) */}
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        borderRadius: 2.5,
                        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.15)' : 'rgba(233, 30, 99, 0.1)',
                        color: '#E91E63',
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          color: 'text.primary',
                          lineHeight: 1.15,
                          letterSpacing: 0.3,
                        }}
                      >
                        {t('bmi', 'BMI')}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{
                          display: 'block',
                          lineHeight: 1.2,
                          mt: 0.2,
                          fontSize: '0.75rem',
                        }}
                      >
                        {t('body_mass_index', 'Body Mass Index')}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Right Side: Large (40-48px) Bold Vertically Centered Right Aligned Color-Coded Numeric Value */}
                  <Typography
                    fontWeight={900}
                    sx={{
                      color: getBMIColor(personal.bmi),
                      fontSize: { xs: '2.4rem', sm: '2.6rem' }, // ~40px to 42px
                      lineHeight: 1,
                      textAlign: 'right',
                      minWidth: '80px',
                      letterSpacing: '-1px',
                    }}
                  >
                    {personal.bmi || '--'}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* ==========================================================
              SUB-STEP 3: WAIST & HIP
             ========================================================== */}
          {subStep === 3 && (
            <motion.div
              key="substep3_waist_hip"
              custom={slideDir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Box sx={{ py: 0 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: 'text.primary', textAlign: 'center', mb: 1.5 }}>
                  {t('waist_and_hip', 'Waist & Hip')}
                </Typography>

                <Grid container spacing={2}>
                  {/* WAIST COLUMN - Flat, Borderless, Compact */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ px: 1.5, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '240px', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">{t('waist', 'Waist')}</Typography>
                        <ToggleButtonGroup
                          value={waistUnit}
                          exclusive
                          onChange={(e, val) => handleWaistUnitChange(val)}
                          size="small"
                          sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.2, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                        >
                          <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                          <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>

                      {/* Value Display + Minus & Plus Buttons */}
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('waist', Number((waist - 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '100px', textAlign: 'center' }}>
                          {waist} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(waistUnit)}</Typography>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('waist', Number((waist + 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* Compact Wheel Picker */}
                      <WheelPicker
                        value={waist}
                        onChange={(val) => updatePersonal('waist', Number(val))}
                        min={waistUnit === 'inch' ? 15 : 40}
                        max={waistUnit === 'inch' ? 70 : 180}
                        step={0.5}
                        unit={t(waistUnit)}
                      />

                      {/* Directly below: Manual Input */}
                      <Box sx={{ width: '100%', maxWidth: '240px', mt: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 0.3, fontSize: '0.72rem' }}>
                          {t('or_enter_waist_manually', 'Or Enter Waist Manually')}
                        </Typography>
                        <TextField
                          fullWidth size="small" type="number"
                          value={waist || ''}
                          onChange={(e) => updatePersonal('waist', e.target.value ? Number(e.target.value) : '')}
                          inputProps={{ step: 'any', style: { textAlign: 'center', fontWeight: 700 } }}
                        />
                      </Box>

                    </Box>
                  </Grid>

                  {/* HIP COLUMN - Flat, Borderless, Compact */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ px: 1.5, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '240px', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">{t('hip', 'Hip')}</Typography>
                        <ToggleButtonGroup
                          value={hipUnit}
                          exclusive
                          onChange={(e, val) => handleHipUnitChange(val)}
                          size="small"
                          sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.2, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                        >
                          <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                          <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>

                      {/* Value Display + Minus & Plus Buttons */}
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('hip', Number((hip - 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '100px', textAlign: 'center' }}>
                          {hip} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(hipUnit)}</Typography>
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updatePersonal('hip', Number((hip + 0.5).toFixed(1)))}
                          sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      {/* Compact Wheel Picker */}
                      <WheelPicker
                        value={hip}
                        onChange={(val) => updatePersonal('hip', Number(val))}
                        min={hipUnit === 'inch' ? 20 : 50}
                        max={hipUnit === 'inch' ? 80 : 200}
                        step={0.5}
                        unit={t(hipUnit)}
                      />

                      {/* Directly below: Manual Input */}
                      <Box sx={{ width: '100%', maxWidth: '240px', mt: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 0.3, fontSize: '0.72rem' }}>
                          {t('or_enter_hip_manually', 'Or Enter Hip Manually')}
                        </Typography>
                        <TextField
                          fullWidth size="small" type="number"
                          value={hip || ''}
                          onChange={(e) => updatePersonal('hip', e.target.value ? Number(e.target.value) : '')}
                          inputProps={{ step: 'any', style: { textAlign: 'center', fontWeight: 700 } }}
                        />
                      </Box>

                    </Box>
                  </Grid>
                </Grid>

                {/* PREMIUM SLEEK WHR CARD (Two-column layout, two-line title with icon, 40-48px right-aligned colored number, hover animation) */}
                <Box
                  sx={{
                    mt: 1.5,
                    py: 1.5,
                    px: { xs: 2.5, sm: 3 },
                    borderRadius: 3,
                    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(233,30,99,0.03)',
                    border: '1px solid',
                    borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(233,30,99,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: '360px',
                    mx: 'auto',
                    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.05)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: '#E91E63',
                      boxShadow: (t) => t.palette.mode === 'dark'
                        ? '0 6px 20px rgba(233, 30, 99, 0.25)'
                        : '0 6px 20px rgba(233, 30, 99, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Left Side: Small WHR Icon + Two-line Title ("Waist-to-Hip Ratio" bold, "Body Fat Distribution" lighter) */}
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        borderRadius: 2.5,
                        bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.15)' : 'rgba(233, 30, 99, 0.1)',
                        color: '#E91E63',
                      }}
                    >
                      <MonitorHeartIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        sx={{
                          color: 'text.primary',
                          lineHeight: 1.15,
                          letterSpacing: 0.3,
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.88rem', sm: '0.96rem' },
                        }}
                      >
                        {t('waist_hip_ratio', 'Waist-to-Hip Ratio')}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{
                          display: 'block',
                          lineHeight: 1.2,
                          mt: 0.2,
                          fontSize: '0.75rem',
                        }}
                      >
                        {t('body_fat_distribution', 'Body Fat Distribution')}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Right Side: Large (40-48px) Bold Vertically Centered Right Aligned Color-Coded Numeric Value */}
                  <Typography
                    fontWeight={900}
                    sx={{
                      color: getWHRColor(personal.waistHipRatio),
                      fontSize: { xs: '2.4rem', sm: '2.6rem' }, // ~40px to 42px
                      lineHeight: 1,
                      textAlign: 'right',
                      minWidth: '80px',
                      letterSpacing: '-1px',
                    }}
                  >
                    {personal.waistHipRatio || '--'}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}

        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default PersonalInfoSection;
