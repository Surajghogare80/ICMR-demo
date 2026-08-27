// src/pages/Dashboard/components/QuickActions.jsx
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, useTheme, alpha } from '@mui/material';
import {
  Science, History, LibraryBooks, Person, BarChart, Settings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/index.js';

const ACTIONS = [
  {
    id: 'startAssessment',
    icon: <Science sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    accentColor: '#EC407A',
    route: ROUTES.PREDICTION,
    featured: true,
  },
  {
    id: 'predictionHistory',
    icon: <History sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #7E57C2, #B39DDB)',
    accentColor: '#7E57C2',
    route: ROUTES.HISTORY,
  },
  {
    id: 'healthLibrary',
    icon: <LibraryBooks sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #26C6DA, #80DEEA)',
    accentColor: '#26C6DA',
    route: ROUTES.DASHBOARD,
  },
  {
    id: 'myProfile',
    icon: <Person sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
    accentColor: '#66BB6A',
    route: ROUTES.PROFILE,
  },
  {
    id: 'reports',
    icon: <BarChart sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #FFA726, #FFD54F)',
    accentColor: '#FFA726',
    route: ROUTES.HISTORY,
    comingSoon: false,
  },
  {
    id: 'settings',
    icon: <Settings sx={{ fontSize: 32 }} />,
    gradient: 'linear-gradient(135deg, #F06292, #F48FB1)',
    accentColor: '#F06292',
    route: ROUTES.PROFILE,
  },
];

const ActionCard = ({ action, index }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const title = t(`dashboard.quickActions.actions.${action.id}.title`);
  const subtitle = t(`dashboard.quickActions.actions.${action.id}.subtitle`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{ height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ height: '100%', cursor: 'pointer' }}
        onClick={() => navigate(action.route)}
        role="button"
        aria-label={title}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            p: { xs: 2.5, md: 3 },
            position: 'relative',
            overflow: 'hidden',
            background: isDark
              ? `linear-gradient(135deg, ${alpha(action.accentColor, 0.15)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`
              : action.featured
              ? action.gradient
              : '#FFFFFF',
            border: `1px solid ${isDark ? alpha(action.accentColor, 0.25) : action.featured ? 'transparent' : alpha(action.accentColor, 0.15)}`,
            boxShadow: action.featured
              ? `0 12px 40px ${alpha(action.accentColor, 0.35)}`
              : isDark
              ? `0 4px 20px ${alpha('#000', 0.3)}`
              : `0 4px 20px ${alpha(action.accentColor, 0.07)}`,
          }}
        >
          {/* Bg glow */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(action.accentColor, action.featured ? 0.25 : 0.1)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Icon */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: action.featured
                ? alpha('#FFF', 0.25)
                : action.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: action.featured ? 'white' : 'white',
              boxShadow: `0 8px 20px ${alpha(action.accentColor, 0.3)}`,
            }}
          >
            {action.icon}
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              color: action.featured ? 'white' : 'text.primary',
              mb: 0.5,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: action.featured ? alpha('#FFF', 0.8) : 'text.secondary',
              fontSize: '0.78rem',
            }}
          >
            {subtitle}
          </Typography>

          {action.comingSoon && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                px: 1.2,
                py: 0.3,
                bgcolor: alpha(action.accentColor, 0.15),
                borderRadius: 10,
                border: `1px solid ${alpha(action.accentColor, 0.3)}`,
              }}
            >
              <Typography sx={{ fontSize: '0.62rem', fontWeight: 700, color: action.accentColor }}>
                {t('dashboard.quickActions.soonBadge')}
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </motion.div>
  );
};

const QuickActions = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>{t('dashboard.quickActions.heading')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.quickActions.subtitle')}
        </Typography>
      </motion.div>
      <Grid container spacing={2.5}>
        {ACTIONS.map((action, i) => (
          <Grid item xs={6} sm={4} md={2} key={action.id}>
            <ActionCard action={action} index={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;
