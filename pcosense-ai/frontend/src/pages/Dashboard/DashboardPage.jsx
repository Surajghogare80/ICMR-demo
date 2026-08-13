// src/pages/Dashboard/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Avatar, Chip, useTheme, alpha,
} from '@mui/material';
import {
  ArrowForward, Favorite, WbSunny, NightsStay, WbCloudy,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { predictionService } from '../../services/predictionService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';

// Sub-components
import HeroSlider from './components/HeroSlider.jsx';
import HealthSummaryCards from './components/HealthSummaryCards.jsx';
import QuickActions from './components/QuickActions.jsx';
import AwarenessSection from './components/AwarenessSection.jsx';
import HealthTipsCarousel from './components/HealthTipsCarousel.jsx';
import MotivationalQuotes from './components/MotivationalQuotes.jsx';
import RecentPredictions from './components/RecentPredictions.jsx';
import HealthArticles from './components/HealthArticles.jsx';
import HealthProgressSection from './components/HealthProgressSection.jsx';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: WbSunny, color: '#FFA726' };
  if (h < 18) return { text: 'Good afternoon', Icon: WbCloudy, color: '#26C6DA' };
  return { text: 'Good evening', Icon: NightsStay, color: '#7E57C2' };
};

// Floating decorative blob
const Blob = ({ sx }) => (
  <Box
    sx={{
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      filter: 'blur(60px)',
      ...sx,
    }}
  />
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const { data: predictionsData, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => predictionService.getAll({ page: 1, limit: 6 }),
  });

  const predictions = predictionsData?.data?.predictions || [];
  const total = predictionsData?.data?.total || 0;

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Global decorative background blobs */}
      <Blob
        sx={{
          width: 500,
          height: 500,
          top: -100,
          right: -150,
          background: isDark
            ? 'radial-gradient(circle, rgba(233,30,99,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(233,30,99,0.06) 0%, transparent 70%)',
        }}
      />
      <Blob
        sx={{
          width: 400,
          height: 400,
          bottom: 200,
          left: -100,
          background: isDark
            ? 'radial-gradient(circle, rgba(126,87,194,0.07) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(126,87,194,0.04) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* ── Welcome Banner ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            sx={{
              mb: 4,
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              background: isDark
                ? `linear-gradient(135deg, ${alpha('#EC407A', 0.2)} 0%, ${alpha('#7E57C2', 0.1)} 100%)`
                : 'linear-gradient(135deg, #FFF0F5 0%, #F3E5F5 100%)',
              border: `1px solid ${isDark ? alpha('#EC407A', 0.2) : alpha('#EC407A', 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                right: -30,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '8rem',
                opacity: 0.06,
                pointerEvents: 'none',
                lineHeight: 1,
              }}
            >
              🌸
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 120,
                top: -10,
                fontSize: '4rem',
                opacity: 0.06,
                pointerEvents: 'none',
              }}
            >
              💗
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
              {/* Avatar */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Avatar
                  sx={{
                    width: { xs: 56, md: 72 },
                    height: { xs: 56, md: 72 },
                    background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                    fontSize: { xs: '1.4rem', md: '1.8rem' },
                    fontWeight: 900,
                    boxShadow: '0 12px 32px rgba(233,30,99,0.35)',
                    border: `3px solid ${isDark ? alpha('#EC407A', 0.3) : 'rgba(255,255,255,0.8)'}`,
                  }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </Avatar>
              </motion.div>

              {/* Greeting text */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <greeting.Icon sx={{ fontSize: 18, color: greeting.color }} />
                  <Chip
                    label={greeting.text}
                    size="small"
                    sx={{
                      bgcolor: alpha(greeting.color, isDark ? 0.2 : 0.1),
                      color: greeting.color,
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      height: 22,
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{
                    background: isDark
                      ? 'linear-gradient(135deg, #FCE4EC, #F48FB1)'
                      : 'linear-gradient(135deg, #C2185B, #EC407A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    mb: 0.5,
                  }}
                >
                  {firstName} 👋
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    maxWidth: 420,
                  }}
                >
                  Welcome back to{' '}
                  <Box component="span" sx={{ color: '#EC407A', fontWeight: 700 }}>{APP_NAME}</Box>
                  . Your health journey starts with awareness and early detection.
                </Typography>
              </Box>
            </Box>

            {/* CTA button */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate(ROUTES.PREDICTION)}
                sx={{
                  background: 'linear-gradient(135deg, #EC407A, #C2185B)',
                  px: { xs: 2.5, md: 3.5 },
                  py: { xs: 1, md: 1.3 },
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', md: '0.95rem' },
                  boxShadow: '0 8px 24px rgba(233,30,99,0.35)',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C2185B, #AD1457)',
                    boxShadow: '0 12px 32px rgba(233,30,99,0.45)',
                  },
                }}
                aria-label="Start new PMOS screening"
              >
                New Screening
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── Motivational Quote (top) ───────────────────── */}
        <MotivationalQuotes />

        {/* ── Hero Slider ───────────────────────────────── */}
        <HeroSlider />

        {/* ── Health Summary Cards ──────────────────────── */}
        <HealthSummaryCards predictions={predictions} total={total} />

        {/* ── Quick Actions ─────────────────────────────── */}
        <QuickActions />

        {/* ── Health Progress ──────────────────────────── */}
        <HealthProgressSection predictions={predictions} />

        {/* ── Recent Predictions ─────────────────────────── */}
        <RecentPredictions predictions={predictions} isLoading={isLoading} total={total} />

        {/* ── PMOS Awareness ───────────────────────────── */}
        <AwarenessSection />

        {/* ── Health Tips ──────────────────────────────── */}
        <HealthTipsCarousel />

        {/* ── Health Articles ───────────────────────────── */}
        <HealthArticles />

        {/* ── Footer Banner ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Box
            sx={{
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 50%, #CE93D8 100%)',
              position: 'relative',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {/* Decorative */}
            <Box sx={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', marginBottom: 12 }}
            >
              <Favorite sx={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }} />
            </motion.div>

            <Typography
              variant="h4"
              fontWeight={900}
              color="white"
              gutterBottom
              sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Your Health, Your Story
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.88)', mb: 3, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}
            >
              Every screening brings you closer to understanding your body. Take the next step in your health journey today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.PREDICTION)}
              sx={{
                bgcolor: 'white',
                color: '#E91E63',
                fontWeight: 800,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.92)', transform: 'translateY(-2px)' },
              }}
              aria-label="Start new PMOS screening assessment"
            >
              Start Screening →
            </Button>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
};

export default DashboardPage;
