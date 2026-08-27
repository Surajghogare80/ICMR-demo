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
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/predictionService.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';
import { formatLocalizedDate, formatLocalizedDateTime } from '../../utils/localeFormat.js';
import { translateOptionValue } from '../../utils/optionTranslation.js';

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
  const { t, i18n } = useTranslation();
  if (!prediction) return null;
  const pm  = prediction.personalMetricId  || {};
  const mh  = prediction.menstrualHistoryId || {};
  const cs  = prediction.clinicalSymptomId  || {};
  const lhd = prediction.lifestyleHabitId  || {};
  const isHighRisk = prediction.result === 'High Risk';
  const resultColor = isHighRisk ? 'error.main' : 'success.main';
  const u = t('admin.detail_dialog.units', { returnObjects: true });

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
          <Typography variant="h6" fontWeight={700}>{t('admin.detail_dialog.title')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {prediction.createdAt ? formatLocalizedDateTime(prediction.createdAt, i18n.language) : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={translateOptionValue(t, 'admin.results', prediction.result)}
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
                <Typography variant="caption" color="text.secondary">{t('admin.detail_dialog.probability_label')}</Typography>
                <Typography variant="h5" fontWeight={800} color={resultColor}>{prediction.probability}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('admin.detail_dialog.confidence_label')}</Typography>
                <Typography variant="h5" fontWeight={800}>{prediction.confidence}%</Typography>
              </Box>
            </Box>
            <Divider />
          </Grid>

          {/* Personal */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>👤 {t('admin.detail_dialog.sections.personal')}</Typography>
            <InfoRow label={t('admin.detail_dialog.fields.age')} value={pm.age} unit={u.yrs} />
            <InfoRow label={t('admin.detail_dialog.fields.weight')} value={pm.weight} unit={u.kg} />
            <InfoRow label={t('admin.detail_dialog.fields.height')} value={pm.height} unit={u.cm} />
            <InfoRow label={t('admin.detail_dialog.fields.bmi')} value={pm.bmi} />
            <InfoRow label={t('admin.detail_dialog.fields.waist_size')} value={pm.waist} unit={u.inch} />
            <InfoRow label={t('admin.detail_dialog.fields.hip_size')} value={pm.hip} unit={u.inch} />
            <InfoRow label={t('admin.detail_dialog.fields.waist_hip_ratio')} value={pm.waistHipRatio} />
            <InfoRow label={t('admin.detail_dialog.fields.blood_group')} value={pm.bloodGroup} />
          </Grid>

          {/* Menstrual */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🩸 {t('admin.detail_dialog.sections.menstrual')}</Typography>
            <InfoRow label={t('admin.detail_dialog.fields.cycle_length')} value={mh.cycleLength} unit={u.days} />
            <InfoRow label={t('admin.detail_dialog.fields.period_duration')} value={mh.periodDuration} unit={u.days} />
            <InfoRow label={t('admin.detail_dialog.fields.regularity')} value={mh.cycleRegularity} />
            <InfoRow label={t('admin.detail_dialog.fields.flow')} value={mh.flowIntensity} />
            <InfoRow label={t('admin.detail_dialog.fields.family_history')} value={mh.familyHistory !== undefined && mh.familyHistory !== null ? (mh.familyHistory ? t('common.yes') : t('common.no')) : '—'} />
          </Grid>

          {/* Standard Blood */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🔬 {t('admin.detail_dialog.sections.blood_standard')}</Typography>
            <InfoRow label={t('admin.detail_dialog.fields.fsh')} value={pm.fsh} unit={u.mIU_mL} />
            <InfoRow label={t('admin.detail_dialog.fields.lh')} value={pm.lh} unit={u.mIU_mL} />
            <InfoRow label={t('admin.detail_dialog.fields.tsh')} value={pm.tsh} unit={u.mIU_L} />
            <InfoRow label={t('admin.detail_dialog.fields.amh')} value={pm.amh} unit={u.ng_mL} />
            <InfoRow label={t('admin.detail_dialog.fields.haemoglobin')} value={pm.hb} unit={u.g_dL} />
            <InfoRow label={t('admin.detail_dialog.fields.random_blood_sugar')} value={pm.rbs} unit={u.mg_dL} />
          </Grid>

          {/* Extended Blood — 4 new parameters */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'secondary.main' }}>💉 {t('admin.detail_dialog.sections.blood_extended')}</Typography>
            <InfoRow label={t('admin.detail_dialog.fields.vitamin_d3')} value={pm.vitD3} unit={u.ng_mL} />
            <InfoRow label={t('admin.detail_dialog.fields.shbg')} value={pm.shbg} unit={u.nmol_L} />
            <InfoRow label={t('admin.detail_dialog.fields.fasting_insulin')} value={pm.fastingInsulin} unit={u.uIU_mL} />
            <InfoRow label={t('admin.detail_dialog.fields.homa_ir')} value={pm.insulinResistance} />
          </Grid>

          {/* Ultrasound (if available) */}
          {(mh.follicleNo || mh.avgFsize || mh.ovaryVolume || mh.endometrium) && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🔍 {t('admin.detail_dialog.sections.ultrasound')}</Typography>
              <InfoRow label={t('admin.detail_dialog.fields.follicle_no')} value={mh.follicleNo} />
              <InfoRow label={t('admin.detail_dialog.fields.avg_follicle_size')} value={mh.avgFsize} unit={u.mm} />
              <InfoRow label={t('admin.detail_dialog.fields.ovary_volume')} value={mh.ovaryVolume} unit={u.mL} />
              <InfoRow label={t('admin.detail_dialog.fields.endometrium')} value={mh.endometrium} unit={u.mm} />
            </Grid>
          )}

          {/* Lifestyle */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>🏃 {t('admin.detail_dialog.sections.lifestyle')}</Typography>
            <InfoRow label={t('admin.detail_dialog.fields.fast_food')} value={lhd.fastFoodFreq} />
            <InfoRow label={t('admin.detail_dialog.fields.exercise')} value={lhd.exerciseFreq} />
            <InfoRow label={t('admin.detail_dialog.fields.stress')} value={lhd.stressLevel} />
            <InfoRow label={t('admin.detail_dialog.fields.sleep')} value={lhd.sleepHours} unit={u.hrs} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
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
      toast.success(t('admin.toasts.user_deleted'));
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || t('admin.toasts.user_delete_failed')),
  });

  const stats = statsData?.data;
  const users = usersData?.data?.users || [];
  const logs  = stats?.recentLogs || [];
  const recentPredictions = stats?.recentPredictions || [];

  // `key` is a stable identifier used for logic (progress-bar condition below);
  // `title` is the translated, display-only label.
  const statCards = stats ? [
    { key: 'total_users',       title: t('admin.stats.total_users'),       value: stats.totalUsers,       icon: <People />,      color: '#E91E63' },
    { key: 'total_predictions', title: t('admin.stats.total_predictions'), value: stats.totalPredictions, icon: <Science />,     color: '#F06292' },
    { key: 'high_risk_cases',   title: t('admin.stats.high_risk_cases'),   value: stats.highRiskCount,    icon: <Warning />,     color: '#EF5350' },
    { key: 'low_risk_cases',    title: t('admin.stats.low_risk_cases'),    value: stats.lowRiskCount,     icon: <CheckCircle />, color: '#66BB6A' },
  ] : [];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>{t('admin.title')}</Typography>
              <Typography color="text.secondary">{t('admin.subtitle')}</Typography>
            </Box>
            <Button startIcon={<Refresh />} variant="outlined" onClick={() => refetch()}>{t('admin.actions.refresh')}</Button>
          </Box>

          {/* Stats Cards */}
          {statsLoading ? (
            <Box sx={{ py: 4 }}><Loading message={t('admin.loading.statistics')} /></Box>
          ) : (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((s, i) => (
                <Grid key={s.key} item xs={12} sm={6} md={3}>
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
                        {stats.totalPredictions > 0 && (s.key === 'high_risk_cases' || s.key === 'low_risk_cases') && (
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(s.value / stats.totalPredictions) * 100}
                              sx={{ height: 4, borderRadius: 2, bgcolor: `${s.color}15`, '& .MuiLinearProgress-bar': { bgcolor: s.color } }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {t('admin.stats.percent_of_total', { percent: stats.totalPredictions > 0 ? Math.round((s.value / stats.totalPredictions) * 100) : 0 })}
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
                  <Typography variant="h6" fontWeight={700} gutterBottom>{t('admin.users_table.title')}</Typography>
                  {usersLoading ? (
                    <Loading message={t('admin.loading.users')} />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell><strong>{t('admin.users_table.name')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users_table.role')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users_table.joined')}</strong></TableCell>
                            <TableCell align="center"><strong>{t('admin.users_table.action')}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((usr) => (
                            <TableRow key={usr._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                                    {usr.name?.charAt(0)?.toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body2" fontWeight={600}>{usr.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{usr.email}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={t(`admin.roles.${usr.role}`, { defaultValue: usr.role })}
                                  size="small"
                                  color={usr.role === 'admin' ? 'secondary' : 'default'}
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">{formatLocalizedDate(usr.createdAt, i18n.language)}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                {usr.role !== 'admin' && (
                                  <Tooltip title={t('admin.users_table.delete_tooltip')}>
                                    <IconButton size="small" color="error" onClick={() => setDeleteId(usr._id)}>
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
                  <Typography variant="h6" fontWeight={700} gutterBottom>{t('admin.activity.title')}</Typography>
                  {logs.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">{t('admin.activity.empty')}</Typography>
                  ) : (
                    <List disablePadding sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {logs.map((log, i) => (
                        <Box key={log._id}>
                          <ListItem sx={{ px: 0, py: 1.2, alignItems: 'flex-start' }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip
                                    label={t(`admin.log_actions.${log.action}`, { defaultValue: log.action })}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.65rem', height: 20 }}
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="caption" color="text.secondary">{log.details}</Typography>
                                  <br />
                                  <Typography variant="caption" color="text.disabled">{formatLocalizedDateTime(log.createdAt, i18n.language)}</Typography>
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
                    <Typography variant="h6" fontWeight={700} gutterBottom>{t('admin.predictions_table.title')}</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell><strong>{t('admin.predictions_table.user')}</strong></TableCell>
                            <TableCell><strong>{t('admin.predictions_table.date')}</strong></TableCell>
                            <TableCell><strong>{t('admin.predictions_table.result')}</strong></TableCell>
                            <TableCell><strong>{t('admin.predictions_table.probability')}</strong></TableCell>
                            <TableCell align="center"><strong>{t('admin.predictions_table.details')}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentPredictions.map((p) => {
                            const isHigh = p.result === 'High Risk';
                            return (
                              <TableRow key={p._id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {p.userId?.name || t('admin.predictions_table.anonymous')}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">{p.userId?.email}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">
                                    {formatLocalizedDate(p.createdAt, i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={translateOptionValue(t, 'admin.results', p.result)}
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
                                  <Tooltip title={t('admin.predictions_table.view_tooltip')}>
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
        <DialogTitle fontWeight={700}>{t('admin.delete_dialog.title')}</DialogTitle>
        <DialogContent>
          <Typography>{t('admin.delete_dialog.body')}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">{t('common.cancel')}</Button>
          <Button onClick={() => deleteMutation.mutate(deleteId)} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? t('admin.delete_dialog.deleting') : t('admin.delete_dialog.confirm_button')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
