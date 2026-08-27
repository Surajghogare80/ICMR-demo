// src/pages/Dashboard/components/AwarenessSection.jsx
import { useState } from 'react';
import {
  Box, Typography, Grid, Chip, useTheme, alpha, Collapse,
} from '@mui/material';
import {
  Info, Warning, PsychologyAlt, LocalHospital,
  SelfImprovement, MedicalServices, ExpandMore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AWARENESS_CARDS = [
  {
    id: 'basics',
    emoji: '🔬',
    icon: <Info sx={{ fontSize: 28 }} />,
    accentColor: '#EC407A',
  },
  {
    id: 'symptoms',
    emoji: '🩺',
    icon: <Warning sx={{ fontSize: 28 }} />,
    accentColor: '#FFA726',
  },
  {
    id: 'myths',
    emoji: '💡',
    icon: <PsychologyAlt sx={{ fontSize: 28 }} />,
    accentColor: '#7E57C2',
  },
  {
    id: 'treatment',
    emoji: '💊',
    icon: <LocalHospital sx={{ fontSize: 28 }} />,
    accentColor: '#66BB6A',
  },
  {
    id: 'lifestyle',
    emoji: '🥗',
    icon: <SelfImprovement sx={{ fontSize: 28 }} />,
    accentColor: '#26C6DA',
  },
  {
    id: 'whenToSeeDoctor',
    emoji: '🏥',
    icon: <MedicalServices sx={{ fontSize: 28 }} />,
    accentColor: '#F06292',
  },
];

const AwarenessCard = ({ card, index }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const title = t(`dashboard.awareness.cards.${card.id}.title`);
  const category = t(`dashboard.awareness.cards.${card.id}.category`);
  const summary = t(`dashboard.awareness.cards.${card.id}.summary`);
  const detail = t(`dashboard.awareness.cards.${card.id}.detail`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ height: '100%' }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            p: 3,
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : '#FFFFFF',
            border: `1px solid ${alpha(card.accentColor, isDark ? 0.2 : 0.1)}`,
            boxShadow: isDark
              ? `0 4px 20px ${alpha('#000', 0.3)}`
              : `0 4px 20px ${alpha(card.accentColor, 0.06)}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top accent line */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${card.accentColor}, ${alpha(card.accentColor, 0.4)})`,
            }}
          />

          {/* Icon area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 0.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: alpha(card.accentColor, isDark ? 0.2 : 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.accentColor,
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Chip
                label={category}
                size="small"
                sx={{
                  mb: 0.5,
                  bgcolor: alpha(card.accentColor, 0.12),
                  color: card.accentColor,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 20,
                }}
              />
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
                {card.emoji} {title}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" lineHeight={1.7} sx={{ flexGrow: 1, mb: 2 }}>
            {summary}
          </Typography>

          <Collapse in={expanded}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                mt: 1,
                mb: 2,
                p: 2,
                bgcolor: alpha(card.accentColor, isDark ? 0.1 : 0.05),
                borderRadius: 2,
                borderLeft: `3px solid ${card.accentColor}`,
                fontSize: '0.82rem',
              }}
            >
              {detail}
            </Typography>
          </Collapse>

          <Box
            onClick={() => setExpanded((e) => !e)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: card.accentColor,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              '&:hover': { opacity: 0.8 },
            }}
            role="button"
            aria-expanded={expanded}
            aria-label={expanded ? t('dashboard.awareness.showLess') : t('dashboard.awareness.readMore')}
          >
            {expanded ? t('dashboard.awareness.showLess') : t('dashboard.awareness.readMore')}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ExpandMore sx={{ fontSize: 18 }} />
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const AwarenessSection = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h5" fontWeight={800}>{t('dashboard.awareness.heading')}</Typography>
          <Chip label={t('dashboard.awareness.badge')} size="small" sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#EC407A', fontWeight: 700, fontSize: '0.7rem' }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.awareness.subtitle')}
        </Typography>
      </motion.div>
      <Grid container spacing={2.5}>
        {AWARENESS_CARDS.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={card.id}>
            <AwarenessCard card={card} index={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AwarenessSection;
