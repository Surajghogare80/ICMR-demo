import React from 'react';
import {
  Box, Typography, Grid, FormControl, InputLabel,
  Select, MenuItem, Stack, Paper, useTheme, IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { FLOW_INTENSITY_OPTIONS } from '../../../constants/index.js';
import { translateOptionValue } from '../../../utils/optionTranslation.js';

const optionLabel = (t, group, value) => translateOptionValue(t, `options.${group}`, value);

const RegularIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="4" width="24" height="20" rx="4" fill="#4299E1" />
    <path d="M 2 16 C 6 16, 8 12, 11 9 C 14 6, 17 9, 15 13 C 14 15, 10 14, 9 17 C 8 20, 12 21, 15 21 C 19 21, 23 18, 26 16 L 26 20 C 26 22.2 24.2 24 22 24 L 6 24 C 3.8 24 2 22.2 2 20 Z" fill="white" />
    <circle cx="17" cy="8" r="1.5" fill="#A3D3F7" />
    <circle cx="21" cy="10" r="1.5" fill="#A3D3F7" />
    <circle cx="12" cy="5" r="1.5" fill="#A3D3F7" />
  </svg>
);

const IrregularIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 3 14 Q 6 19, 9 14 T 15 14 T 21 14 T 27 14" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const AbsentIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="14" cy="14" r="7" stroke="#F43F5E" strokeWidth="4.5" />
  </svg>
);

const REGULARITY_ICONS = { Regular: <RegularIcon />, Irregular: <IrregularIcon />, Absent: <AbsentIcon /> };

const PERIOD_DURATION_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MenstrualHistorySection = ({ formData, updateField }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  const menstrual = formData?.menstrual || {};

  const REGULARITY_OPTIONS = [
    { value: 'Regular', key: 'regular', icon: REGULARITY_ICONS.Regular },
    { value: 'Irregular', key: 'irregular', icon: REGULARITY_ICONS.Irregular },
    { value: 'Absent', key: 'absent', icon: REGULARITY_ICONS.Absent },
  ].map((o) => ({
    ...o,
    title: t(`prediction.menstrual.regularity_options.${o.key}.title`),
    description: t(`prediction.menstrual.regularity_options.${o.key}.description`),
  }));

  const handleRegularitySelect = (value) => {
    updateField('menstrual', 'cycleRegularity', value);
  };

  const handleDurationSelect = (value) => {
    updateField('menstrual', 'periodDuration', value);
  };

  const cardStyle = {
    p: { xs: 1.5, md: 2 }, // Reduced padding by ~20%
    borderRadius: '24px',
    border: '1px solid',
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isDark ? 'none' : '0 10px 40px rgba(0,0,0,0.03)',
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{ width: '100%', py: 1 }}
    >
      {/* Top Section */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#E91E63' }}>
          {t('prediction.menstrual.title')}
        </Typography>
      </Box>

      {/* Main Content - Perfectly Balanced 2x2 Grid */}
      <Box sx={{ width: '100%', px: { xs: 0, sm: 1, md: 2 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5, // Reduced gap between cards
            alignItems: 'stretch',
          }}
        >
          {/* Card 1: Cycle Regularity */}
          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
              {t('prediction.menstrual.regularity_question')}
            </Typography>

            <Stack spacing={1} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              {REGULARITY_OPTIONS.map((option) => {
                const isSelected = menstrual.cycleRegularity === option.value;
                return (
                  <Box
                    key={option.value}
                    component={motion.div}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRegularitySelect(option.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.25,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: isSelected ? '#E91E63' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                      bgcolor: isSelected ? 'rgba(233, 30, 99, 0.08)' : 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{
                      color: isSelected ? '#E91E63' : 'text.secondary',
                      mr: 2,
                      display: 'flex'
                    }}>
                      {option.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: isSelected ? '#E91E63' : 'text.primary', lineHeight: 1.2, mb: 0 }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                        {option.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: isSelected ? '#E91E63' : 'text.disabled',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isSelected ? '#E91E63' : 'transparent',
                        ml: 1,
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isSelected && (
                        <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          {/* Card 2: Period Duration */}
          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: 'center' }}>
              {t('prediction.menstrual.duration_question')}
            </Typography>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Grid container spacing={1} justifyContent="center" sx={{ maxWidth: '340px' }}>
                {PERIOD_DURATION_OPTIONS.map((days) => {
                  const isSelected = Number(menstrual.periodDuration) === days;
                  return (
                    <Grid item key={days}>
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDurationSelect(days)}
                        sx={{
                          width: { xs: 38, sm: 44 },
                          height: { xs: 38, sm: 44 },
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: isSelected ? '#E91E63' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'),
                          bgcolor: isSelected ? '#E91E63' : 'transparent',
                          color: isSelected ? '#fff' : 'text.primary',
                          transition: 'all 0.3s ease',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          boxShadow: isSelected ? '0 8px 20px rgba(233,30,99,0.35)' : 'none',
                        }}
                      >
                        {days}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
              <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mt: 2, fontWeight: 600 }}>
                {t('prediction.menstrual.days_label')}
              </Typography>
            </Box>
          </Paper>

          {/* Card 3: Average Cycle Length */}
          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, textAlign: 'center' }}>
              {t('prediction.menstrual.avg_cycle_length_title')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 'auto', mb: 'auto' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ width: '100%' }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    const current = Number(menstrual.cycleLength) || 28;
                    updateField('menstrual', 'cycleLength', Math.max(15, current - 1));
                  }}
                  sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.6, whiteSpace: 'nowrap', px: 0.5 }}>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#E91E63', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {menstrual.cycleLength || 28}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ whiteSpace: 'nowrap', lineHeight: 1 }}>
                    {t('prediction.menstrual.days_unit')}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    const current = Number(menstrual.cycleLength) || 28;
                    updateField('menstrual', 'cycleLength', Math.min(90, current + 1));
                  }}
                  sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#E91E63', '&:hover': { bgcolor: '#E91E63', color: '#fff' }, width: 34, height: 34, flexShrink: 0 }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Paper>

          {/* Card 4: Flow Intensity */}
          <Paper elevation={0} sx={cardStyle}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, textAlign: 'center' }}>
              {t('prediction.menstrual.flow_intensity_title')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mt: 'auto', mb: 'auto' }}>
              <FormControl fullWidth sx={{ maxWidth: '300px' }}>
                <InputLabel>{t('prediction.menstrual.intensity_label')}</InputLabel>
                <Select
                  value={menstrual.flowIntensity || 'Normal'}
                  label={t('prediction.menstrual.intensity_label')}
                  onChange={(e) => updateField('menstrual', 'flowIntensity', e.target.value)}
                  sx={{ borderRadius: '16px' }}
                >
                  {FLOW_INTENSITY_OPTIONS.map((o) => (
                    <MenuItem key={o} value={o}>{optionLabel(t, 'flowIntensity', o)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

        </Box>
      </Box>
    </Box>
  );
};

export default MenstrualHistorySection;
