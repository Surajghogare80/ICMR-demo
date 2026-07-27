// src/pages/Dashboard/components/HealthSummaryCards.jsx
import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Avatar, Grid, useTheme, alpha } from '@mui/material';
import {
  Science, TrendingUp, Shield, CalendarToday, Analytics, FavoriteOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const useAnimatedCounter = (target, duration = 1500, delay = 0) => {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (typeof target !== 'number' || isNaN(target)) return;
    startedRef.current = true;
    const timeout = setTimeout(() => {
      const start = Date.now();
      const step = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return value;
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

const StatCard = ({ title, displayValue, rawValue, subtitle, icon, gradient, accentColor, index, suffix = '' }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const numericTarget = typeof rawValue === 'number' ? rawValue : NaN;
  const animated = useAnimatedCounter(numericTarget, 1200, 300 + index * 100);
  const showCounter = !isNaN(numericTarget);

  return (
    <motion.div custom={index} variants={CARD_VARIANTS} initial="hidden" animate="visible" style={{ height: '100%' }}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ height: '100%' }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            p: 3,
            background: isDark
              ? alpha(theme.palette.background.paper, 0.6)
              : '#FFFFFF',
            border: `1px solid ${isDark ? alpha(accentColor, 0.2) : alpha(accentColor, 0.12)}`,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark
              ? `0 8px 32px ${alpha('#000', 0.4)}, 0 0 0 1px ${alpha(accentColor, 0.1)}`
              : `0 4px 24px ${alpha(accentColor, 0.08)}, 0 1px 0 ${alpha(accentColor, 0.05)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background accent */}
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(accentColor, 0.12)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}
              >
                {title}
              </Typography>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{
                  background: gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                {showCounter ? `${animated}${suffix}` : displayValue}
              </Typography>
            </Box>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            >
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  background: gradient,
                  boxShadow: `0 8px 20px ${alpha(accentColor, 0.35)}`,
                }}
              >
                {icon}
              </Avatar>
            </motion.div>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pt: 2,
              borderTop: `1px solid ${alpha(accentColor, 0.1)}`,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const HealthSummaryCards = ({ predictions, total }) => {
  const latestPrediction = predictions?.[0];

  const cards = [
    {
      title: 'Total Screenings',
      displayValue: String(total),
      rawValue: total,
      subtitle: 'All time health assessments',
      icon: <Science sx={{ fontSize: 22, color: 'white' }} />,
      gradient: 'linear-gradient(135deg, #EC407A, #F48FB1)',
      accentColor: '#EC407A',
      suffix: '',
    },
    {
      title: 'Last Assessment',
      displayValue: latestPrediction?.result || '—',
      rawValue: NaN,
      subtitle: latestPrediction
        ? new Date(latestPrediction.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'No assessments yet',
      icon: <TrendingUp sx={{ fontSize: 22, color: 'white' }} />,
      gradient: latestPrediction?.result === 'High Risk'
        ? 'linear-gradient(135deg, #EF5350, #EF9A9A)'
        : 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
      accentColor: latestPrediction?.result === 'High Risk' ? '#EF5350' : '#66BB6A',
      suffix: '',
    },
    {
      title: 'Risk Probability',
      displayValue: latestPrediction ? `${latestPrediction.probability}%` : '—',
      rawValue: latestPrediction ? latestPrediction.probability : NaN,
      subtitle: 'Latest risk probability score',
      icon: <Analytics sx={{ fontSize: 22, color: 'white' }} />,
      gradient: 'linear-gradient(135deg, #FFA726, #FFD54F)',
      accentColor: '#FFA726',
      suffix: '%',
    },
    {
      title: 'Confidence Score',
      displayValue: latestPrediction ? `${latestPrediction.confidence}%` : '—',
      rawValue: latestPrediction ? latestPrediction.confidence : NaN,
      subtitle: 'AI model confidence level',
      icon: <Shield sx={{ fontSize: 22, color: 'white' }} />,
      gradient: 'linear-gradient(135deg, #7E57C2, #B39DDB)',
      accentColor: '#7E57C2',
      suffix: '%',
    },
    {
      title: 'Last Assessment Date',
      displayValue: latestPrediction
        ? new Date(latestPrediction.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : '—',
      rawValue: NaN,
      subtitle: 'Most recent screening date',
      icon: <CalendarToday sx={{ fontSize: 22, color: 'white' }} />,
      gradient: 'linear-gradient(135deg, #26C6DA, #80DEEA)',
      accentColor: '#26C6DA',
      suffix: '',
    },
    {
      title: 'Health Journey',
      displayValue: total > 0 ? 'Active' : 'Start Now',
      rawValue: NaN,
      subtitle: total > 0 ? `${total} screenings completed` : 'Begin your health tracking',
      icon: <FavoriteOutlined sx={{ fontSize: 22, color: 'white' }} />,
      gradient: 'linear-gradient(135deg, #F06292, #F48FB1)',
      accentColor: '#F06292',
      suffix: '',
    },
  ];

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
          Health Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your latest health metrics at a glance
        </Typography>
      </motion.div>

      <Grid container spacing={2.5}>
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <StatCard {...card} index={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthSummaryCards;
