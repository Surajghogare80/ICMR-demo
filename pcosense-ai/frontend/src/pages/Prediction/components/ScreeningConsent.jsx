// src/pages/Prediction/components/ScreeningConsent.jsx
import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Checkbox,
  FormControlLabel, Button, Collapse, Stack,
} from '@mui/material';
import { CheckCircle, WarningAmberRounded, ExpandMore } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '../../../config/appConfig.js';

const DISCLAIMER_PANEL_ID = 'welcome-medical-disclaimer-panel';

const ScreeningConsent = ({ onStart }) => {
  const { t } = useTranslation();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const toggleDisclaimer = () => setDisclaimerOpen((prev) => !prev);

  const handleDisclaimerKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDisclaimer();
    }
  };

  const handleStartScreening = () => {
    if (!consentAccepted) return;
    onStart();
  };

  const needItems = [
    t('welcome.time_required'),
    t('welcome.period_information'),
    t('welcome.blood_test'),
    t('welcome.ultrasound'),
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 4 }}>
            <Box
              sx={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.4rem' }} aria-hidden="true">🧬</Typography>
            </Box>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>

          <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom component="h1">
            {t('welcome.title')}
          </Typography>
          <Typography color="text.secondary" textAlign="center" sx={{ mb: 4, lineHeight: 1.8 }}>
            {t('welcome.description')}
          </Typography>

          <Card
            sx={{
              mb: 3,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(233,30,99,0.08)' : 'rgba(233,30,99,0.04)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(233,30,99,0.25)' : 'rgba(233,30,99,0.15)',
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                component="h2"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.8rem', color: 'primary.main' }}
              >
                {t('welcome.what_you_need')}
              </Typography>
              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                {needItems.map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                    <CheckCircle sx={{ fontSize: 18, mt: 0.2, color: '#66BB6A', flexShrink: 0 }} />
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <Box
              role="button"
              tabIndex={0}
              aria-expanded={disclaimerOpen}
              aria-controls={DISCLAIMER_PANEL_ID}
              onClick={toggleDisclaimer}
              onKeyDown={handleDisclaimerKeyDown}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 1.5, px: 2.5, py: 2, cursor: 'pointer',
                '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <WarningAmberRounded sx={{ color: 'warning.main', fontSize: 20 }} aria-hidden="true" />
                <Typography variant="subtitle2" fontWeight={700}>{t('welcome.medical_disclaimer')}</Typography>
              </Box>
              <ExpandMore sx={{ transform: disclaimerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </Box>
            <Collapse in={disclaimerOpen}>
              <CardContent id={DISCLAIMER_PANEL_ID} sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                  {t('welcome.medical_disclaimer_content')}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>

          <FormControlLabel
            sx={{ mb: 3, alignItems: 'flex-start', ml: 0 }}
            control={
              <Checkbox
                checked={consentAccepted}
                onChange={(event) => setConsentAccepted(event.target.checked)}
                sx={{ mt: -0.7 }}
              />
            }
            label={<Typography variant="body2">{t('welcome.consent')}</Typography>}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!consentAccepted}
            onClick={handleStartScreening}
            sx={{
              py: 1.8, fontSize: '1rem', borderRadius: 3,
              background: consentAccepted ? 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)' : undefined,
            }}
          >
            {t('welcome.start_screening')}
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ScreeningConsent;
