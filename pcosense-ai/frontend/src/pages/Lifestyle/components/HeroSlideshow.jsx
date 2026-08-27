import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, alpha, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const slides = [
  {
    id: 'diet',
    image: '/healthy-diet.jpg',
  },
  {
    id: 'exercise',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'mental',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'sleep',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop',
  }
];

const HeroSlideshow = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 350, md: 500 },
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        mb: 6,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Soft pink overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(to right, ${alpha('#EC407A', 0.85)}, ${alpha('#F48FB1', 0.4)})`,
              }}
            />

            {/* Content */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                px: { xs: 4, md: 8 },
                color: '#fff',
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Typography variant="h3" fontWeight={800} sx={{ mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {t(`lifestyleHub.hero.slides.${slides[currentSlide].id}.title`)}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, fontWeight: 400, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {t(`lifestyleHub.hero.slides.${slides[currentSlide].id}.description`)}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#fff',
                    color: '#EC407A',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    borderRadius: 8,
                    px: 4,
                    fontWeight: 700,
                  }}
                >
                  {t('common.learn_more')}
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation */}
      <IconButton
        onClick={handlePrev}
        aria-label={t('lifestyleHub.hero.previousSlide')}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          transform: 'translateY(-50%)',
          bgcolor: alpha('#fff', 0.2),
          color: '#fff',
          '&:hover': { bgcolor: alpha('#fff', 0.4) },
          zIndex: 2,
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNext}
        aria-label={t('lifestyleHub.hero.nextSlide')}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          transform: 'translateY(-50%)',
          bgcolor: alpha('#fff', 0.2),
          color: '#fff',
          '&:hover': { bgcolor: alpha('#fff', 0.4) },
          zIndex: 2,
        }}
      >
        <KeyboardArrowRight />
      </IconButton>

      {/* Progress Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: index === currentSlide ? 32 : 12,
              height: 12,
              borderRadius: 6,
              bgcolor: index === currentSlide ? '#fff' : alpha('#fff', 0.5),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlideshow;
