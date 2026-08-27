// src/pages/Landing/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Chip, Accordion, AccordionSummary, AccordionDetails, Avatar,
} from '@mui/material';
import {
  Psychology, Security, Speed, Analytics, ExpandMore,
  CheckCircle, ArrowForward, FavoriteOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { ROUTES } from '../../constants/index.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '../../config/appConfig.js';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

const featureMeta = [
  { key: 'screening', icon: <Psychology />, color: '#E91E63' },
  { key: 'secure', icon: <Security />, color: '#F06292' },
  { key: 'instant', icon: <Speed />, color: '#FFA726' },
  { key: 'history', icon: <Analytics />, color: '#66BB6A' },
];

const stepMeta = [
  { key: 'account', step: '01' },
  { key: 'screening', step: '02' },
  { key: 'results', step: '03' },
  { key: 'track', step: '04' },
];

const faqKeys = ['whatIsPmos', 'medicalDiagnosis', 'accuracy', 'dataSafe', 'deleteData'];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const features = featureMeta.map((f) => ({
    ...f,
    title: t(`landing.features.items.${f.key}.title`),
    desc: t(`landing.features.items.${f.key}.desc`),
  }));

  const steps = stepMeta.map((s) => ({
    ...s,
    title: t(`landing.howItWorks.steps.${s.key}.title`),
    desc: t(`landing.howItWorks.steps.${s.key}.desc`),
  }));

  const faqs = faqKeys.map((key) => ({
    q: t(`landing.faq.items.${key}.q`),
    a: t(`landing.faq.items.${key}.a`, { appName: APP_NAME }),
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1A0A0F 0%, #2D1D23 50%, #1F0D15 100%)'
            : 'linear-gradient(135deg, #FFF0F5 0%, #FFF8FB 50%, #FFE4EC 100%)',
          py: { xs: 10, md: 14 },
        }}
      >
        {/* Background glow */}
        {[
          { top: '10%', left: '10%', color: 'rgba(233,30,99,0.12)' },
          { top: '60%', right: '5%', color: 'rgba(240,98,146,0.10)' },
          { top: '30%', left: '60%', color: 'rgba(248,187,208,0.08)' },
        ].map((g, i) => (
          <Box key={i} sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${g.color} 0%, transparent 70%)`, ...g, filter: 'blur(60px)', pointerEvents: 'none' }} />
        ))}

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
                 <Chip label={t('landing.hero.badge')} size="small" sx={{ mb: 3, bgcolor: 'rgba(233,30,99,0.12)', color: 'primary.main', border: '1px solid rgba(233,30,99,0.2)' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.8rem' }, fontWeight: 900, color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D2D2D', lineHeight: 1.1, mb: 3 }}>
                  {t('landing.hero.titleLine1')}
                  <Box component="span" sx={{ display: 'block', background: 'linear-gradient(135deg, #EC407A, #F48FB1, #FFA726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t('landing.hero.titleLine2')}
                  </Box>
                </Typography>
                <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'text.secondary', fontWeight: 400, lineHeight: 1.8, mb: 5, maxWidth: 520 }}>
                  {APP_DESCRIPTION}
                </Typography>
                 <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(ROUTES.PREDICTION)}
                        sx={{ px: 4, py: 1.5, fontSize: '1rem', background: 'linear-gradient(135deg, #EC407A, #F48FB1)', boxShadow: '0 8px 24px rgba(233,30,99,0.3)' }}
                      >
                        {t('landing.hero.ctaAuthenticated')}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate(ROUTES.DASHBOARD)}
                        sx={{
                          px: 4, py: 1.5, fontSize: '1rem',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(233,30,99,0.4)',
                          color: (theme) => theme.palette.mode === 'dark' ? '#FFF' : 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(233,30,99,0.04)'
                          }
                        }}
                      >
                        {t('landing.hero.dashboard')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate(ROUTES.REGISTER)}
                        sx={{ px: 4, py: 1.5, fontSize: '1rem', background: 'linear-gradient(135deg, #EC407A, #F48FB1)', boxShadow: '0 8px 24px rgba(233,30,99,0.3)' }}
                      >
                        {t('landing.hero.ctaGuest')}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate(ROUTES.LOGIN)}
                        sx={{
                          px: 4, py: 1.5, fontSize: '1rem',
                          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(233,30,99,0.4)',
                          color: (theme) => theme.palette.mode === 'dark' ? '#FFF' : 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(233,30,99,0.04)'
                          }
                        }}
                      >
                        {t('landing.hero.login')}
                      </Button>
                    </>
                  )}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {[t('landing.hero.trust.free'), t('landing.hero.trust.private'), t('landing.hero.trust.instant')].map((label) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <CheckCircle sx={{ fontSize: 16, color: '#66BB6A' }} />
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>{label}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Card sx={{ borderRadius: 4, p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>{t('landing.hero.sample.title')}</Typography>
                  {[
                    { label: t('landing.hero.sample.riskLevelLabel'), value: t('landing.hero.sample.riskLevelValue'), color: '#66BB6A' },
                    { label: t('landing.hero.sample.probabilityLabel'), value: t('landing.hero.sample.probabilityValue'), color: 'primary.main' },
                    { label: t('landing.hero.sample.confidenceLabel'), value: t('landing.hero.sample.confidenceValue'), color: 'info.main' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: item.color }}>{item.value}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">{t('landing.hero.sample.recommendationsTitle')}</Typography>
                    {[
                      t('landing.hero.sample.recommendations.lifestyle'),
                      t('landing.hero.sample.recommendations.exercise'),
                      t('landing.hero.sample.recommendations.consult'),
                    ].map((r) => (
                      <Box key={r} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <CheckCircle sx={{ fontSize: 14, color: '#66BB6A' }} />
                        <Typography variant="caption" color="text.secondary">{r}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>{t('landing.features.title', { appName: APP_NAME })}</Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 7, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            {t('landing.features.subtitle')}
          </Typography>
        </motion.div>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid key={f.title} item xs={12} sm={6} md={3}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card sx={{ height: '100%', p: 0.5, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: `${f.color}20`, color: f.color, mb: 2, width: 52, height: 52 }}>{f.icon}</Avatar>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>{t('landing.howItWorks.title')}</Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8, fontWeight: 400 }}>
            {t('landing.howItWorks.subtitle')}
          </Typography>
          <Grid container spacing={4}>
            {steps.map((s, i) => (
              <Grid key={s.step} item xs={12} sm={6} md={3}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h1" sx={{ fontSize: '3rem', fontWeight: 900, color: 'primary.main', opacity: 0.15, lineHeight: 1 }}>{s.step}</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ mt: -1, mb: 1 }}>{s.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About PMOS */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>{t('landing.about.title')}</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" lineHeight={1.9} sx={{ mb: 4 }}>
          <Trans i18nKey="landing.about.description" components={{ strong: <strong /> }} />
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            t('landing.about.tags.periods'),
            t('landing.about.tags.hormonal'),
            t('landing.about.tags.weight'),
            t('landing.about.tags.hair'),
            t('landing.about.tags.acne'),
            t('landing.about.tags.fertility'),
          ].map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" icon={<FavoriteOutlined sx={{ fontSize: '14px !important' }} />} />
          ))}
        </Box>
      </Container>

      {/* FAQ */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>{t('landing.faq.title')}</Typography>
          <Box sx={{ mt: 5 }}>
            {faqs.map((faq, i) => (
              <Accordion key={i} sx={{ mb: 1.5, borderRadius: '12px !important', border: '1px solid', borderColor: 'divider', boxShadow: 'none', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={600}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{faq.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ background: 'linear-gradient(135deg, #EC407A, #F48FB1)', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom>{t('landing.cta.title')}</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
            {t('landing.cta.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? ROUTES.PREDICTION : ROUTES.REGISTER)}
            sx={{ px: 6, py: 1.8, fontSize: '1.1rem', bgcolor: 'white', color: '#E91E63', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
          >
            {isAuthenticated ? t('landing.cta.buttonAuthenticated') : t('landing.cta.buttonGuest')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
