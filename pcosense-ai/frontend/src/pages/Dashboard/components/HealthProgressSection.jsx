// src/pages/Dashboard/components/HealthProgressSection.jsx
import { Box, Typography, Grid, LinearProgress, useTheme, alpha } from '@mui/material';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../theme/index.js';
import { formatLocalizedDate } from '../../../utils/localeFormat.js';

// The last N screenings (oldest first) to plot per trend chart, so each
// chart reads as a short, recent history rather than an ever-growing line.
const TREND_DAYS = 5;

// Builds up to TREND_DAYS most-recent-first data points (oldest first) for a
// single personalMetricId field, labelled by the screening's date, so each
// vital/body metric can be trended independently — a prediction missing that
// field just leaves a gap.
const buildMetricTrend = (predictions, key, lang) => (predictions || [])
  .slice(0, TREND_DAYS)
  .reverse()
  .map((p) => {
    const raw = p.personalMetricId?.[key];
    return {
      name: formatLocalizedDate(p.createdAt, lang, { day: 'numeric', month: 'short' }),
      value: raw !== undefined && raw !== null && raw !== '' ? Number(raw) : null,
    };
  });

// Same as buildMetricTrend but for two related fields plotted on one chart
// (e.g. systolic/diastolic blood pressure).
const buildDualMetricTrend = (predictions, key1, key2, lang) => (predictions || [])
  .slice(0, TREND_DAYS)
  .reverse()
  .map((p) => {
    const raw1 = p.personalMetricId?.[key1];
    const raw2 = p.personalMetricId?.[key2];
    return {
      name: formatLocalizedDate(p.createdAt, lang, { day: 'numeric', month: 'short' }),
      value1: raw1 !== undefined && raw1 !== null && raw1 !== '' ? Number(raw1) : null,
      value2: raw2 !== undefined && raw2 !== null && raw2 !== '' ? Number(raw2) : null,
    };
  });

// Same as buildMetricTrend but for a Yes/No field, mapped onto a 0/1 y-axis
// so a categorical result (e.g. insulin resistance) can still be trended.
const buildCategoricalTrend = (predictions, key, lang) => (predictions || [])
  .slice(0, TREND_DAYS)
  .reverse()
  .map((p) => {
    const raw = p.personalMetricId?.[key];
    return {
      name: formatLocalizedDate(p.createdAt, lang, { day: 'numeric', month: 'short' }),
      value: raw === 'Yes' ? 1 : raw === 'No' ? 0 : null,
    };
  });

const MetricTrendTooltip = ({ active, payload, label, metricLabel, unit }) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <Box
        sx={{
          p: 1.2, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid',
          borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {metricLabel}: {payload[0].value}{unit}
        </Typography>
      </Box>
    );
  }
  return null;
};

