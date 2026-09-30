// src/pages/Legal/TermsAndConditions.jsx
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Button, Divider, Stack, Link } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/index.js';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const sections = t('legal.terms.sections', { returnObjects: true });

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
                {t('legal.terms.pageTitle')}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('legal.terms.effectiveDateLabel')}: {t('legal.terms.effectiveDateValue')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('legal.terms.versionLabel')}: {t('legal.terms.versionValue')}
                </Typography>
              </Stack>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {t('legal.terms.intro')}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {sections.map((section, i) => (
                  <Box key={i}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {section.title}
                    </Typography>
                    <Stack spacing={1.5}>
                      {section.paragraphs.map((_paragraph, j) => (
                        <Typography key={j} variant="body2" color="text.secondary" lineHeight={1.8}>
                          <Trans
                            i18nKey={`legal.terms.sections.${i}.paragraphs.${j}`}
                            components={{
                              privacyLink: (
                                <Link component={RouterLink} to={ROUTES.PRIVACY} sx={{ fontWeight: 600 }} />
                              ),
                            }}
                          />
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {t('legal.terms.contactValue')}
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

export default TermsAndConditions;
