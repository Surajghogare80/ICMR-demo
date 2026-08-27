// src/layout/Footer/Footer.jsx
import { Box, Container, Typography, Link as MUILink, Divider, Grid } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../config/appConfig.js';

const Footer = () => {
  const { t } = useTranslation();

  return (
  <Box
    component="footer"
    sx={{
      mt: 'auto',
      py: 4,
      borderTop: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography sx={{ fontSize: '1.2rem' }}>🧬</Typography>
            <Typography variant="h6" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              {APP_NAME}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t('brand.tagline')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { md: 'flex-end' } }}>
            {t('footer.made_with_for')}
            <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('footer.rights_reserved', { year: new Date().getFullYear(), appName: APP_NAME })}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
  );
};

export default Footer;
