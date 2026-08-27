// src/pages/Dashboard/components/HealthArticles.jsx
import {
  Box, Typography, Grid, Chip, Button, useTheme, alpha,
} from '@mui/material';
import {
  MenuBook, ArrowForward, SelfImprovement, Restaurant,
  FitnessCenter, Psychology, Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ARTICLES = [
  {
    id: 'pcosGuide',
    categoryColor: '#EC407A',
    icon: <MenuBook sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #EC407A, #F48FB1)',
    readMinutes: 8,
  },
  {
    id: 'naturalManagement',
    categoryColor: '#66BB6A',
    icon: <SelfImprovement sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
    readMinutes: 6,
  },
  {
    id: 'nutrition',
    categoryColor: '#FFA726',
    icon: <Restaurant sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #FFA726, #FFD54F)',
    readMinutes: 10,
  },
  {
    id: 'exercise',
    categoryColor: '#7E57C2',
    icon: <FitnessCenter sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #7E57C2, #B39DDB)',
    readMinutes: 7,
  },
  {
    id: 'mentalWellness',
    categoryColor: '#26C6DA',
    icon: <Psychology sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #26C6DA, #80DEEA)',
    readMinutes: 9,
  },
  {
    id: 'fertility',
    categoryColor: '#F06292',
    icon: <Favorite sx={{ fontSize: 28, color: 'white' }} />,
    iconBg: 'linear-gradient(135deg, #F06292, #F48FB1)',
    readMinutes: 11,
  },
];

const ArticleCard = ({ article, index }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const title = t(`dashboard.articles.items.${article.id}.title`);
  const category = t(`dashboard.articles.items.${article.id}.category`);
  const excerpt = t(`dashboard.articles.items.${article.id}.excerpt`);
  const tags = t(`dashboard.articles.items.${article.id}.tags`, { returnObjects: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ height: '100%' }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : '#FFFFFF',
            border: `1px solid ${alpha(article.categoryColor, isDark ? 0.2 : 0.1)}`,
            boxShadow: isDark
              ? `0 4px 20px ${alpha('#000', 0.3)}`
              : `0 4px 20px ${alpha(article.categoryColor, 0.06)}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card header with icon + gradient */}
          <Box
            sx={{
              p: 3,
              background: isDark
                ? alpha(article.categoryColor, 0.1)
                : alpha(article.categoryColor, 0.05),
              borderBottom: `1px solid ${alpha(article.categoryColor, isDark ? 0.15 : 0.08)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                background: article.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 16px ${alpha(article.categoryColor, 0.35)}`,
                flexShrink: 0,
              }}
            >
              {article.icon}
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={category}
                  size="small"
                  sx={{
                    bgcolor: alpha(article.categoryColor, isDark ? 0.2 : 0.12),
                    color: article.categoryColor,
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    height: 20,
                  }}
                />
                <Typography variant="caption" color="text.disabled" fontWeight={500}>
                  {t('dashboard.articles.readTime', { count: article.readMinutes })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <Typography key={tag} variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                    #{tag}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.4} sx={{ mb: 1.5 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.75} sx={{ flexGrow: 1, mb: 2.5, fontSize: '0.83rem' }}>
              {excerpt}
            </Typography>

            <Button
              size="small"
              endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
              sx={{
                alignSelf: 'flex-start',
                color: article.categoryColor,
                fontWeight: 700,
                fontSize: '0.82rem',
                p: 0,
                '&:hover': {
                  background: 'transparent',
                  opacity: 0.8,
                },
              }}
            >
              {t('dashboard.articles.readArticle')}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const HealthArticles = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 5 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="h5" fontWeight={800}>{t('dashboard.articles.heading')}</Typography>
          <Chip
            label={t('dashboard.articles.countBadge', { count: ARTICLES.length })}
            size="small"
            sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#EC407A', fontWeight: 700, fontSize: '0.7rem' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.articles.subtitle')}
        </Typography>
      </motion.div>
      <Grid container spacing={2.5}>
        {ARTICLES.map((article, i) => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <ArticleCard article={article} index={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthArticles;
