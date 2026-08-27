// src/pages/Prediction/PredictionResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Grid, Button,
  LinearProgress, Chip, Alert, List, ListItem, ListItemIcon, ListItemText,
  Divider,
} from '@mui/material';
import { CheckCircle, Home, History, Science, Warning } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/index.js';
import { translateOptionValue } from '../../utils/optionTranslation.js';

// ─── Helper: translate a fixed backend enum value without changing the underlying value ──
const translateRiskLabel = (t, value) => translateOptionValue(t, 'predictionResult.riskLevels', value);

// ─── Helper: one labelled blood value row ─────────────────────────────────
const BloodRow = ({ label, value, unit }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{value}{unit ? ` ${unit}` : ''}</Typography>
    </Box>
  );
};

const PredictionResult = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { t }      = useTranslation();
  const result     = location.state?.result;
  const prediction = location.state?.prediction; // full DB record with populated personalMetricId

  if (!result) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>{t('predictionResult.noResult.message')}</Typography>
        <Button onClick={() => navigate(ROUTES.PREDICTION)} sx={{ mt: 2 }}>{t('predictionResult.noResult.startButton')}</Button>
      </Box>
    );
  }

  const isHighRisk = result.result === 'High Risk';
  const color      = isHighRisk ? '#EF5350' : '#66BB6A';
  const bgColor    = isHighRisk ? 'rgba(239, 83, 80, 0.12)' : 'rgba(102, 187, 106, 0.12)';

  // Personal metric data for blood report section
  const pm = prediction?.personalMetricId || {};

  // Check if any blood values were submitted (page 1)
  const hasStandardBlood = pm.fsh || pm.lh || pm.tsh || pm.amh || pm.hb || pm.rbs;
  // Check if any extended blood values were submitted (page 2)
  const hasExtendedBlood = pm.vitD3 || pm.shbg || pm.fastingInsulin || pm.insulinResistance;
  const hasAnyBlood = hasStandardBlood || hasExtendedBlood;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Result Header */}
          <Card sx={{ mb: 4, overflow: 'hidden', border: `2px solid ${color}20` }}>
            <Box sx={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, p: 4, textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: `3px solid ${color}` }}>
                  {isHighRisk ? <Warning sx={{ fontSize: 40, color }} /> : <CheckCircle sx={{ fontSize: 40, color }} />}
                </Box>
              </motion.div>
              <Chip
                label={translateRiskLabel(t, result.result)}
                sx={{ bgcolor: bgColor, color, fontWeight: 800, fontSize: '1rem', px: 2, py: 0.5, mb: 2, border: `1px solid ${color}40` }}
              />
              <Typography variant="h4" fontWeight={800} sx={{ color }}>
                {isHighRisk ? t('predictionResult.headline.high') : t('predictionResult.headline.low')}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t('predictionResult.subheading')}
              </Typography>
            </Box>

            {/* Metrics */}
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Probability Meter */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>{t('predictionResult.metrics.riskProbability')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h3" fontWeight={900} sx={{ color }}>{result.probability}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={result.probability}
                    sx={{ height: 12, borderRadius: 6, bgcolor: `${color}15`, '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 6 } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">0%</Typography>
                    <Typography variant="caption" color="text.secondary">50%</Typography>
                    <Typography variant="caption" color="text.secondary">100%</Typography>
                  </Box>
                </Grid>

                {/* Confidence */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>{t('predictionResult.metrics.modelConfidence')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h3" fontWeight={900} color="text.primary">{result.confidence}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={result.confidence}
                    color="secondary"
                    sx={{ height: 12, borderRadius: 6 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {t('predictionResult.metrics.aiCertainty')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Blood Report Card — shown only when blood values were submitted */}
          {hasAnyBlood && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Card sx={{ mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{t('predictionResult.bloodReport.title')}</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    {/* Standard markers */}
                    {hasStandardBlood && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                          {t('predictionResult.bloodReport.standardMarkers')}
                        </Typography>
                        <BloodRow label={t('predictionResult.bloodReport.labels.fsh')} value={pm.fsh}  unit={t('predictionResult.units.mIU_mL')} />
                        <BloodRow label={t('predictionResult.bloodReport.labels.lh')}  value={pm.lh}   unit={t('predictionResult.units.mIU_mL')} />
                        <BloodRow label={t('predictionResult.bloodReport.labels.tsh')} value={pm.tsh}  unit={t('units.mIU_L')}  />
                        <BloodRow label={t('predictionResult.bloodReport.labels.amh')} value={pm.amh}  unit={t('units.ng_mL')}  />
                        <BloodRow label={t('predictionResult.bloodReport.labels.hb')}  value={pm.hb}   unit={t('predictionResult.units.g_dL')}   />
                        <BloodRow label={t('predictionResult.bloodReport.labels.rbs')} value={pm.rbs}  unit={t('predictionResult.units.mg_dL')} />
                      </Grid>
                    )}

                    {/* Extended markers (Page 2) */}
                    {hasExtendedBlood && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" fontWeight={700} color="secondary.main" sx={{ mb: 1 }}>
                          {t('predictionResult.bloodReport.extendedMarkers')}
                        </Typography>
                        <BloodRow label={t('predictionResult.bloodReport.labels.vitD3')}  value={pm.vitD3}            unit={t('units.ng_mL')}  />
                        <BloodRow label={t('predictionResult.bloodReport.labels.shbg')}   value={pm.shbg}             unit={t('predictionResult.units.nmol_L')} />
                        <BloodRow label={t('predictionResult.bloodReport.labels.fastingInsulin')} value={pm.fastingInsulin} unit={t('predictionResult.units.uIU_mL')} />
                        <BloodRow label={t('predictionResult.bloodReport.labels.insulinResistance')} value={pm.insulinResistance} />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recommendations */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>{t('predictionResult.recommendations.title')}</Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {result.recommendation?.map((rec, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2" fontWeight={500}>{rec}</Typography>} />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          {/* <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>⚕️ Medical Disclaimer</Typography>
            <Typography variant="body2">
              This screening result is generated by an AI model and is intended for educational purposes ONLY.
              It does NOT constitute a medical diagnosis. Please consult a licensed gynecologist or endocrinologist
              for a formal PMOS evaluation, blood tests, and pelvic ultrasound.
            </Typography>
          </Alert> */}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" startIcon={<Home />} onClick={() => navigate(ROUTES.DASHBOARD)} sx={{ px: 4 }}>
              {t('predictionResult.actions.dashboard')}
            </Button>
            <Button variant="outlined" startIcon={<History />} onClick={() => navigate(ROUTES.HISTORY)} sx={{ px: 4 }}>
              {t('predictionResult.actions.history')}
            </Button>
            <Button variant="outlined" startIcon={<Science />} onClick={() => navigate(ROUTES.PREDICTION)} sx={{ px: 4 }}>
              {t('predictionResult.actions.newScreening')}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PredictionResult;
