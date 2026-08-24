// src/pages/Admin/AdminDashboard.jsx
import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Divider, LinearProgress,
  Tooltip, alpha,
} from '@mui/material';
import { People, Science, Warning, CheckCircle, Delete, Refresh, Visibility, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/predictionService.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';

// ─── Reusable info row ─────────────────────────────────────────────────────
const InfoRow = ({ label, value, unit = '' }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.7, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>
      {value !== null && value !== undefined && value !== '' ? `${value}${unit ? ' ' + unit : ''}` : '—'}
    </Typography>
  </Box>
);

// ─── Admin Prediction Detail Dialog ───────────────────────────────────────
const AdminPredictionDetail = ({ prediction, onClose }) => {
  if (!prediction) return null;
  const pm  = prediction.personalMetricId  || {};
  const mh  = prediction.menstrualHistoryId || {};
  const cs  = prediction.clinicalSymptomId  || {};
  const lhd = prediction.lifestyleHabitId  || {};
  const isHighRisk = prediction.result === 'High Risk';
  const resultColor = isHighRisk ? 'error.main' : 'success.main';

  return (
    <Dialog
      open={!!prediction}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Prediction Details (Admin)</Typography>
          <Typography variant="caption" color="text.secondary">
            {prediction.createdAt ? new Date(prediction.createdAt).toLocaleString('en-IN') : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={prediction.result}
            size="small"
            sx={{
              bgcolor: (theme) => alpha(isHighRisk ? theme.palette.error.main : theme.palette.success.main, 0.12),
              color: resultColor,
              fontWeight: 700,
            }}
          />
          <IconButton onClick={onClose} size="small"><Close fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2 }}>
        <Grid container spacing={2.5}>
          {/* Risk Summary */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, mb: 0.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Probability</Typography>
                <Typography variant="h5" fontWeight={800} color={resultColor}>{prediction.probability}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Confidence</Typography>
                <Typography variant="h5" fontWeight={800}>{prediction.confidence}%</Typography>
              </Box>
            </Box>
            <Divider />
          </Grid>

          {/* Personal */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>👤 Personal</Typography>
            <InfoRow label="Age" value={pm.age} unit="yrs" />
            <InfoRow label="Weight" value={pm.weight} unit="kg" />
            <InfoRow label="Height" value={pm.height} unit="cm" />
            <InfoRow label="BMI" value={pm.bmi} />
            <InfoRow label="Waist Size" value={pm.waist} unit="inch" />
            <InfoRow label="Hip Size" value={pm.hip} unit="inch" />
            <InfoRow label="Waist : Hip Ratio" value={pm.waistHipRatio} />
            <InfoRow label="Blood Group" value={pm.bloodGroup} />
          </Grid>

          {/* Menstrual */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🩸 Menstrual</Typography>
            <InfoRow label="Cycle Length" value={mh.cycleLength} unit="days" />
            <InfoRow label="Period Duration" value={mh.periodDuration} unit="days" />
            <InfoRow label="Regularity" value={mh.cycleRegularity} />
            <InfoRow label="Flow" value={mh.flowIntensity} />
            <InfoRow label="Family History of PMOS" value={mh.familyHistory !== undefined && mh.familyHistory !== null ? (mh.familyHistory ? 'Yes' : 'No') : '—'} />
          </Grid>

          {/* Standard Blood */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🔬 Blood Report (Standard)</Typography>
            <InfoRow label="FSH" value={pm.fsh} unit="mIU/mL" />
            <InfoRow label="LH" value={pm.lh} unit="mIU/mL" />
            <InfoRow label="TSH" value={pm.tsh} unit="mIU/L" />
            <InfoRow label="AMH" value={pm.amh} unit="ng/mL" />
            <InfoRow label="Haemoglobin" value={pm.hb} unit="g/dL" />
            <InfoRow label="Random Blood Sugar" value={pm.rbs} unit="mg/dL" />
          </Grid>

          {/* Extended Blood — 4 new parameters */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'secondary.main' }}>💉 Blood Report (Extended)</Typography>
            <InfoRow label="Vitamin D3" value={pm.vitD3} unit="ng/mL" />
            <InfoRow label="SHBG" value={pm.shbg} unit="nmol/L" />
            <InfoRow label="Fasting Insulin" value={pm.fastingInsulin} unit="µIU/mL" />
            <InfoRow label="HOMA-IR" value={pm.insulinResistance} />
          </Grid>

          {/* Ultrasound (if available) */}
          {(mh.follicleNo || mh.avgFsize || mh.ovaryVolume || mh.endometrium) && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🔍 Ultrasound</Typography>
              <InfoRow label="Follicle No." value={mh.follicleNo} />
              <InfoRow label="Avg Follicle Size" value={mh.avgFsize} unit="mm" />
              <InfoRow label="Ovary Volume" value={mh.ovaryVolume} unit="mL" />
              <InfoRow label="Endometrium" value={mh.endometrium} unit="mm" />
            </Grid>
          )}

          {/* Lifestyle */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🏃 Lifestyle</Typography>
            <InfoRow label="Fast Food" value={lhd.fastFoodFreq} />
            <InfoRow label="Exercise" value={lhd.exerciseFreq} />
            <InfoRow label="Stress" value={lhd.stressLevel} />
            <InfoRow label="Sleep" value={lhd.sleepHours} unit="hrs" />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [viewPrediction, setViewPrediction] = useState(null);

  const { data: statsData, isLoading: statsLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers({ page: 1, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user.'),
  });

  const stats = statsData?.data;
  const users = usersData?.data?.users || [];
  const logs  = stats?.recentLogs || [];
  const recentPredictions = stats?.recentPredictions || [];

  const statCards = stats ? [
    { title: 'Total Users',       value: stats.totalUsers,       icon: <People />,      color: '#E91E63' },
    { title: 'Total Predictions', value: stats.totalPredictions, icon: <Science />,     color: '#F06292' },
    { title: 'High Risk Cases',   value: stats.highRiskCount,    icon: <Warning />,     color: '#EF5350' },
    { title: 'Low Risk Cases',    value: stats.lowRiskCount,     icon: <CheckCircle />, color: '#66BB6A' },
  ] : [];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>Admin Dashboard</Typography>
              <Typography color="text.secondary">Platform overview and user management</Typography>
            </Box>
            <Button startIcon={<Refresh />} variant="outlined" onClick={() => refetch()}>Refresh</Button>
          </Box>

          {/* Stats Cards */}
          {statsLoading ? (
            <Box sx={{ py: 4 }}><Loading message="Loading statistics..." /></Box>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((s, i) => (
                <Grid key={s.title} item xs={12} sm={6} md={3}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">{s.title}</Typography>
                            <Typography variant="h3" fontWeight={800} sx={{ mt: 0.5 }}>{s.value}</Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: `${s.color}18`, color: s.color, width: 48, height: 48 }}>{s.icon}</Avatar>
                        </Box>
                        {stats.totalPredictions > 0 && (s.title === 'High Risk Cases' || s.title === 'Low Risk Cases') && (
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(s.value / stats.totalPredictions) * 100}
                              sx={{ height: 4, borderRadius: 2, bgcolor: `${s.color}15`, '& .MuiLinearProgress-bar': { bgcolor: s.color } }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {stats.totalPredictions > 0 ? Math.round((s.value / stats.totalPredictions) * 100) : 0}% of total
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          <Grid container spacing={3}>
            {/* Users Table */}
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>User Management</Typography>
                  {usersLoading ? (
                    <Loading message="Loading users..." />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Joined</strong></TableCell>
                            <TableCell align="center"><strong>Action</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((u) => (
                            <TableRow key={u._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                                    {u.name?.charAt(0)?.toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip label={u.role} size="small" color={u.role === 'admin' ? 'secondary' : 'default'} sx={{ fontWeight: 600 }} />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">{new Date(u.createdAt).toLocaleDateString()}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                {u.role !== 'admin' && (
                                  <Tooltip title="Delete user">
                                    <IconButton size="small" color="error" onClick={() => setDeleteId(u._id)}>
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Activity Logs */}
            <Grid item xs={12} md={5}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>Recent Activity</Typography>
                  {logs.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">No activity logs yet.</Typography>
                  ) : (
                    <List disablePadding sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {logs.map((log, i) => (
                        <Box key={log._id}>
                          <ListItem sx={{ px: 0, py: 1.2, alignItems: 'flex-start' }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip label={log.action} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="caption" color="text.secondary">{log.details}</Typography>
                                  <br />
                                  <Typography variant="caption" color="text.disabled">{new Date(log.createdAt).toLocaleString()}</Typography>
                                </>
                              }
                            />
                          </ListItem>
                          {i < logs.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Predictions with detail viewer */}
            {recentPredictions.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Recent Predictions</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell><strong>User</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Result</strong></TableCell>
                            <TableCell><strong>Probability</strong></TableCell>
                            <TableCell align="center"><strong>Details</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentPredictions.map((p) => {
                            const isHigh = p.result === 'High Risk';
                            return (
                              <TableRow key={p._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {p.userId?.name || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">{p.userId?.email}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">
                                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={p.result}
                                    size="small"
                                    sx={{
                                      bgcolor: (theme) => alpha(isHigh ? theme.palette.error.main : theme.palette.success.main, 0.12),
                                      color: isHigh ? 'error.main' : 'success.main',
                                      fontWeight: 700,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={700} color={isHigh ? 'error.main' : 'success.main'}>
                                    {p.probability}%
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="View prediction details">
                                    <IconButton size="small" color="primary" onClick={() => setViewPrediction(p)}>
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>

      {/* Prediction Detail Dialog */}
      <AdminPredictionDetail prediction={viewPrediction} onClose={() => setViewPrediction(null)} />

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete this user and all their data?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">Cancel</Button>
          <Button onClick={() => deleteMutation.mutate(deleteId)} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
