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
import { ROUTES } from '../../constants/index.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: <Psychology />, title: 'AI-Powered Screening', desc: 'Advanced multi-factor analysis using clinical and lifestyle data for accurate PCOS risk assessment.', color: '#E91E63' },
  { icon: <Security />, title: 'Secure & Private', desc: 'Your health data is encrypted and protected with enterprise-grade security. We take privacy seriously.', color: '#F06292' },
  { icon: <Speed />, title: 'Instant Results', desc: 'Get your PCOS risk assessment in seconds with detailed recommendations and next steps.', color: '#FFA726' },
  { icon: <Analytics />, title: 'Track History', desc: 'Monitor your health journey over time with prediction history and visual trend analysis.', color: '#66BB6A' },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Register securely and set up your personal health profile.' },
  { step: '02', title: 'Complete Screening', desc: 'Answer questions in our guided 4-step healthcare wizard.' },
  { step: '03', title: 'Get Results', desc: 'Receive instant risk assessment with personalized recommendations.' },
  { step: '04', title: 'Track Progress', desc: 'Monitor changes over time and share results with your doctor.' },
];

const faqs = [
  { q: 'What is PCOS?', a: 'Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder affecting women of reproductive age. It causes irregular periods, excess androgen, and polycystic ovaries.' },
  { q: 'Is this a medical diagnosis?', a: 'No. PCOSense AI is a screening tool only. Results are for educational purposes and should be discussed with a qualified gynecologist or endocrinologist.' },
  { q: 'How accurate is the prediction?', a: 'Our model is trained on clinical datasets and uses multiple risk factors. However, only a licensed medical professional can provide a formal PCOS diagnosis.' },
  { q: 'Is my data safe?', a: 'Yes. All data is encrypted in transit and at rest. We do not share your health information with third parties.' },
  { q: 'Can I delete my data?', a: 'Yes. You can delete your prediction history at any time from your dashboard.' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
                 <Chip label="🧬 AI-Powered Healthcare" size="small" sx={{ mb: 3, bgcolor: 'rgba(233,30,99,0.12)', color: 'primary.main', border: '1px solid rgba(233,30,99,0.2)' }} />
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.8rem' }, fontWeight: 900, color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#2D2D2D', lineHeight: 1.1, mb: 3 }}>
                  Understand Your
                  <Box component="span" sx={{ display: 'block', background: 'linear-gradient(135deg, #EC407A, #F48FB1, #FFA726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    PCOS Risk Today
                  </Box>
                </Typography>
                <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'text.secondary', fontWeight: 400, lineHeight: 1.8, mb: 5, maxWidth: 520 }}>
                  PCOSense AI analyzes your clinical symptoms, menstrual history, and lifestyle factors to provide a comprehensive PCOS risk assessment — powered by advanced AI.
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
                        Start Screening
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
                        Dashboard
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
                        Start Free Screening
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
                        Login
                      </Button>
                    </>
                  )}
                </Box>
                <Box sx={{ mt: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {['Free to use', 'Private & secure', 'Instant results'].map((t) => (
                    <Box key={t} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <CheckCircle sx={{ fontSize: 16, color: '#66BB6A' }} />
                      <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <Card sx={{ borderRadius: 4, p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>🔬 Sample Prediction Result</Typography>
                  {[
                    { label: 'Risk Level', value: 'Low Risk', color: '#66BB6A' },
                    { label: 'Probability', value: '26%', color: 'primary.main' },
                    { label: 'Confidence', value: '98%', color: 'info.main' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: item.color }}>{item.value}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">Recommendations</Typography>
                    {['Maintain healthy lifestyle', 'Exercise regularly', 'Consult doctor if symptoms increase'].map((r) => (
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
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>Why PCOSense AI?</Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 7, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            A comprehensive, evidence-based approach to PCOS risk assessment
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
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>How It Works</Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8, fontWeight: 400 }}>
            Get your PCOS risk assessment in 4 simple steps
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

      {/* About PCOS */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>About PCOS</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" lineHeight={1.9} sx={{ mb: 4 }}>
          Polycystic Ovary Syndrome (PCOS) affects approximately <strong>1 in 10</strong> women of childbearing age worldwide. It is one of the most common endocrine disorders and a leading cause of female infertility. Early detection and lifestyle intervention can significantly improve outcomes.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Irregular periods', 'Hormonal imbalance', 'Weight gain', 'Hair thinning', 'Acne', 'Fertility issues'].map((t) => (
            <Chip key={t} label={t} variant="outlined" icon={<FavoriteOutlined sx={{ fontSize: '14px !important' }} />} />
          ))}
        </Box>
      </Container>

      {/* FAQ */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>Frequently Asked Questions</Typography>
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
          <Typography variant="h3" fontWeight={800} color="white" gutterBottom>Take the First Step Today</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontWeight: 400 }}>
            Early awareness can make all the difference. Start your free screening now.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? ROUTES.PREDICTION : ROUTES.REGISTER)}
            sx={{ px: 6, py: 1.8, fontSize: '1.1rem', bgcolor: 'white', color: '#E91E63', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
          >
            {isAuthenticated ? 'Start Screening →' : 'Start Free Screening →'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
