// src/pages/Legal/PrivacyPolicy.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Button, Divider, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/index.js';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const sections = t('legal.privacy.sections', { returnObjects: true });

  // location.key === 'default' means this page was loaded directly (e.g. a
  // refresh or a bookmarked link) rather than navigated to from within the
  // app, so there's no in-app history entry for navigate(-1) to return to.
  const handleGoBack = () => {
    if (location.key === 'default') {
      navigate(ROUTES.PREDICTION);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {t('legal.privacy.pageTitle')}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                {t('legal.privacy.subtitle')}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('legal.privacy.effectiveDateLabel')}: {t('legal.privacy.effectiveDateValue')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('legal.privacy.versionLabel')}: {t('legal.privacy.versionValue')}
                </Typography>
              </Stack>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {t('legal.privacy.intro')}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {sections.map((section, i) => (
                  <Box key={i}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {section.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {section.paragraphs.map((paragraph, j) => (
                        <Typography key={j} variant="body2" color="text.secondary" lineHeight={1.8}>
                          {paragraph}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {t('legal.privacy.contactValue')}
              </Typography>

              <Divider sx={{ my: 4 }} />

              <Button startIcon={<ArrowBack />} onClick={handleGoBack}>
                {t('common.go_back')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
