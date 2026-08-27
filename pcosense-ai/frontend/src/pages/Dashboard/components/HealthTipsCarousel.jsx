// src/pages/Dashboard/components/HealthTipsCarousel.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HEALTH_TIPS = [
  { id: 'hydrate', emoji: '💧', color: '#26C6DA' },
  { id: 'balancedMeals', emoji: '🥗', color: '#66BB6A' },
  { id: 'exercise', emoji: '🏃', color: '#FFA726' },
  { id: 'sleep', emoji: '😴', color: '#7E57C2' },
  { id: 'stress', emoji: '🧘', color: '#F06292' },
  { id: 'processedFoods', emoji: '🚫', color: '#EF5350' },
  { id: 'antiInflammatory', emoji: '🌿', color: '#66BB6A' },
  { id: 'vitaminD', emoji: '☀️', color: '#FFA726' },
];

const HealthTipsCarousel = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tip = HEALTH_TIPS[current];
  const tipTitle = t(`dashboard.tips.items.${tip.id}.title`);
  const tipText = t(`dashboard.tips.items.${tip.id}.tip`);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % HEALTH_TIPS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>{t('dashboard.tips.heading')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.tips.subtitle')}
        </Typography>
      </motion.div>

      <Box
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: isDark
            ? alpha(theme.palette.background.paper, 0.6)
            : '#FFFFFF',
          border: `1px solid ${alpha(tip.color, isDark ? 0.25 : 0.15)}`,
          boxShadow: isDark
            ? `0 8px 32px ${alpha('#000', 0.4)}`
            : `0 8px 32px ${alpha(tip.color, 0.1)}`,
          position: 'relative',
          minHeight: 180,
        }}
      >
        {/* Accent bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bar-${current}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${tip.color}, ${alpha(tip.color, 0.4)})`,
              transformOrigin: 'left',
            }}
          />
        </AnimatePresence>

        <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          {/* Emoji icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`emoji-${current}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  bgcolor: alpha(tip.color, isDark ? 0.2 : 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                  border: `2px solid ${alpha(tip.color, 0.2)}`,
                }}
              >
                {tip.emoji}
              </Box>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <Box sx={{ flexGrow: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ color: tip.color, mb: 1 }}
                >
                  {tipTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ maxWidth: 600 }}>
                  {tipText}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        {/* Progress dots and counter */}
        <Box sx={{ px: { xs: 3, md: 4 }, pb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 0.8 }}>
            {HEALTH_TIPS.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                role="button"
                aria-label={t('dashboard.tips.dotAriaLabel', { number: i + 1 })}
                sx={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: i === current ? tip.color : alpha(tip.color, 0.3),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
            {current + 1} / {HEALTH_TIPS.length}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HealthTipsCarousel;