const MetricTrendChart = ({ title, data, color, unit, emptyMessage }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasEnoughData = data.filter((d) => d.value != null).length > 1;
  const gradientId = `trendGradient-${title.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      {hasEnoughData ? (
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }} />
            <YAxis domain={['auto', 'auto']} width={30} tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }} />
            <Tooltip content={(props) => <MetricTrendTooltip {...props} metricLabel={title} unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              connectNulls
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.disabled" textAlign="center">{emptyMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

const DualMetricTrendTooltip = ({ active, payload, label, title, legend1, legend2, unit }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          p: 1.2, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid',
          borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
        {payload[0]?.value != null && (
          <Typography variant="caption" color="text.secondary" display="block">
            {legend1}: {payload[0].value}{unit}
          </Typography>
        )}
        {payload[1]?.value != null && (
          <Typography variant="caption" color="text.secondary" display="block">
            {legend2}: {payload[1].value}{unit}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

// Plots two related fields (systolic/diastolic blood pressure) as two lines
// on a single chart sharing one y-axis (amount) and x-axis (date).
const DualMetricTrendChart = ({ title, data, color1, color2, legend1, legend2, unit, emptyMessage }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasEnoughData = data.filter((d) => d.value1 != null || d.value2 != null).length > 1;

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      {hasEnoughData ? (
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }} />
            <YAxis domain={['auto', 'auto']} width={30} tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }} />
            <Tooltip content={(props) => <DualMetricTrendTooltip {...props} title={title} legend1={legend1} legend2={legend2} unit={unit} />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="value1" name={legend1} stroke={color1} strokeWidth={2.5} connectNulls dot={{ fill: color1, strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="value2" name={legend2} stroke={color2} strokeWidth={2.5} strokeDasharray="4 3" connectNulls dot={{ fill: color2, strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.disabled" textAlign="center">{emptyMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

const CategoricalTrendTooltip = ({ active, payload, label, metricLabel, yesLabel, noLabel }) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <Box
        sx={{
          p: 1.2, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid',
          borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {metricLabel}: {payload[0].value === 1 ? yesLabel : noLabel}
        </Typography>
      </Box>
    );
  }
  return null;
};

// Plots a Yes/No field (e.g. insulin resistance) on a 0/1 y-axis, with the
// axis ticks relabelled back to Yes/No instead of raw numbers.
const CategoricalTrendChart = ({ title, data, color, yesLabel, noLabel, emptyMessage }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasEnoughData = data.filter((d) => d.value != null).length > 1;

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      {hasEnoughData ? (
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }} />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 1]}
              width={30}
              tickFormatter={(v) => (v === 1 ? yesLabel : noLabel)}
              tick={{ fontSize: 10, fill: isDark ? COLORS.textMutedDark : COLORS.gray }}
            />
            <Tooltip content={(props) => <CategoricalTrendTooltip {...props} metricLabel={title} yesLabel={yesLabel} noLabel={noLabel} />} />
            <Line
              type="stepAfter"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              connectNulls
              dot={{ fill: color, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box sx={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.disabled" textAlign="center">{emptyMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

const MetricBar = ({ label, value, color, max = 100, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color }}>
            {value ?? '—'}{typeof value === 'number' ? '%' : ''}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={typeof value === 'number' ? Math.min((value / max) * 100, 100) : 0}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: isDark ? alpha(color, 0.15) : alpha(color, 0.1),
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
              borderRadius: 4,
            },
          }}
        />
      </Box>
    </motion.div>
  );
};

const HealthProgressSection = ({ predictions }) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const latest = predictions?.[0];

  const bodyMetricCharts = [
    { key: 'bmi', label: t('dashboard.progress.bmiLabel'), color: COLORS.blueDark, unit: '' },
    { key: 'weight', label: t('dashboard.progress.weightLabel'), color: COLORS.tealDeep, unit: ` ${t('units.kg')}` },
    { key: 'waistHipRatio', label: t('dashboard.progress.whrLabel'), color: COLORS.purpleAccent, unit: '' },
  ];

  // Vital/blood-marker trend charts: Haemoglobin, Pulse Rate, Fasting Insulin
  // each plot a single field; Blood Pressure plots systolic+diastolic together;
  // Insulin Resistance plots its Yes/No result on a 0/1 axis.
  const vitalMetricCharts = [
    { key: 'haemoglobin', label: t('dashboard.progress.hemoglobinLabel'), color: COLORS.redMaterial, unit: ' g/dL' },
    { key: 'pulseRate', label: t('dashboard.progress.pulseRateLabel'), color: COLORS.accentRoseDeep, unit: ` ${t('units.bpm')}` },
    { key: 'fastingInsulin', label: t('dashboard.progress.fastingInsulinLabel'), color: COLORS.warning, unit: ' µIU/mL' },
  ];

  const metrics = [
    {
      label: t('dashboard.progress.metrics.riskProbability'),
      value: latest?.probability ?? null,
      // Same 3-band split as the screening result page: low 0-30, moderate 30-60, high 60-100.
      color: latest?.probability >= 60 ? COLORS.riskHigh : latest?.probability >= 30 ? COLORS.riskModerate : COLORS.riskLow,
    },
    { label: t('dashboard.progress.metrics.aiConfidence'), value: latest?.confidence ?? null, color: COLORS.purple },
    { label: t('dashboard.progress.metrics.screeningsCompleted'), value: Math.min(predictions?.length ?? 0, 10) * 10, color: COLORS.secondaryDark, max: 100 },
    { label: t('dashboard.progress.metrics.healthEngagement'), value: Math.min((predictions?.length ?? 0) * 20, 100), color: COLORS.teal },
  ];

  const cardSx = {
    borderRadius: 4,
    p: 3,
    background: isDark ? alpha(theme.palette.background.paper, 0.5) : COLORS.white,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: isDark ? `0 8px 32px ${alpha(COLORS.black, 0.3)}` : '0 4px 24px rgba(233,30,99,0.04)',
    height: '100%',
  };

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>{t('dashboard.progress.heading')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.progress.subtitle')}
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Body metric trend charts: BMI, Weight, Waist-Hip Ratio */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('dashboard.progress.bodyMetricsTitle')}
          </Typography>
        </Grid>
        {bodyMetricCharts.map((m, i) => (
          <Grid item xs={12} sm={6} md={4} key={m.key}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              style={{ height: '100%' }}
            >
              <Box sx={cardSx}>
                <MetricTrendChart
                  title={m.label}
                  data={buildMetricTrend(predictions, m.key, i18n.language)}
                  color={m.color}
                  unit={m.unit}
                  emptyMessage={t('dashboard.progress.emptyMetricChart')}
                />
              </Box>
            </motion.div>
          </Grid>
        ))}

        {/* Vital/blood-marker trend charts: Haemoglobin, Pulse Rate, Blood Pressure, Fasting Insulin, Insulin Resistance */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('dashboard.progress.vitalMetricsTitle')}
          </Typography>
        </Grid>
        {vitalMetricCharts.map((m, i) => (
          <Grid item xs={12} sm={6} md={4} key={m.key}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              style={{ height: '100%' }}
            >
              <Box sx={cardSx}>
                <MetricTrendChart
                  title={m.label}
                  data={buildMetricTrend(predictions, m.key, i18n.language)}
                  color={m.color}
                  unit={m.unit}
                  emptyMessage={t('dashboard.progress.emptyMetricChart')}
                />
              </Box>
            </motion.div>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ height: '100%' }}
          >
            <Box sx={cardSx}>
              <DualMetricTrendChart
                title={t('dashboard.progress.bpLabel')}
                data={buildDualMetricTrend(predictions, 'bpSystolic', 'bpDiastolic', i18n.language)}
                color1={COLORS.blueDarker}
                color2={COLORS.orangeDeep}
                legend1={t('prediction.blood.bp_systolic_label')}
                legend2={t('prediction.blood.bp_diastolic_label')}
                unit={` ${t('units.mmHg')}`}
                emptyMessage={t('dashboard.progress.emptyMetricChart')}
              />
            </Box>
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ height: '100%' }}
          >
            <Box sx={cardSx}>
              <CategoricalTrendChart
                title={t('dashboard.progress.insulinResistanceLabel')}
                data={buildCategoricalTrend(predictions, 'insulinResistance', i18n.language)}
                color={COLORS.purpleDark}
                yesLabel={t('common.yes')}
                noLabel={t('common.no')}
                emptyMessage={t('dashboard.progress.emptyMetricChart')}
              />
            </Box>
          </motion.div>
        </Grid>

        {/* Metric bars */}
        <Grid item xs={12}>
          <Box sx={cardSx}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
              {t('dashboard.progress.metricsTitle')}
            </Typography>
            <Grid container spacing={3}>
              {metrics.map((metric, i) => (
                <Grid item xs={12} sm={6} key={metric.label}>
                  <MetricBar {...metric} index={i} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthProgressSection;
