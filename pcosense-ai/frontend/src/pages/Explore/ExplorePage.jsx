// src/pages/Explore/ExplorePage.jsx
import { useState, useMemo, useRef } from 'react';
import { Box, Container, Typography, Grid, TextField, InputAdornment, Button } from '@mui/material';
import { Search, ArrowBack } from '@mui/icons-material';
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CategoryPhotoCard from './components/CategoryPhotoCard.jsx';
import SubpointPhotoCard from './components/SubpointPhotoCard.jsx';
import SubpointArticleDialog from './components/SubpointArticleDialog.jsx';
import ScrollReveal from './components/ScrollReveal.jsx';
import { EXPLORE_CATEGORIES } from './exploreData.js';
import { HERO_IMAGE } from './topicImages.js';
import { COLORS } from '../../theme/index.js';

const CARD_COLUMNS = 3;

const ExplorePage = () => {
  const { t } = useTranslation();
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [openSubpoint, setOpenSubpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progressBar = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0.5]);

  const activeCategory = EXPLORE_CATEGORIES.find((c) => c.id === activeCategoryId) || null;
  const query = searchQuery.trim().toLowerCase();

  const visibleCategories = useMemo(() => {
    if (!query) return EXPLORE_CATEGORIES;
    return EXPLORE_CATEGORIES.filter(
      (category) =>
        category.title.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.subpoints.some((s) => s.title.toLowerCase().includes(query)),
    );
  }, [query]);

  const visibleSubpoints = useMemo(() => {
    if (!activeCategory) return [];
    if (!query) return activeCategory.subpoints;
    return activeCategory.subpoints.filter((s) => s.title.toLowerCase().includes(query));
  }, [activeCategory, query]);

  const openCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToCategories = () => {
    setActiveCategoryId(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Scroll progress indicator */}
      <motion.div
        style={{
          scaleX: progressBar,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          transformOrigin: '0%',
          background: `linear-gradient(90deg, ${COLORS.secondaryDark}, ${COLORS.purpleAccent})`,
          zIndex: 1400,
        }}
      />

      {/* Hero banner with parallax */}
      <Box ref={heroRef} sx={{ position: 'relative', width: '100%', height: { xs: 240, sm: 320, md: 400 }, overflow: 'hidden' }}>
        <motion.img
          src={HERO_IMAGE}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            y: heroY,
            scale: heroScale,
            opacity: heroOpacity,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <TextField
          fullWidth
          placeholder={t('explore.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', '& fieldset': { border: 'none' }, py: 0.5 },
          }}
          sx={{ mb: 4, maxWidth: 420 }}
        />

        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Typography
                variant="h3"
                fontWeight={800}
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                  background: `linear-gradient(135deg, ${COLORS.secondaryDark}, ${COLORS.purpleAccent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('explore.title')}
              </Typography>
              <Typography variant="h6" fontWeight={400} color="text.secondary" sx={{ mb: 5, maxWidth: 760 }}>
                {t('explore.subtitle')}
              </Typography>

              <Grid container spacing={4}>
                {visibleCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id} sx={{ height: 'auto' }}>
                    <ScrollReveal delay={(index % CARD_COLUMNS) * 0.1} style={{ height: '100%' }}>
                      <CategoryPhotoCard category={category} onClick={openCategory} />
                    </ScrollReveal>
                  </Grid>
                ))}
              </Grid>
              {visibleCategories.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 6 }} align="center">
                  {t('explore.noResults')}
                </Typography>
              )}
            </motion.div>
          ) : (
            <motion.div key={activeCategory.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={backToCategories}
                size="large"
                sx={{ mb: 4, textTransform: 'none', fontWeight: 600, borderRadius: 999, px: 3 }}
                variant="outlined"
                color="secondary"
              >
                {t('explore.backToTopics')}
              </Button>

              <Box
                component="img"
                src={activeCategory.coverImage}
                alt={activeCategory.title}
                sx={{ width: '100%', height: { xs: 220, sm: 300, md: 340 }, objectFit: 'cover', borderRadius: '24px', display: 'block', mb: 4 }}
              />

              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.9rem', sm: '2.25rem', md: '2.5rem' } }}>
                {activeCategory.title}
              </Typography>
              <Typography variant="h6" fontWeight={400} color="text.secondary" sx={{ mb: 5, maxWidth: 760 }}>
                {activeCategory.description}
              </Typography>

              <Grid container spacing={4}>
                {visibleSubpoints.map((subpoint, index) => (
                  <Grid item xs={12} sm={6} md={4} key={subpoint.id}>
                    <ScrollReveal delay={(index % CARD_COLUMNS) * 0.1} style={{ height: '100%' }}>
                      <SubpointPhotoCard subpoint={subpoint} onOpen={setOpenSubpoint} />
                    </ScrollReveal>
                  </Grid>
                ))}
              </Grid>
              {visibleSubpoints.length === 0 && (
                <Typography color="text.secondary" sx={{ py: 6 }} align="center">
                  {t('explore.noResults')}
                </Typography>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <SubpointArticleDialog subpoint={openSubpoint} open={Boolean(openSubpoint)} onClose={() => setOpenSubpoint(null)} />
      </Container>
    </Box>
  );
};

export default ExplorePage;
