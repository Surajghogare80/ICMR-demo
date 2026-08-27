import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, IconButton, Button, Chip, 
  Divider, CircularProgress, alpha, useTheme, Grid
} from '@mui/material';
import { 
  ArrowBack, Share, BookmarkBorder, Print, VerifiedUser,
  CheckCircleOutline, WarningAmber
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { lifestyleService } from '../../services/lifestyleService.js';
import { ROUTES } from '../../constants/index.js';
import { translateOptionValue } from '../../utils/optionTranslation.js';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await lifestyleService.getArticleById(id, i18n.language);
        setArticle(data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        // navigate(ROUTES.NOT_FOUND);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!article) return null;

  return (
    <Box sx={{ pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 300, md: 400 },
          backgroundImage: `url(${article.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pb: 6 }}>
          <IconButton
            onClick={() => navigate(ROUTES.LIFESTYLE)}
            aria-label={t('common.back')}
            sx={{ color: '#fff', mb: 2, bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' } }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<span style={{ paddingLeft: 8 }}>{article.icon}</span>}
              label={translateOptionValue(t, 'lifestyleHub.categories', article.category)}
              sx={{ bgcolor: '#EC407A', color: '#fff', fontWeight: 700 }}
            />
            <Chip
              label={`5 ${t('lifestyleHub.article.minRead')}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            />
          </Box>
          
          <Typography variant="h3" fontWeight={800} color="#fff" sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {article.title}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
        <Box 
          sx={{ 
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff',
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Action Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                color: '#2E7D32',
                bgcolor: alpha('#2E7D32', 0.1),
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <VerifiedUser fontSize="small" />
              <Typography variant="caption" fontWeight={700}>
                {t('lifestyleHub.article.whoBadge')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" aria-label={t('common.share')}><Share /></IconButton>
              <IconButton size="small" aria-label={t('lifestyleHub.article.bookmark')}><BookmarkBorder /></IconButton>
              <IconButton size="small" aria-label={t('common.print')}><Print /></IconButton>
            </Box>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic', lineHeight: 1.6 }}>
            {article.description}
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Structured Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Typography variant="h5" fontWeight={700} color="secondary" gutterBottom>
              {t('lifestyleHub.article.whatIsIt')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {article.whatIsIt}
            </Typography>
          </motion.div>

          <Box sx={{ my: 4 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Typography variant="h5" fontWeight={700} color="secondary" gutterBottom>
              {t('lifestyleHub.article.whyImportant')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
              {article.whyIsItImportant}
            </Typography>
          </motion.div>

          <Box sx={{ my: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Box sx={{ bgcolor: alpha('#EC407A', 0.05), p: 3, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutline color="secondary" /> {t('lifestyleHub.article.benefits')}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {article.benefits.map((benefit, idx) => (
                      <Typography component="li" key={idx} sx={{ mb: 1, lineHeight: 1.6 }}>
                        {benefit}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Box sx={{ bgcolor: alpha('#d32f2f', 0.05), p: 3, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmber color="error" /> {t('lifestyleHub.article.thingsToAvoid')}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {article.thingsToAvoid.map((thing, idx) => (
                      <Typography component="li" key={idx} sx={{ mb: 1, lineHeight: 1.6 }}>
                        {thing}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ my: 4 }} />
          <Divider sx={{ mb: 4 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Typography variant="h5" fontWeight={700} color="secondary" gutterBottom>
              {t('lifestyleHub.article.recommendations')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', bgcolor: theme.palette.mode === 'dark' ? alpha('#fff', 0.05) : '#f8f9fa', p: 3, borderRadius: 2, borderLeft: '4px solid #EC407A' }}>
              {article.recommendations}
            </Typography>
          </motion.div>

          <Box sx={{ my: 4 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Typography variant="h5" fontWeight={700} color="secondary" gutterBottom>
              {t('lifestyleHub.article.quickTips')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {article.quickTips.map((tip, idx) => (
                <Chip 
                  key={idx} 
                  label={tip} 
                  variant="outlined" 
                  color="secondary"
                  sx={{ borderRadius: 2, px: 1, py: 2, fontSize: '0.95rem' }} 
                />
              ))}
            </Box>
          </motion.div>

        </Box>
      </Container>
    </Box>
  );
};

export default ArticlePage;
