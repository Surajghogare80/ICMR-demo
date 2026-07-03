// src/pages/Dashboard/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Avatar, LinearProgress, Chip, List, ListItem,
  ListItemText, ListItemAvatar,
} from '@mui/material';
import {
  Science, TrendingUp, History, ArrowForward, CheckCircle,
  Warning, FiberManualRecord,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { predictionService } from '../../services/predictionService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import Loading from '../../layout/Loading/Loading.jsx';

const StatCard = ({ title, value, subtitle, icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
            <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5 }}>{value}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, color, width: 52, height: 52 }}>{icon}</Avatar>
        </Box>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: predictionsData, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => predictionService.getAll({ page: 1, limit: 5 }),
  });

  const predictions = predictionsData?.data?.predictions || [];
  const total = predictionsData?.data?.total || 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography color="text.secondary">
              Welcome to your PCOSense AI dashboard. Monitor your health journey.
            </Typography>
          </Box>
        </motion.div>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Screenings" value={total} subtitle="All time" icon={<Science />} color="#1565C0" delay={0} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Last Result"
              value={predictions[0]?.result || '—'}
              subtitle={predictions[0] ? new Date(predictions[0].createdAt).toLocaleDateString() : 'No predictions yet'}
              icon={<TrendingUp />}
              color={predictions[0]?.result === 'High Risk' ? '#C62828' : '#2E7D32'}
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Last Probability"
              value={predictions[0] ? `${predictions[0].probability}%` : '—'}
              subtitle="Risk probability score"
              icon={<Warning />}
              color="#F57F17"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Last Confidence"
              value={predictions[0] ? `${predictions[0].confidence}%` : '—'}
              subtitle="Model confidence"
              icon={<CheckCircle />}
              color="#00897B"
              delay={0.3}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>

                  <Box
                    onClick={() => navigate(ROUTES.PREDICTION)}
                    sx={{
                      p: 2.5, borderRadius: 3, cursor: 'pointer',
                      background: 'linear-gradient(135deg, #1565C0, #00897B)',
                      mb: 2, transition: 'opacity 0.2s', '&:hover': { opacity: 0.9 },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} color="white">New Screening</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Start PCOS assessment</Typography>
                      </Box>
                      <ArrowForward sx={{ color: 'white' }} />
                    </Box>
                  </Box>

                  <Box
                    onClick={() => navigate(ROUTES.HISTORY)}
                    sx={{ p: 2.5, borderRadius: 3, cursor: 'pointer', bgcolor: 'action.hover', transition: 'background 0.2s', '&:hover': { bgcolor: 'action.selected' } }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>View History</Typography>
                        <Typography variant="caption" color="text.secondary">{total} predictions saved</Typography>
                      </Box>
                      <History color="action" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Predictions */}
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>Recent Predictions</Typography>
                    <Button size="small" onClick={() => navigate(ROUTES.HISTORY)}>View all</Button>
                  </Box>

                  {isLoading ? (
                    <Loading message="Loading predictions..." />
                  ) : predictions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <Science sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary" gutterBottom>No predictions yet</Typography>
                      <Button variant="contained" onClick={() => navigate(ROUTES.PREDICTION)}>
                        Start your first screening
                      </Button>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {predictions.map((p, i) => (
                        <ListItem key={p._id} sx={{ px: 0, py: 1.5, borderBottom: i < predictions.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: p.result === 'High Risk' ? '#FFEBEE' : '#E8F5E9', color: p.result === 'High Risk' ? '#C62828' : '#2E7D32' }}>
                              <FiberManualRecord fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={p.result}
                                  size="small"
                                  sx={{ bgcolor: p.result === 'High Risk' ? '#FFEBEE' : '#E8F5E9', color: p.result === 'High Risk' ? '#C62828' : '#2E7D32', fontWeight: 700 }}
                                />
                                <Typography variant="body2" fontWeight={600}>Probability: {p.probability}%</Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={p.probability}
                                  sx={{ height: 4, borderRadius: 2, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: p.result === 'High Risk' ? '#C62828' : '#2E7D32' } }}
                                />
                                <Typography variant="caption" color="text.secondary">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
