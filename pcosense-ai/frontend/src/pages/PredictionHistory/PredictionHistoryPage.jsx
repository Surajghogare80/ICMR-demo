// src/pages/PredictionHistory/PredictionHistoryPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Button,
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Tooltip, alpha, Divider, Grid,
} from '@mui/material';
import { Delete, Visibility, Science, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { predictionService } from '../../services/predictionService.js';
import { ROUTES } from '../../constants/index.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';
import { formatLocalizedDate, formatLocalizedDateTime } from '../../utils/localeFormat.js';
import { translateOptionValue } from '../../utils/optionTranslation.js';

// ─── Helper: translate a stored option value without changing the underlying value ──
const translateOption = (t, group, value) => translateOptionValue(t, `options.${group}`, value);

// ─── Helper: translate the fixed backend risk-result enum ────────────────────
const translateRiskLabel = (t, value) => translateOptionValue(t, 'predictionHistory.riskLevels', value);

// ─── Helper: a single labelled value row ─────────────────────────────────────
const InfoRow = ({ label, value, unit = '' }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>
      {value !== null && value !== undefined && value !== '' ? `${value}${unit ? ' ' + unit : ''}` : '—'}
    </Typography>
  </Box>
);

// ─── Prediction Details Dialog ────────────────────────────────────────────────
const PredictionDetailDialog = ({ prediction, onClose }) => {
  const { t, i18n } = useTranslation();
  if (!prediction) return null;

  const pm = prediction.personalMetricId || {};
  const mh = prediction.menstrualHistoryId || {};
  const cs = prediction.clinicalSymptomId || {};
  const lh = prediction.lifestyleHabitId || {};
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
          <Typography variant="h6" fontWeight={700}>{t('predictionHistory.detailDialog.title')}</Typography>
          <Typography variant="caption" color="text.secondary">
            {prediction.createdAt ? formatLocalizedDateTime(prediction.createdAt, i18n.language) : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={translateRiskLabel(t, prediction.result)}
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
                <Typography variant="caption" color="text.secondary">{t('predictionHistory.detailDialog.riskProbability')}</Typography>
                <Typography variant="h5" fontWeight={800} color={resultColor}>{prediction.probability}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">{t('predictionHistory.detailDialog.modelConfidence')}</Typography>
                <Typography variant="h5" fontWeight={800}>{prediction.confidence}%</Typography>
              </Box>
            </Box>
            <Divider />
          </Grid>

          {/* Personal Info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              {t('predictionHistory.detailDialog.sections.personalInfo')}
            </Typography>
            <InfoRow label={t('predictionHistory.detailDialog.labels.age')} value={pm.age} unit={t('predictionHistory.units.yrs')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.weight')} value={pm.weight} unit={t('units.kg')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.height')} value={pm.height} unit={t('units.cm')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.bmi')} value={pm.bmi} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.waistSize')} value={pm.waist} unit={t('units.inch')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.hipSize')} value={pm.hip} unit={t('units.inch')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.waistHipRatio')} value={pm.waistHipRatio} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.bloodGroup')} value={pm.bloodGroup} />
          </Grid>

          {/* Menstrual */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              {t('predictionHistory.detailDialog.sections.menstrual')}
            </Typography>
            <InfoRow label={t('predictionHistory.detailDialog.labels.cycleLength')} value={mh.cycleLength} unit={t('predictionHistory.units.days')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.periodDuration')} value={mh.periodDuration} unit={t('predictionHistory.units.days')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.regularity')} value={translateOption(t, 'cycleRegularity', mh.cycleRegularity)} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.flowIntensity')} value={translateOption(t, 'flowIntensity', mh.flowIntensity)} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.familyHistory')} value={mh.familyHistory !== undefined && mh.familyHistory !== null ? (mh.familyHistory ? t('common.yes') : t('common.no')) : '—'} />
          </Grid>

          {/* Blood Report — Page 1 */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              {t('predictionHistory.detailDialog.sections.bloodStandard')}
            </Typography>
            <InfoRow label={t('predictionHistory.detailDialog.labels.fsh')} value={pm.fsh} unit={t('predictionHistory.units.mIU_mL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.lh')} value={pm.lh} unit={t('predictionHistory.units.mIU_mL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.tsh')} value={pm.tsh} unit={t('units.mIU_L')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.amh')} value={pm.amh} unit={t('units.ng_mL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.hb')} value={pm.hb} unit={t('predictionHistory.units.g_dL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.rbs')} value={pm.rbs} unit={t('predictionHistory.units.mg_dL')} />
          </Grid>

          {/* Blood Report — Page 2 (Extended) */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'secondary.main' }}>
              {t('predictionHistory.detailDialog.sections.bloodExtended')}
            </Typography>
            <InfoRow label={t('predictionHistory.detailDialog.labels.vitD3')} value={pm.vitD3} unit={t('units.ng_mL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.shbg')} value={pm.shbg} unit={t('predictionHistory.units.nmol_L')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.fastingInsulin')} value={pm.fastingInsulin} unit={t('predictionHistory.units.uIU_mL')} />
            <InfoRow label={t('predictionHistory.detailDialog.labels.insulinResistance')} value={pm.insulinResistance} />
          </Grid>

          {/* Symptoms */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              {t('predictionHistory.detailDialog.sections.symptoms')}
            </Typography>
            {[
              [t('predictionHistory.detailDialog.symptomLabels.weightGain'), cs.weightGain],
              [t('predictionHistory.detailDialog.symptomLabels.hairGrowth'), cs.hairGrowth],
              [t('predictionHistory.detailDialog.symptomLabels.skinDarkening'), cs.skinDarkening],
              [t('predictionHistory.detailDialog.symptomLabels.pimples'), cs.pimples],
              [t('predictionHistory.detailDialog.symptomLabels.hairLoss'), cs.hairLoss],
            ].map(([label, val]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Chip label={val ? t('common.yes') : t('common.no')} size="small"
                  sx={{
                    height: 20, fontSize: '0.7rem', fontWeight: 600,
                    bgcolor: (theme) => alpha(val ? theme.palette.error.main : theme.palette.success.main, 0.1),
                    color: val ? 'error.main' : 'success.main',
                  }}
                />
              </Box>
            ))}
          </Grid>

          {/* Lifestyle */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              {t('predictionHistory.detailDialog.sections.lifestyle')}
            </Typography>
            <InfoRow label={t('predictionHistory.detailDialog.lifestyleLabels.fastFood')} value={translateOption(t, 'yesNo', lh.fastFoodFreq)} />
            <InfoRow label={t('predictionHistory.detailDialog.lifestyleLabels.exercise')} value={translateOption(t, 'yesNo', lh.exerciseFreq)} />
            <InfoRow label={t('predictionHistory.detailDialog.lifestyleLabels.stressLevel')} value={translateOption(t, 'stress', lh.stressLevel)} />
            <InfoRow label={t('predictionHistory.detailDialog.lifestyleLabels.sleepHours')} value={lh.sleepHours} unit={t('predictionHistory.units.hrs')} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PredictionHistoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  const [viewPrediction, setViewPrediction] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['predictions', page, rowsPerPage],
    queryFn: () => predictionService.getAll({ page: page + 1, limit: rowsPerPage }),
  });

  const deleteMutation = useMutation({
    mutationFn: predictionService.delete,
    onSuccess: () => {
      toast.success(t('predictionHistory.toast.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || t('predictionHistory.toast.deleteError')),
  });

  const predictions = data?.data?.predictions || [];
  const total = data?.data?.total || 0;

  const getResultChip = (result) => {
    const isHigh = result === 'High Risk';
    return (
      <Chip
        label={translateRiskLabel(t, result)}
        size="small"
        sx={{
          bgcolor: (theme) => alpha(isHigh ? theme.palette.error.main : theme.palette.success.main, 0.12),
          color: isHigh ? 'error.main' : 'success.main',
          fontWeight: 700,
        }}
      />
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>{t('predictionHistory.pageTitle')}</Typography>
              <Typography color="text.secondary">{t('predictionHistory.pageSubtitle')}</Typography>
            </Box>
            <Button variant="contained" startIcon={<Science />} onClick={() => navigate(ROUTES.PREDICTION)}>
              {t('predictionHistory.newScreening')}
            </Button>
          </Box>

          <Card>
            {isLoading ? (
              <Box sx={{ py: 8 }}><Loading message={t('predictionHistory.loadingMessage')} /></Box>
            ) : predictions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Science sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>{t('predictionHistory.emptyState.title')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t('predictionHistory.emptyState.description')}
                </Typography>
                <Button variant="contained" onClick={() => navigate(ROUTES.PREDICTION)}>
                  {t('predictionHistory.emptyState.startButton')}
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell fontWeight={700}>{t('predictionHistory.table.columns.index')}</TableCell>
                        <TableCell><strong>{t('predictionHistory.table.columns.date')}</strong></TableCell>
                        <TableCell><strong>{t('predictionHistory.table.columns.result')}</strong></TableCell>
                        <TableCell><strong>{t('predictionHistory.table.columns.probability')}</strong></TableCell>
                        <TableCell><strong>{t('predictionHistory.table.columns.confidence')}</strong></TableCell>
                        <TableCell align="center"><strong>{t('predictionHistory.table.columns.actions')}</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {predictions.map((p, i) => (
                        <TableRow
                          key={p._id}
                          hover
                          sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}
                          onClick={() => setViewPrediction(p)}
                        >
                          <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {formatLocalizedDate(p.createdAt, i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatLocalizedDate(p.createdAt, i18n.language, { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </TableCell>
                          <TableCell>{getResultChip(p.result)}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={700} color={p.probability >= 50 ? 'error.main' : 'success.main'}>
                              {p.probability}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{p.confidence}%</Typography>
                          </TableCell>
                          <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                            <Tooltip title={t('predictionHistory.tooltips.viewDetails')}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => { e.stopPropagation(); setViewPrediction(p); }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('predictionHistory.tooltips.deletePrediction')}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => { e.stopPropagation(); setDeleteId(p._id); }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={total}
                  page={page}
                  onPageChange={(_, p) => setPage(p)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage={t('predictionHistory.pagination.rowsPerPage')}
                  labelDisplayedRows={({ from, to, count }) => t('predictionHistory.pagination.displayedRange', { from, to, count })}
                />
              </>
            )}
          </Card>

          {/* Medical disclaimer */}
          <Alert severity="info" sx={{ mt: 3 }}>
            {t('predictionHistory.disclaimer')}
          </Alert>
        </motion.div>
      </Container>

      {/* Prediction Detail Dialog */}
      <PredictionDetailDialog prediction={viewPrediction} onClose={() => setViewPrediction(null)} />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>{t('predictionHistory.deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <Typography>{t('predictionHistory.deleteDialog.message')}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">{t('common.cancel')}</Button>
          <Button onClick={() => deleteMutation.mutate(deleteId)} variant="contained" color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? t('predictionHistory.deleteDialog.deleting') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionHistoryPage;
