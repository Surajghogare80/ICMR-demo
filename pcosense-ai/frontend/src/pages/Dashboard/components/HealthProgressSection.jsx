// src/pages/Dashboard/components/HealthProgressSection.jsx
import { Box, Typography, Grid, LinearProgress, useTheme, alpha } from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="caption" fontWeight={700} display="block">{label}</Typography>
        <Typography variant="caption" sx={{ color: '#EC407A' }}>
          Risk: {payload[0]?.value}%
        </Typography>
      </Box>
    );
  }
  return null;
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
      <Box sx={{ mb: 2.5 }}>
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
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Build chart data from predictions (most recent 6, oldest first)
  const chartData = (predictions || [])
    .slice(0, 6)
    .reverse()
    .map((p, i) => ({
      name: `S${i + 1}`,
      risk: p.probability,
    }));

  const latest = predictions?.[0];

  const metrics = [
    {
      label: 'Risk Probability',
      value: latest?.probability ?? null,
      color: latest?.probability > 60 ? '#EF5350' : latest?.probability > 40 ? '#FFA726' : '#66BB6A',
    },
    { label: 'AI Confidence', value: latest?.confidence ?? null, color: '#7E57C2' },
    { label: 'Screenings Completed', value: Math.min(predictions?.length ?? 0, 10) * 10, color: '#EC407A', max: 100 },
    { label: 'Health Engagement', value: Math.min((predictions?.length ?? 0) * 20, 100), color: '#26C6DA' },
  ];

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Health Progress</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track your risk trends and health metrics over time
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                borderRadius: 4,
                p: 3,
                background: isDark ? alpha(theme.palette.background.paper, 0.5) : '#FFFFFF',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDark ? `0 8px 32px ${alpha('#000', 0.3)}` : '0 4px 24px rgba(233,30,99,0.04)',
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
                Risk Trend Over Time
              </Typography>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC407A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EC407A" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? '#C2A9B2' : '#9E9E9E' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: isDark ? '#C2A9B2' : '#9E9E9E' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#EC407A"
                      strokeWidth={2.5}
                      fill="url(#riskGradient)"
                      dot={{ fill: '#EC407A', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#EC407A' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.disabled" textAlign="center">
                    Complete 2+ screenings to see your risk trend chart
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>
        </Grid>

        {/* Metric bars */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              borderRadius: 4,
              p: 3,
              background: isDark ? alpha(theme.palette.background.paper, 0.5) : '#FFFFFF',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: isDark ? `0 8px 32px ${alpha('#000', 0.3)}` : '0 4px 24px rgba(233,30,99,0.04)',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
              Health Metrics
            </Typography>
            {metrics.map((metric, i) => (
              <MetricBar key={metric.label} {...metric} index={i} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HealthProgressSection;
