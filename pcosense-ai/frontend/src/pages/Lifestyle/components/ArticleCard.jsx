import { Card, CardContent, CardMedia, Typography, Box, Button, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/index.js';

const ArticleCard = ({ article }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#fff',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? alpha('#EC407A', 0.2) : alpha('#EC407A', 0.1)}`,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 10px 30px rgba(0,0,0,0.3)' 
            : '0 10px 30px rgba(236,64,122,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#EC407A',
            boxShadow: theme.palette.mode === 'dark' 
              ? `0 15px 40px ${alpha('#EC407A', 0.3)}` 
              : `0 15px 40px ${alpha('#EC407A', 0.2)}`,
          }
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}>
            <CardMedia
              component="img"
              height="200"
              image={article.image}
              alt={article.title}
            />
          </motion.div>
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: '#EC407A',
              px: 2,
              py: 0.5,
              borderRadius: 4,
              fontSize: '0.875rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            {article.icon} {article.category}
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
            {article.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              flexGrow: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {article.description}
          </Typography>
          
          <Button
            variant="text"
            endIcon={<ArrowForward />}
            onClick={() => navigate(ROUTES.LIFESTYLE_ARTICLE.replace(':id', article.id))}
            sx={{
              alignSelf: 'flex-start',
              color: '#EC407A',
              fontWeight: 700,
              p: 0,
              '&:hover': { bgcolor: 'transparent', color: '#D81B60' }
            }}
          >
            {t('read_article')}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
