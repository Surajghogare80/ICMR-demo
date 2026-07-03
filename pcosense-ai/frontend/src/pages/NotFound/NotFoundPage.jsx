// src/pages/NotFound/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home } from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Typography variant="h1" fontWeight={900} sx={{ fontSize: '8rem', background: 'linear-gradient(135deg, #1565C0, #00897B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 2 }}>Page Not Found</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button variant="contained" size="large" startIcon={<Home />} onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
