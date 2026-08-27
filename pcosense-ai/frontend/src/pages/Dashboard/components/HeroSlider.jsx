// src/pages/Dashboard/components/HeroSlider.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, useTheme, alpha } from '@mui/material';
import {
  ArrowBackIos, ArrowForwardIos,
  LocalHospital, Favorite, Restaurant, Psychology, MenuBook,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/index.js';

const SLIDES = [
  {
    id: 0,
    key: 'earlyDetection',
    emoji: '🌸',
    icon: <LocalHospital sx={{ fontSize: 64 }} />,
    ctaRoute: ROUTES.PREDICTION,
    gradient: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 50%, #FFEAF0 100%)',
    accentColor: '#EC407A',
    illustration: 'flower',
  },
  {
    id: 1,
    key: 'betterHealthcare',
    emoji: '💗',
    icon: <Favorite sx={{ fontSize: 64 }} />,
    ctaRoute: ROUTES.PREDICTION,
    gradient: 'linear-gradient(135deg, #F06292 0%, #EC407A 50%, #FCE4EC 100%)',
    accentColor: '#F06292',
    illustration: 'heart',
  },
  {
    id: 2,
    key: 'healthyLifestyle',
    emoji: '🥗',
    icon: <Restaurant sx={{ fontSize: 64 }} />,
    ctaRoute: ROUTES.DASHBOARD,
    gradient: 'linear-gradient(135deg, #66BB6A 0%, #A5D6A7 50%, #E8F5E9 100%)',
    accentColor: '#66BB6A',
    illustration: 'leaf',
  },
  {
    id: 3,
    key: 'aiPrediction',
    emoji: '🩺',
    icon: <Psychology sx={{ fontSize: 64 }} />,
    ctaRoute: ROUTES.PREDICTION,
    gradient: 'linear-gradient(135deg, #7E57C2 0%, #BA68C8 50%, #F3E5F5 100%)',
    accentColor: '#7E57C2',
    illustration: 'brain',
  },
  {
    id: 4,
    key: 'learnAboutPmos',
    emoji: '📚',
    icon: <MenuBook sx={{ fontSize: 64 }} />,
    ctaRoute: ROUTES.DASHBOARD,
    gradient: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 50%, #FFF8E1 100%)',
    accentColor: '#FFA726',
    illustration: 'book',
  },
];

const FloatingShape = ({ size, x, y, color, delay, duration }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      left: x,
      top: y,
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -16, 0], scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const SlideIllustration = ({ type, color }) => {
  const shapes = {
    flower: [
      { size: 120, x: '10%', y: '10%', color: `${color}33`, delay: 0, duration: 4 },
      { size: 60, x: '70%', y: '60%', color: `${color}22`, delay: 1, duration: 5 },
      { size: 80, x: '60%', y: '5%', color: `${color}25`, delay: 0.5, duration: 3.5 },
      { size: 40, x: '20%', y: '70%', color: `${color}20`, delay: 1.5, duration: 6 },
    ],
    heart: [
      { size: 100, x: '5%', y: '20%', color: `${color}30`, delay: 0.2, duration: 4.5 },
      { size: 50, x: '80%', y: '10%', color: `${color}25`, delay: 0.8, duration: 3 },
      { size: 70, x: '75%', y: '55%', color: `${color}20`, delay: 1.2, duration: 5 },
    ],
    leaf: [
      { size: 110, x: '12%', y: '5%', color: `${color}28`, delay: 0, duration: 4 },
      { size: 55, x: '78%', y: '65%', color: `${color}22`, delay: 0.6, duration: 5.5 },
      { size: 85, x: '68%', y: '8%', color: `${color}18`, delay: 1, duration: 3.5 },
    ],
    brain: [
      { size: 130, x: '8%', y: '15%', color: `${color}20`, delay: 0, duration: 4 },
      { size: 45, x: '82%', y: '20%', color: `${color}28`, delay: 0.7, duration: 3.5 },
      { size: 65, x: '72%', y: '60%', color: `${color}22`, delay: 1.3, duration: 5 },
    ],
    book: [
      { size: 90, x: '6%', y: '25%', color: `${color}25`, delay: 0, duration: 4 },
      { size: 55, x: '76%', y: '15%', color: `${color}22`, delay: 0.5, duration: 5 },
      { size: 75, x: '70%', y: '58%', color: `${color}18`, delay: 1, duration: 3.5 },
    ],
  };
  return (shapes[type] || []).map((s, i) => <FloatingShape key={i} {...s} />);
};

const HeroSlider = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isHovered, next]);

  const slide = SLIDES[current];
  const slideTitle = t(`dashboard.hero.slides.${slide.key}.title`);
  const slideSubtitle = t(`dashboard.hero.slides.${slide.key}.subtitle`);
  const slideCta = t(`dashboard.hero.slides.${slide.key}.cta`);
  const slideTags = t(`dashboard.hero.slides.${slide.key}.tags`, { returnObjects: true });

  return (
    <Box
      sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', mb: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Box
            sx={{
              background: isDark
                ? `linear-gradient(135deg, ${alpha(slide.accentColor, 0.25)} 0%, ${alpha('#1A0A0F', 0.95)} 100%)`
                : slide.gradient,
              minHeight: { xs: 320, md: 380 },
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              px: { xs: 3, md: 8 },
              py: { xs: 5, md: 6 },
              overflow: 'hidden',
            }}
          >
            {/* Background floating shapes */}
            <SlideIllustration type={slide.illustration} color={slide.accentColor} />

            {/* Large blurred background shape */}
            <Box
              sx={{
                position: 'absolute',
                right: { xs: -60, md: 40 },
                top: '50%',
                transform: 'translateY(-50%)',
                width: { xs: 200, md: 280 },
                height: { xs: 200, md: 280 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(slide.accentColor, 0.2)} 0%, transparent 70%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    color: isDark ? alpha(slide.accentColor, 0.7) : alpha(slide.accentColor, 0.9),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiSvgIcon-root': { fontSize: { xs: 80, md: 120 } },
                  }}
                >
                  {slide.icon}
                </Box>
              </motion.div>
            </Box>

            {/* Content */}
            <Box sx={{ maxWidth: { xs: '100%', md: '62%' }, position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Typography sx={{ fontSize: '2.5rem', lineHeight: 1, mb: 1 }}>{slide.emoji}</Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{
                    color: isDark ? '#FFFFFF' : (slide.id === 2 ? '#2E7D32' : slide.id === 3 ? '#4A148C' : slide.id === 4 ? '#E65100' : '#B71C1C'),
                    mb: 2,
                    lineHeight: 1.2,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    textShadow: isDark ? `0 0 30px ${alpha(slide.accentColor, 0.5)}` : 'none',
                  }}
                >
                  {slideTitle}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDark ? alpha('#FFF', 0.75) : alpha('#000', 0.65),
                    mb: 3,
                    lineHeight: 1.7,
                    maxWidth: 480,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {slideSubtitle}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {slideTags.map((tag) => (
                    <Box
                      key={tag}
                      sx={{
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 20,
                        bgcolor: isDark ? alpha(slide.accentColor, 0.2) : alpha(slide.accentColor, 0.12),
                        border: `1px solid ${alpha(slide.accentColor, 0.3)}`,
                        color: isDark ? slide.accentColor : slide.id === 2 ? '#2E7D32' : slide.id === 3 ? '#4A148C' : slide.accentColor,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(slide.ctaRoute)}
                  sx={{
                    background: isDark
                      ? `linear-gradient(135deg, ${slide.accentColor}, ${alpha(slide.accentColor, 0.7)})`
                      : slide.id === 2
                      ? 'linear-gradient(135deg, #2E7D32, #66BB6A)'
                      : slide.id === 3
                      ? 'linear-gradient(135deg, #4A148C, #7E57C2)'
                      : slide.id === 4
                      ? 'linear-gradient(135deg, #E65100, #FFA726)'
                      : 'linear-gradient(135deg, #EC407A, #C2185B)',
                    color: 'white',
                    px: 4,
                    py: 1.2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    boxShadow: `0 8px 24px ${alpha(slide.accentColor, 0.4)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 32px ${alpha(slide.accentColor, 0.5)}`,
                    },
                  }}
                >
                  {slideCta} →
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Buttons */}
      {[
        { icon: <ArrowBackIos sx={{ fontSize: 16 }} />, onClick: prev, side: 'left', ariaLabel: t('dashboard.hero.prevSlide') },
        { icon: <ArrowForwardIos sx={{ fontSize: 16 }} />, onClick: next, side: 'right', ariaLabel: t('dashboard.hero.nextSlide') },
      ].map(({ icon, onClick, side, ariaLabel }) => (
        <IconButton
          key={side}
          onClick={onClick}
          aria-label={ariaLabel}
          sx={{
            position: 'absolute',
            top: '50%',
            [side]: 16,
            transform: 'translateY(-50%)',
            bgcolor: alpha('#000', 0.25),
            color: 'white',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            width: 40,
            height: 40,
            '&:hover': { bgcolor: alpha('#000', 0.45) },
          }}
        >
          {icon}
        </IconButton>
      ))}

      {/* Dot Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 10,
        }}
      >
        {SLIDES.map((s, i) => (
          <Box
            key={s.id}
            onClick={() => setCurrent(i)}
            role="button"
            aria-label={t('dashboard.hero.goToSlide', { number: i + 1 })}
            sx={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: i === current ? 'white' : alpha('#FFF', 0.45),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;
