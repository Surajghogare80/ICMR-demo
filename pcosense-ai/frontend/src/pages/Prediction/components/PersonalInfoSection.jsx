// src/pages/Prediction/components/PersonalInfoSection.jsx
import { useEffect } from 'react';
import {
  Box, Typography, Grid, IconButton,
  ToggleButton, ToggleButtonGroup, Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  MonitorHeart as MonitorHeartIcon,
  FamilyRestroom as FamilyRestroomIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import WheelPicker from '../../../components/ui/WheelPicker.jsx';

// Color & Status helpers for BMI
const getBMIInfo = (bmi) => {
  const b = Number(bmi);
  if (!b || isNaN(b) || b <= 0) {
    return { status: '--', color: '#9E9E9E', desc: 'Enter weight & height' };
  }
  if (b < 18.5) {
    return { status: 'Underweight', color: '#2196F3', desc: '≤ 18.4' }; // Blue
  }
  if (b < 25) {
    return { status: 'Normal', color: '#4CAF50', desc: '18.5 – 24.9' };   // Green
  }
  return { status: 'Overweight / Obese', color: '#FF9800', desc: '≥ 25.0' }; // Orange
};

// Color & Status helpers for Waist-Hip Ratio
const getWHRInfo = (whr) => {
  const w = Number(whr);
  if (!w || isNaN(w) || w <= 0) {
    return { status: '--', color: '#9E9E9E', desc: 'Enter waist & hip' };
  }
  if (w < 0.80) {
    return { status: 'Low', color: '#4CAF50', desc: '< 0.80 Low Risk' };    // Green
  }
  if (w < 0.85) {
    return { status: 'Moderate', color: '#FF9800', desc: '0.80 – 0.84 Moderate Risk' }; // Orange
  }
  return { status: 'High', color: '#F44336', desc: '≥ 0.85 High Risk' };            // Red
};

const PersonalInfoSection = ({ formData, setFormData, subStep = 1 }) => {
  const { t } = useTranslation();
  const personal = formData?.personal || {};
  const menstrual = formData?.menstrual || {};

  // Canonical values in kg/cm (always stored inside both weightKg/weight, heightCm/height, etc. for exact consistency across UI and backend)
  const age = Number(personal.age) || 25;
  const weightKg = Number(personal.weightKg ?? personal.weight) || 60;
  const weightUnit = personal.weightUnit || 'kg';
  const heightCm = Number(personal.heightCm ?? personal.height) || 165;
  const heightUnit = personal.heightUnit || 'cm';
  const waistCm = Number(personal.waistCm ?? personal.waist) || 75;
  const waistUnit = personal.waistUnit || 'cm';
  const hipCm = Number(personal.hipCm ?? personal.hip) || 95;
  const hipUnit = personal.hipUnit || 'cm';

  // Family history (default No / false, kept in both personal and menstrual for seamless backend sync)
  const familyHistory = menstrual.familyHistory !== undefined
    ? menstrual.familyHistory
    : (personal.familyHistory !== undefined ? personal.familyHistory : false);

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

  const handleFamilyHistoryChange = (boolVal) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...(prev.personal || {}), familyHistory: boolVal },
      menstrual: { ...(prev.menstrual || {}), familyHistory: boolVal },
    }));
  };

  useEffect(() => {
    // Ensure both canonical kg/cm and legacy keys are initialized and synchronized on mount
    const updates = {};
    if (!personal.age) updates.age = 25;

    const initWeightKg = Number(personal.weightKg ?? (personal.weight && (personal.weightUnit === 'lbs' ? personal.weight / 2.20462 : personal.weight))) || 60;
    if (personal.weightKg !== initWeightKg || personal.weight !== initWeightKg) {
      updates.weightKg = Number(initWeightKg.toFixed(2));
      updates.weight = Number(initWeightKg.toFixed(2));
    }
    if (!personal.weightUnit) updates.weightUnit = 'kg';

    const initHeightCm = Number(personal.heightCm ?? (personal.height && (personal.heightUnit === 'inch' ? personal.height * 2.54 : personal.height))) || 165;
    if (personal.heightCm !== initHeightCm || personal.height !== initHeightCm) {
      updates.heightCm = Number(initHeightCm.toFixed(2));
      updates.height = Number(initHeightCm.toFixed(2));
    }
    if (!personal.heightUnit) updates.heightUnit = 'cm';

    const initWaistCm = Number(personal.waistCm ?? (personal.waist && (personal.waistUnit === 'inch' ? personal.waist * 2.54 : personal.waist))) || 75;
    if (personal.waistCm !== initWaistCm || personal.waist !== initWaistCm) {
      updates.waistCm = Number(initWaistCm.toFixed(2));
      updates.waist = Number(initWaistCm.toFixed(2));
    }
    if (!personal.waistUnit) updates.waistUnit = 'cm';

    const initHipCm = Number(personal.hipCm ?? (personal.hip && (personal.hipUnit === 'inch' ? personal.hip * 2.54 : personal.hip))) || 95;
    if (personal.hipCm !== initHipCm || personal.hip !== initHipCm) {
      updates.hipCm = Number(initHipCm.toFixed(2));
      updates.hip = Number(initHipCm.toFixed(2));
    }
    if (!personal.hipUnit) updates.hipUnit = 'cm';

    if (personal.familyHistory === undefined) updates.familyHistory = false;

    if (Object.keys(updates).length > 0) {
      updateMultiplePersonal(updates);
    }
  }, []);

  // Real-time BMI calculation whenever canonical weightKg/heightCm change
  useEffect(() => {
    if (weightKg > 0 && heightCm > 0) {
      const hM = heightCm / 100;
      const calculatedBmi = Number((weightKg / (hM * hM)).toFixed(1));
      if (personal.bmi !== calculatedBmi) {
        updatePersonal('bmi', calculatedBmi);
      }
    }
  }, [weightKg, heightCm]);

  // Real-time WHR calculation whenever canonical waistCm/hipCm change
  useEffect(() => {
    if (waistCm > 0 && hipCm > 0) {
      const calculatedWhr = Number((waistCm / hipCm).toFixed(2));
      if (personal.waistHipRatio !== calculatedWhr) {
        updatePersonal('waistHipRatio', calculatedWhr);
      }
    }
  }, [waistCm, hipCm]);

  // Unit conversion handlers: DO NOT modify stored canonical values. Only convert for display.
  const handleWeightUnitChange = (newUnit) => {
    if (!newUnit || newUnit === weightUnit) return;
    updateMultiplePersonal({ weightUnit: newUnit });
  };

  const handleHeightUnitChange = (newUnit) => {
    if (!newUnit || newUnit === heightUnit) return;
    updateMultiplePersonal({ heightUnit: newUnit });
  };

  const handleWaistUnitChange = (newUnit) => {
    if (!newUnit || newUnit === waistUnit) return;
    updateMultiplePersonal({ waistUnit: newUnit });
  };

  const handleHipUnitChange = (newUnit) => {
    if (!newUnit || newUnit === hipUnit) return;
    updateMultiplePersonal({ hipUnit: newUnit });
  };

  // Display conversions (purely UI formatting from canonical storage)
  const displayedWeight = weightUnit === 'lbs' ? Number((weightKg * 2.20462).toFixed(2)) : Number(weightKg.toFixed(2));
  const displayedHeight = heightUnit === 'inch' ? Number((heightCm / 2.54).toFixed(2)) : Number(heightCm.toFixed(2));
  const displayedWaist = waistUnit === 'inch' ? Number((waistCm / 2.54).toFixed(2)) : Number(waistCm.toFixed(2));
  const displayedHip = hipUnit === 'inch' ? Number((hipCm / 2.54).toFixed(2)) : Number(hipCm.toFixed(2));

  // Plus/Minus step handlers
  const handleWeightStep = (isPlus) => {
    if (weightUnit === 'lbs') {
      const newLbs = isPlus
        ? Math.min(440, displayedWeight + 1)
        : Math.max(44, displayedWeight - 1);
      const kgVal = Number((newLbs / 2.20462).toFixed(2));
      updateMultiplePersonal({ weightKg: kgVal, weight: kgVal });
    } else {
      const newKg = isPlus
        ? Math.min(200, weightKg + 0.5)
        : Math.max(20, weightKg - 0.5);
      const kgVal = Number(newKg.toFixed(2));
      updateMultiplePersonal({ weightKg: kgVal, weight: kgVal });
    }
  };

  const handleHeightStep = (isPlus) => {
    if (heightUnit === 'inch') {
      const newInch = isPlus
        ? Math.min(98, displayedHeight + 0.5)
        : Math.max(39, displayedHeight - 0.5);
      const cmVal = Number((newInch * 2.54).toFixed(2));
      updateMultiplePersonal({ heightCm: cmVal, height: cmVal });
    } else {
      const newCm = isPlus
        ? Math.min(250, heightCm + 0.5)
        : Math.max(100, heightCm - 0.5);
      const cmVal = Number(newCm.toFixed(2));
      updateMultiplePersonal({ heightCm: cmVal, height: cmVal });
    }
  };

  const handleWaistStep = (isPlus) => {
    if (waistUnit === 'inch') {
      const newInch = isPlus
        ? Math.min(70, displayedWaist + 0.5)
        : Math.max(15, displayedWaist - 0.5);
      const cmVal = Number((newInch * 2.54).toFixed(2));
      updateMultiplePersonal({ waistCm: cmVal, waist: cmVal });
    } else {
      const newCm = isPlus
        ? Math.min(180, waistCm + 0.5)
        : Math.max(40, waistCm - 0.5);
      const cmVal = Number(newCm.toFixed(2));
      updateMultiplePersonal({ waistCm: cmVal, waist: cmVal });
    }
  };

  const handleHipStep = (isPlus) => {
    if (hipUnit === 'inch') {
      const newInch = isPlus
        ? Math.min(80, displayedHip + 0.5)
        : Math.max(20, displayedHip - 0.5);
      const cmVal = Number((newInch * 2.54).toFixed(2));
      updateMultiplePersonal({ hipCm: cmVal, hip: cmVal });
    } else {
      const newCm = isPlus
        ? Math.min(200, hipCm + 0.5)
        : Math.max(50, hipCm - 0.5);
      const cmVal = Number(newCm.toFixed(2));
      updateMultiplePersonal({ hipCm: cmVal, hip: cmVal });
    }
  };

  // Shared borderless column layout style
  const columnStyle = {
    p: { xs: 1.5, sm: 2 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: { xs: '115px', md: '125px' },
  };

  const bmiInfo = getBMIInfo(personal.bmi);
  const whrInfo = getWHRInfo(personal.waistHipRatio);

  return (
    <Box sx={{ width: '100%' }}>
      {subStep === 1 ? (
        /* ==========================================================
           INTERNAL STEP 1 OF 2: Age & Family History
           (Begins directly with section heading, no internal header, no inside buttons)
           ========================================================== */
        <Box sx={{ py: 1 }}>
          {/* Age Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ color: 'text.primary', textAlign: 'center', mb: 2 }}
            >
              {t('how_old_are_you', 'How old are you?')}
            </Typography>

            {/* Wheel Picker (~20% smaller via scaled container, overflow visible so border is never cut) */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '260px',
                height: '202px',
                overflow: 'visible',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 1,
              }}
            >
              <Box sx={{ width: '300px', transform: 'scale(0.8)', transformOrigin: 'center center' }}>
                <WheelPicker
                  value={age}
                  onChange={(val) => updatePersonal('age', Number(val))}
                  min={10}
                  max={60}
                  step={1}
                  unit={t('years', 'Years')}
                />
              </Box>
            </Box>
          </Box>

          {/* Family History Section */}
          <Box
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: '20px',
              bgcolor: 'rgba(233, 30, 99, 0.03)',
              border: '1px solid rgba(233, 30, 99, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '480px',
              mx: 'auto',
              mb: 1,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <FamilyRestroomIcon sx={{ fontSize: 24, color: '#E91E63' }} />
              <Typography variant="h6" fontWeight={800} color="text.primary">
                {t('family_history_of_pcos', 'Family History of PCOS')}
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2.5 }}>
              {t('mother_aunt_sister_grandmother_cousin', 'Mother / Aunt / Sister / Cousin / Grandmother')}
            </Typography>

            {/* Yes / No Toggle */}
            <ToggleButtonGroup
              value={familyHistory ? 'yes' : 'no'}
              exclusive
              onChange={(_, val) => {
                if (val !== null) {
                  handleFamilyHistoryChange(val === 'yes');
                }
              }}
              sx={{
                gap: 2,
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
              }}
            >
              <ToggleButton value="yes">{t('yes', 'Yes')}</ToggleButton>
              <ToggleButton value="no">{t('no', 'No')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      ) : (
        /* ==========================================================
           INTERNAL STEP 2 OF 2: Personal Health Measurements
           (Begins directly with section heading, no internal header, no inside buttons)
           ========================================================== */
        <Box sx={{ py: 1 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ color: 'text.primary', textAlign: 'center', mb: 3 }}
          >
            {t('personal_health_measurements', 'Personal Health Measurements')}
          </Typography>

          {/* Row 1: Weight | Height | BMI Card */}
          <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
            {/* WEIGHT COLUMN */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={columnStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '220px', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('weight', 'Weight')}
                  </Typography>
                  <ToggleButtonGroup
                    value={weightUnit}
                    exclusive
                    onChange={(e, val) => handleWeightUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.1, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                  >
                    <ToggleButton value="kg">{t('kg', 'kg')}</ToggleButton>
                    <ToggleButton value="lbs">{t('lbs', 'lbs')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ my: 'auto', py: 0.5, width: '100%' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleWeightStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.6, whiteSpace: 'nowrap', px: 0.5 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {displayedWeight}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                      {t(weightUnit)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleWeightStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            {/* HEIGHT COLUMN */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={columnStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '220px', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('height', 'Height')}
                  </Typography>
                  <ToggleButtonGroup
                    value={heightUnit}
                    exclusive
                    onChange={(e, val) => handleHeightUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.1, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ my: 'auto', py: 0.5, width: '100%' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleHeightStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.6, whiteSpace: 'nowrap', px: 0.5 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {displayedHeight}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                      {t(heightUnit)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleHeightStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            {/* BMI COLUMN */}
            <Grid item xs={12} sm={12} md={4}>
              <Box
                sx={{
                  ...columnStyle,
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.8} sx={{ width: '100%', mb: 0.5 }}>
                  {/* <FavoriteIcon sx={{ fontSize: 18, color: '#E91E63' }} /> */}
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('bmi', 'BMI')} · {t('body_mass_index', 'Body Mass Index')}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ my: 'auto', py: 0.5 }}>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ whiteSpace: 'nowrap' }}>
                    {Number(personal.bmi) > 0 ? Number(personal.bmi).toFixed(1) : '--'}
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '16px',
                      bgcolor: `${bmiInfo.color}15`,
                      border: `1px solid ${bmiInfo.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: bmiInfo.color, whiteSpace: 'nowrap' }}>
                      {bmiInfo.status}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, textAlign: 'center' }}>
                  {bmiInfo.desc}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Row 2: Waist | Hip | Waist-to-Hip Ratio Card */}
          <Grid container spacing={2} alignItems="stretch" sx={{ mb: 1 }}>
            {/* WAIST COLUMN */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={columnStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '220px', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('waist', 'Waist')}
                  </Typography>
                  <ToggleButtonGroup
                    value={waistUnit}
                    exclusive
                    onChange={(e, val) => handleWaistUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.1, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ my: 'auto', py: 0.5, width: '100%' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleWaistStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.6, whiteSpace: 'nowrap', px: 0.5 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {displayedWaist}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                      {t(waistUnit)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleWaistStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            {/* HIP COLUMN */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={columnStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '220px', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('hip', 'Hip')}
                  </Typography>
                  <ToggleButtonGroup
                    value={hipUnit}
                    exclusive
                    onChange={(e, val) => handleHipUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.2, px: 1.1, borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ my: 'auto', py: 0.5, width: '100%' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleHipStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.6, whiteSpace: 'nowrap', px: 0.5 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1, whiteSpace: 'nowrap' }}>
                      {displayedHip}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                      {t(hipUnit)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleHipStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            {/* WAIST-HIP RATIO COLUMN */}
            <Grid item xs={12} sm={12} md={4}>
              <Box
                sx={{
                  ...columnStyle,
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.8} sx={{ width: '100%', mb: 0.5 }}>
                  {/* <MonitorHeartIcon sx={{ fontSize: 18, color: '#E91E63' }} /> */}
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('waist_hip_ratio', 'WHR')} · {t('body_fat_distribution', 'Ratio')}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ my: 'auto', py: 0.5 }}>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ whiteSpace: 'nowrap' }}>
                    {Number(personal.waistHipRatio) > 0 ? Number(personal.waistHipRatio).toFixed(2) : '--'}
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: '16px',
                      bgcolor: `${whrInfo.color}15`,
                      border: `1px solid ${whrInfo.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: whrInfo.color, whiteSpace: 'nowrap' }}>
                      {whrInfo.status}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, textAlign: 'center' }}>
                  {whrInfo.desc}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PersonalInfoSection;
