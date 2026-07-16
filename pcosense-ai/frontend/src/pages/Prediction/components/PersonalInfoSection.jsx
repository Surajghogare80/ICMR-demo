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
    return { status: 'Underweight', color: '#FBC02D', desc: '< 18.5' }; // Yellow
  }
  if (b < 25) {
    return { status: 'Normal', color: '#4CAF50', desc: '18.5 – 24.9' };   // Green
  }
  if (b < 30) {
    return { status: 'Overweight', color: '#FF9800', desc: '25.0 – 29.9' }; // Orange
  }
  return { status: 'Obesity', color: '#F44336', desc: '≥ 30.0' };          // Red
};

// Color & Status helpers for Waist-Hip Ratio
const getWHRInfo = (whr) => {
  const w = Number(whr);
  if (!w || isNaN(w) || w <= 0) {
    return { status: '--', color: '#9E9E9E', desc: 'Enter waist & hip' };
  }
  if (w < 0.80) {
    return { status: 'Healthy', color: '#4CAF50', desc: '< 0.80 Low Risk' };    // Green
  }
  if (w < 0.85) {
    return { status: 'Moderate Risk', color: '#FF9800', desc: '0.80 – 0.84' }; // Orange
  }
  return { status: 'High Risk', color: '#F44336', desc: '≥ 0.85' };            // Red
};

