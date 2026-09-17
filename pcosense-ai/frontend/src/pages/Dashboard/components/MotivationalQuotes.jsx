// src/pages/Dashboard/components/MotivationalQuotes.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../../config/appConfig.js';
import { COLORS } from '../../../theme/index.js';

const QUOTES = [
  { id: 'habits', authorKey: null, color: COLORS.secondaryDark },
  { id: 'awareness', authorKey: 'womensHealth', color: COLORS.purple },
  { id: 'selfCare', authorKey: 'wellness', color: COLORS.teal },
  { id: 'uniqueJourney', authorKey: null, color: COLORS.success },
  { id: 'empowered', authorKey: 'womensHealth', color: COLORS.orange },
  { id: 'progress', authorKey: 'wellness', color: COLORS.accent },
];

const MotivationalQuotes = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const quote = QUOTES[current];
  const quoteText = t(`dashboard.quotes.items.${quote.id}`);
  const quoteAuthor = quote.authorKey ? t(`dashboard.quotes.authors.${quote.authorKey}`) : APP_NAME;

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        mb: 5,
        borderRadius: 4,
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? `linear-gradient(135deg, ${alpha(quote.color, 0.15)} 0%, ${alpha(COLORS.darkBg, 0.8)} 100%)`
          : `linear-gradient(135deg, ${alpha(quote.color, 0.06)} 0%, ${alpha(quote.color, 0.02)} 100%)`,
        border: `1px solid ${alpha(quote.color, isDark ? 0.25 : 0.12)}`,
      }}
    >
      {/* Background blur orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(quote.color, 0.15)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(quote.color, 0.1)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'inline-block', marginBottom: 16 }}
      >
        <FormatQuote sx={{ fontSize: 48, color: alpha(quote.color, 0.5) }} />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              color: isDark ? COLORS.white : COLORS.textDark,
              lineHeight: 1.6,
              fontStyle: 'italic',
              mb: 2,
              maxWidth: 640,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            "{quoteText}"
          </Typography>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: quote.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            — {quoteAuthor}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 3 }}>
        {QUOTES.map((_, i) => (
          <Box
            key={i}
            onClick={() => setCurrent(i)}
            role="button"
            aria-label={t('dashboard.quotes.dotAriaLabel', { number: i + 1 })}
            sx={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 3,
              bgcolor: i === current ? quote.color : alpha(quote.color, 0.3),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MotivationalQuotes;
