import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, TextField, InputAdornment, Chip, CircularProgress, useTheme } from '@mui/material';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import HeroSlideshow from './components/HeroSlideshow.jsx';
import ArticleCard from './components/ArticleCard.jsx';
import { lifestyleService } from '../../services/lifestyleService.js';

const filters = ['All Categories', 'Nutrition', 'Exercise', 'Mental Health', 'Sleep', 'Women\'s Health'];

const LifestylePage = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Categories');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await lifestyleService.getArticles(i18n.language);
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [i18n.language]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All Categories' || article.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ pb: 10 }}>
      {/* Top Banner (Optional subtle background) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 400,
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(236,64,122,0.05) 100%)`,
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" fontWeight={800} align="center" gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('lifestyle_hub')}
          </Typography>
        </motion.div>

        {/* Hero Slideshow */}
        <HeroSlideshow />

        {/* Search and Filters */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder={t('search_health_topics')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 8,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                    '& fieldset': { border: 'none' },
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                {filters.map(filter => (
                  <Chip
                    key={filter}
                    label={filter === 'All Categories' ? t('all_categories') : filter}
                    onClick={() => setActiveFilter(filter)}
                    sx={{
                      fontWeight: 600,
                      bgcolor: activeFilter === filter ? '#EC407A' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#fff'),
                      color: activeFilter === filter ? '#fff' : 'text.primary',
                      '&:hover': {
                        bgcolor: activeFilter === filter ? '#D81B60' : 'rgba(236,64,122,0.1)',
                      },
                      boxShadow: activeFilter === filter ? '0 4px 10px rgba(236,64,122,0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Articles Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredArticles.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
        
        {!loading && filteredArticles.length === 0 && (
          <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 10 }}>
            No articles found matching your criteria.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default LifestylePage;
