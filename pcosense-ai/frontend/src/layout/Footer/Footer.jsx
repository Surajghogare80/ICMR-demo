// src/layout/Footer/Footer.jsx
import { Box, Container, Typography, Link as MUILink, Divider, Grid } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const Footer = () => (
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
              PCOSense AI
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            AI-powered PCOS screening and prediction platform for women's health.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Medical Disclaimer</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            This tool is for educational purposes only and does NOT replace professional medical advice. Always consult a qualified healthcare provider.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { md: 'flex-end' } }}>
            Made with <Favorite sx={{ fontSize: 14, color: 'error.main' }} /> for women's health
          </Typography>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} PCOSense AI. All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Footer;
