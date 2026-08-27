// src/pages/NotFound/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h1" fontWeight={900} sx={{ fontSize: '8rem', background: 'linear-gradient(135deg, #1565C0, #00897B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 2 }}>{t('notFound.title')}</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {t('notFound.description')}
          </Typography>
          <Button variant="contained" size="large" startIcon={<Home />} onClick={() => navigate('/')}>
            {t('notFound.back_to_home')}
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
