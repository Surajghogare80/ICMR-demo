// src/pages/Dashboard/components/HealthTipsCarousel.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const HEALTH_TIPS = [
  { emoji: '💧', title: 'Stay Hydrated', tip: 'Drink at least 8 glasses of water daily. Proper hydration helps regulate hormones and supports kidney health — essential for managing PCOS.', color: '#26C6DA' },
  { emoji: '🥗', title: 'Eat Balanced Meals', tip: 'Focus on a low-glycemic diet rich in whole grains, lean protein, leafy greens, and healthy fats. This helps control insulin — a key factor in PCOS.', color: '#66BB6A' },
  { emoji: '🏃', title: 'Exercise Regularly', tip: 'Aim for at least 30 minutes of moderate exercise most days. Regular movement reduces insulin resistance and helps manage weight with PCOS.', color: '#FFA726' },
  { emoji: '😴', title: 'Prioritize Sleep', tip: 'Quality sleep of 7–8 hours supports hormone regulation and metabolism. Poor sleep can worsen insulin resistance and PCOS symptoms.', color: '#7E57C2' },
  { emoji: '🧘', title: 'Reduce Stress', tip: 'Chronic stress elevates cortisol, which can worsen PCOS symptoms. Practice mindfulness, yoga, or deep breathing exercises daily.', color: '#F06292' },
  { emoji: '🚫', title: 'Limit Processed Foods', tip: 'Ultra-processed foods and added sugars can spike insulin levels and worsen hormonal imbalances. Choose whole, unprocessed foods whenever possible.', color: '#EF5350' },
  { emoji: '🌿', title: 'Consider Anti-Inflammatory Foods', tip: 'Foods like berries, leafy greens, fatty fish, and turmeric have anti-inflammatory properties that may help reduce PCOS-related inflammation.', color: '#66BB6A' },
  { emoji: '☀️', title: 'Get Vitamin D', tip: 'Many women with PCOS have low Vitamin D levels. Spend 15-20 minutes in sunlight daily and consider testing your levels with your doctor.', color: '#FFA726' },
];

const HealthTipsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tip = HEALTH_TIPS[current];

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % HEALTH_TIPS.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>Daily Health Tips</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Science-backed tips rotating every few seconds
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
                  {tip.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.8} sx={{ maxWidth: 600 }}>
                  {tip.tip}
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
                aria-label={`Tip ${i + 1}`}
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