const PersonalInfoSection = ({ formData, setFormData }) => {
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

  // WheelPicker change handlers (convert UI unit choice to canonical kg/cm and update both weightKg and weight)
  const handleWeightPickerChange = (val) => {
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const kgVal = weightUnit === 'lbs'
      ? Number((numVal / 2.20462).toFixed(2))
      : Number(numVal.toFixed(2));
    updateMultiplePersonal({ weightKg: kgVal, weight: kgVal });
  };

  const handleHeightPickerChange = (val) => {
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const cmVal = heightUnit === 'inch'
      ? Number((numVal * 2.54).toFixed(2))
      : Number(numVal.toFixed(2));
    updateMultiplePersonal({ heightCm: cmVal, height: cmVal });
  };

  const handleWaistPickerChange = (val) => {
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const cmVal = waistUnit === 'inch'
      ? Number((numVal * 2.54).toFixed(2))
      : Number(numVal.toFixed(2));
    updateMultiplePersonal({ waistCm: cmVal, waist: cmVal });
  };

  const handleHipPickerChange = (val) => {
    const numVal = Number(val);
    if (isNaN(numVal)) return;
    const cmVal = hipUnit === 'inch'
      ? Number((numVal * 2.54).toFixed(2))
      : Number(numVal.toFixed(2));
    updateMultiplePersonal({ hipCm: cmVal, hip: cmVal });
  };

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
  };

  const bmiInfo = getBMIInfo(personal.bmi);
  const whrInfo = getWHRInfo(personal.waistHipRatio);

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      {/* ==========================================================
          1. AGE SECTION
          Heading: "How old are you?" centered above Age controls.
          No internal borders.
         ========================================================== */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: 'text.primary', textAlign: 'center', mb: 1.5 }}
        >
          {t('how_old_are_you', 'How old are you?')}
        </Typography>

        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}
        >
          {t('age', 'Age')}
        </Typography>

        {/* Selected age large above picker exactly like Weight and Height */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2.5} sx={{ mb: 1.5 }}>
          <IconButton
            size="small"
            onClick={() => updatePersonal('age', Math.max(10, age - 1))}
            disabled={age <= 10}
            sx={{
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              color: '#E91E63',
              width: 38,
              height: 38,
              '&:hover': { bgcolor: '#E91E63', color: '#fff' },
              '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.04)', color: 'text.disabled' },
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Typography
            variant="h3"
            fontWeight={900}
            sx={{ color: '#E91E63', minWidth: '140px', textAlign: 'center', letterSpacing: '-0.5px' }}
          >
            {age}{' '}
            <Typography component="span" variant="h6" fontWeight={700} color="text.secondary">
              {t('years', 'Years')}
            </Typography>
          </Typography>

          <IconButton
            size="small"
            onClick={() => updatePersonal('age', Math.min(60, age + 1))}
            disabled={age >= 60}
            sx={{
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              color: '#E91E63',
              width: 38,
              height: 38,
              '&:hover': { bgcolor: '#E91E63', color: '#fff' },
              '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.04)', color: 'text.disabled' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Wheel Picker */}
        <Box sx={{ width: '100%', maxWidth: '300px' }}>
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

      {/* ==========================================================
          2. WEIGHT & HEIGHT SECTION
          Heading: "What is your weight and height?" centered above row.
          No internal borders.
         ========================================================== */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: 'text.primary', textAlign: 'center', mb: 3.5 }}
        >
          {t('what_is_your_weight_and_height', 'What is your weight and height?')}
        </Typography>

        <Grid container spacing={3} alignItems="stretch">
          {/* WEIGHT COLUMN */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={columnStyle}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '250px', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('weight', 'Weight')}
                  </Typography>
                  <ToggleButtonGroup
                    value={weightUnit}
                    exclusive
                    onChange={(e, val) => handleWeightUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.3, borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' } }}
                  >
                    <ToggleButton value="kg">{t('kg', 'kg')}</ToggleButton>
                    <ToggleButton value="lbs">{t('lbs', 'lbs')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {/* Value + Buttons */}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleWeightStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '135px', textAlign: 'center' }}>
                    {displayedWeight} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(weightUnit)}</Typography>
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleWeightStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Wheel Picker */}
                <Box sx={{ width: '100%', maxWidth: '250px' }}>
                  <WheelPicker
                    value={displayedWeight}
                    onChange={(val) => handleWeightPickerChange(val)}
                    min={weightUnit === 'lbs' ? 44 : 20}
                    max={weightUnit === 'lbs' ? 440 : 200}
                    step={weightUnit === 'lbs' ? 1 : 0.5}
                    unit={t(weightUnit)}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* HEIGHT COLUMN */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={columnStyle}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '250px', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('height', 'Height')}
                  </Typography>
                  <ToggleButtonGroup
                    value={heightUnit}
                    exclusive
                    onChange={(e, val) => handleHeightUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.3, borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {/* Value + Buttons */}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleHeightStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '135px', textAlign: 'center' }}>
                    {displayedHeight} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(heightUnit)}</Typography>
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleHeightStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Wheel Picker */}
                <Box sx={{ width: '100%', maxWidth: '250px' }}>
                  <WheelPicker
                    value={displayedHeight}
                    onChange={(val) => handleHeightPickerChange(val)}
                    min={heightUnit === 'inch' ? 39 : 100}
                    max={heightUnit === 'inch' ? 98 : 250}
                    step={0.5}
                    unit={t(heightUnit)}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* BMI COLUMN (Borderless, aligned beside Weight & Height) */}
          <Grid item xs={12} sm={12} md={4}>
            <Box
              sx={{
                ...columnStyle,
                justifyContent: 'center',
                py: { xs: 2, sm: 3 },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                <FavoriteIcon sx={{ fontSize: 20, color: '#E91E63' }} />
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {t('bmi', 'BMI')}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 2, textAlign: 'center' }}>
                {t('body_mass_index', 'Body Mass Index')}
              </Typography>

              {/* Huge Realtime Numeric BMI */}
              <Box sx={{ my: 2, textAlign: 'center', width: '100%' }}>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  sx={{
                    color: bmiInfo.color,
                    letterSpacing: '-1.5px',
                    lineHeight: 1,
                  }}
                >
                  {personal.bmi || '--'}
                </Typography>
              </Box>

              {/* Color-Coded Status Badge + Scale Helper */}
              <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2.5,
                    py: 0.6,
                    borderRadius: '20px',
                    bgcolor: `${bmiInfo.color}1E`,
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: bmiInfo.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {bmiInfo.status}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block' }}>
                  {bmiInfo.desc}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ==========================================================
          3. WAIST & HIP SECTION
          Heading: "What is your waist and hip size?" centered above row.
          No internal borders.
         ========================================================== */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ color: 'text.primary', textAlign: 'center', mb: 3.5 }}
        >
          {t('what_is_your_waist_and_hip_size', 'What is your waist and hip size?')}
        </Typography>

        <Grid container spacing={3} alignItems="stretch">
          {/* WAIST COLUMN */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={columnStyle}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '250px', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('waist', 'Waist')}
                  </Typography>
                  <ToggleButtonGroup
                    value={waistUnit}
                    exclusive
                    onChange={(e, val) => handleWaistUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.3, borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {/* Value + Buttons */}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleWaistStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '135px', textAlign: 'center' }}>
                    {displayedWaist} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(waistUnit)}</Typography>
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleWaistStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Wheel Picker */}
                <Box sx={{ width: '100%', maxWidth: '250px' }}>
                  <WheelPicker
                    value={displayedWaist}
                    onChange={(val) => handleWaistPickerChange(val)}
                    min={waistUnit === 'inch' ? 15 : 40}
                    max={waistUnit === 'inch' ? 70 : 180}
                    step={0.5}
                    unit={t(waistUnit)}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* HIP COLUMN */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={columnStyle}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', maxWidth: '250px', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {t('hip', 'Hip')}
                  </Typography>
                  <ToggleButtonGroup
                    value={hipUnit}
                    exclusive
                    onChange={(e, val) => handleHipUnitChange(val)}
                    size="small"
                    sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.3, borderRadius: '12px', fontWeight: 700, fontSize: '0.72rem' } }}
                  >
                    <ToggleButton value="cm">{t('cm', 'cm')}</ToggleButton>
                    <ToggleButton value="inch">{t('inch', 'inch')}</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {/* Value + Buttons */}
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ my: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleHipStep(false)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', minWidth: '135px', textAlign: 'center' }}>
                    {displayedHip} <Typography component="span" variant="subtitle1" fontWeight={600} color="text.secondary">{t(hipUnit)}</Typography>
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleHipStep(true)}
                    sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* Wheel Picker */}
                <Box sx={{ width: '100%', maxWidth: '250px' }}>
                  <WheelPicker
                    value={displayedHip}
                    onChange={(val) => handleHipPickerChange(val)}
                    min={hipUnit === 'inch' ? 20 : 50}
                    max={hipUnit === 'inch' ? 80 : 200}
                    step={0.5}
                    unit={t(hipUnit)}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* WAIST-HIP RATIO COLUMN (Borderless, aligned beside Waist & Hip) */}
          <Grid item xs={12} sm={12} md={4}>
            <Box
              sx={{
                ...columnStyle,
                justifyContent: 'center',
                py: { xs: 2, sm: 3 },
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                <MonitorHeartIcon sx={{ fontSize: 20, color: '#E91E63' }} />
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {t('waist_hip_ratio', 'Waist-Hip Ratio')}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 2, textAlign: 'center' }}>
                {t('body_fat_distribution', 'Body Fat Distribution')}
              </Typography>

              {/* Huge Realtime Numeric WHR */}
              <Box sx={{ my: 2, textAlign: 'center', width: '100%' }}>
                <Typography
                  variant="h2"
                  fontWeight={900}
                  sx={{
                    color: whrInfo.color,
                    letterSpacing: '-1.5px',
                    lineHeight: 1,
                  }}
                >
                  {personal.waistHipRatio || '--'}
                </Typography>
              </Box>

              {/* Color-Coded Status Badge + Scale Helper */}
              <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    px: 2.5,
                    py: 0.6,
                    borderRadius: '20px',
                    bgcolor: `${whrInfo.color}1E`,
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: whrInfo.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {whrInfo.status}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block' }}>
                  {whrInfo.desc}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ==========================================================
          4. FAMILY HISTORY SECTION
          No internal borders.
         ========================================================== */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 2,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ mb: 1.5 }}>
          <FamilyRestroomIcon sx={{ fontSize: 26, color: '#E91E63' }} />
          <Typography variant="h5" fontWeight={800} sx={{ color: 'text.primary', textAlign: 'center' }}>
            {t('family_history_of_pcos', 'Family History of PCOS')}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 3 }}>
          {t('does_anyone_in_family_have_pcos', 'Does anyone in your family have PCOS?')}
        </Typography>

        {/* Apple Health / iOS style Pill Toggle Buttons (Yes / No) */}
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

        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ mt: 2.5, letterSpacing: 0.3, fontSize: '0.78rem' }}
        >
          {t('mother_aunt_sister_grandmother_cousin', 'Mother · Aunt · Sister · Grandmother · Cousin')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonalInfoSection;
