// src/pages/Dashboard/components/RecentPredictions.jsx
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, LinearProgress, Skeleton,
  useTheme, alpha,
} from '@mui/material';
import {
  Science, ArrowForward, TrendingUp, TrendingDown, CalendarToday,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../constants/index.js';

const getRiskConfig = (result) => {
  if (!result) return { color: '#9E9E9E', label: 'Unknown', gradient: 'linear-gradient(135deg, #9E9E9E, #BDBDBD)' };
  if (result === 'High Risk') return { color: '#EF5350', label: 'High Risk', gradient: 'linear-gradient(135deg, #EF5350, #EF9A9A)' };
  if (result === 'Low Risk') return { color: '#66BB6A', label: 'Low Risk', gradient: 'linear-gradient(135deg, #66BB6A, #A5D6A7)' };
  return { color: '#FFA726', label: result, gradient: 'linear-gradient(135deg, #FFA726, #FFD54F)' };
};

const PredictionRow = ({ prediction, index }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const risk = getRiskConfig(prediction.result);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2.5,
          borderRadius: 3,
          mb: 1.5,
          background: isDark ? alpha(theme.palette.background.paper, 0.5) : alpha(risk.color, 0.03),
          border: `1px solid ${alpha(risk.color, isDark ? 0.2 : 0.1)}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: isDark ? alpha(risk.color, 0.1) : alpha(risk.color, 0.06),
            borderColor: alpha(risk.color, 0.3),
            transform: 'translateX(4px)',
          },
        }}
      >
        {/* Risk icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            background: `${risk.gradient}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${alpha(risk.color, 0.3)}`,
          }}
        >
          {prediction.result === 'High Risk'
            ? <TrendingUp sx={{ color: 'white', fontSize: 20 }} />
            : <TrendingDown sx={{ color: 'white', fontSize: 20 }} />}
        </Box>

        {/* Main info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8, flexWrap: 'wrap' }}>
            <Chip
              label={risk.label}
              size="small"
              sx={{
                bgcolor: alpha(risk.color, isDark ? 0.2 : 0.1),
                color: risk.color,
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 22,
              }}
            />
            <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
              {prediction.probability}% probability
            </Typography>
          </Box>

          {/* Progress bar */}
          <LinearProgress
            variant="determinate"
            value={prediction.probability}
            sx={{
              height: 5,
              borderRadius: 3,
              bgcolor: alpha(risk.color, isDark ? 0.15 : 0.1),
              mb: 0.8,
              '& .MuiLinearProgress-bar': {
                background: risk.gradient,
                borderRadius: 3,
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.disabled" fontWeight={500}>
              {new Date(prediction.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mx: 0.5 }}>•</Typography>
            <Typography variant="caption" color="text.disabled">
              Confidence: {prediction.confidence}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

const RecentPredictions = ({ predictions, isLoading, total }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Recent Predictions</Typography>
            <Typography variant="body2" color="text.secondary">
              {total > 0 ? `${total} total health screenings completed` : 'Your prediction history will appear here'}
            </Typography>
          </Box>
          {total > 0 && (
            <Button
              size="small"
              endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
              onClick={() => navigate(ROUTES.HISTORY)}
              sx={{ fontWeight: 700, color: '#EC407A' }}
            >
              View all
            </Button>
          )}
        </Box>
      </motion.div>

      <Box
        sx={{
          borderRadius: 4,
          p: 3,
          background: isDark ? alpha(theme.palette.background.paper, 0.4) : '#FFFFFF',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: isDark ? `0 8px 32px ${alpha('#000', 0.3)}` : '0 4px 24px rgba(233,30,99,0.04)',
        }}
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2.5 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
                <Skeleton variant="rounded" height={5} sx={{ borderRadius: 3, mb: 0.5 }} />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))
        ) : predictions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(233,30,99,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Science sx={{ fontSize: 40, color: 'rgba(233,30,99,0.4)' }} />
              </Box>
            </motion.div>
            <Typography variant="h6" fontWeight={700} gutterBottom>No predictions yet</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 3, maxWidth: 320, mx: 'auto' }}>
              Start your first PMOS screening to begin tracking your health journey.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.PREDICTION)}
              sx={{
                background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                px: 3,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(233,30,99,0.3)',
              }}
            >
              Start First Screening →
            </Button>
          </Box>
        ) : (
          predictions.map((p, i) => <PredictionRow key={p._id} prediction={p} index={i} />)
        )}
      </Box>
    </Box>
  );
};

export default RecentPredictions;
