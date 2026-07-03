// src/pages/Prediction/PredictionResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, Grid, Button,
  LinearProgress, Chip, Alert, List, ListItem, ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import { CheckCircle, Home, History, Science, Warning, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/index.js';

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>No result found. Please complete the screening first.</Typography>
        <Button onClick={() => navigate(ROUTES.PREDICTION)} sx={{ mt: 2 }}>Start Screening</Button>
      </Box>
    );
  }

  const isHighRisk = result.result === 'High Risk';
  const color = isHighRisk ? '#C62828' : '#2E7D32';
  const bgColor = isHighRisk ? '#FFEBEE' : '#E8F5E9';

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
                label={result.result}
                sx={{ bgcolor: bgColor, color, fontWeight: 800, fontSize: '1rem', px: 2, py: 0.5, mb: 2, border: `1px solid ${color}40` }}
              />
              <Typography variant="h4" fontWeight={800} sx={{ color }}>
                {isHighRisk ? 'High PCOS Risk Detected' : 'Low PCOS Risk Detected'}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Based on your submitted clinical and lifestyle data
              </Typography>
            </Box>

            {/* Metrics */}
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Probability Meter */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Risk Probability</Typography>
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
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Model Confidence</Typography>
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
                    AI model certainty score
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>📋 Personalized Recommendations</Typography>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                {result.recommendation?.map((rec, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle sx={{ color: '#2E7D32', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2" fontWeight={500}>{rec}</Typography>} />
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Medical Disclaimer */}
          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>⚕️ Medical Disclaimer</Typography>
            <Typography variant="body2">
              This screening result is generated by an AI model and is intended for educational purposes ONLY.
              It does NOT constitute a medical diagnosis. Please consult a licensed gynecologist or endocrinologist
              for a formal PCOS evaluation, blood tests, and pelvic ultrasound.
            </Typography>
          </Alert>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" startIcon={<Home />} onClick={() => navigate(ROUTES.DASHBOARD)} sx={{ px: 4 }}>
              Go to Dashboard
            </Button>
            <Button variant="outlined" startIcon={<History />} onClick={() => navigate(ROUTES.HISTORY)} sx={{ px: 4 }}>
              View History
            </Button>
            <Button variant="outlined" startIcon={<Science />} onClick={() => navigate(ROUTES.PREDICTION)} sx={{ px: 4 }}>
              New Screening
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PredictionResult;
