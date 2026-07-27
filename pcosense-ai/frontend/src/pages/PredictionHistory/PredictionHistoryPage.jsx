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
import { predictionService } from '../../services/predictionService.js';
import { ROUTES } from '../../constants/index.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';

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
          <Typography variant="h6" fontWeight={700}>Prediction Details</Typography>
          <Typography variant="caption" color="text.secondary">
            {prediction.createdAt ? new Date(prediction.createdAt).toLocaleString('en-IN') : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                <Typography variant="caption" color="text.secondary">Risk Probability</Typography>
                <Typography variant="h5" fontWeight={800} color={resultColor}>{prediction.probability}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Model Confidence</Typography>
                <Typography variant="h5" fontWeight={800}>{prediction.confidence}%</Typography>
              </Box>
            </Box>
            <Divider />
          </Grid>

          {/* Personal Info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              👤 Personal Info
            </Typography>
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
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              🩸 Menstrual
            </Typography>
            <InfoRow label="Cycle Length" value={mh.cycleLength} unit="days" />
            <InfoRow label="Period Duration" value={mh.periodDuration} unit="days" />
            <InfoRow label="Regularity" value={mh.cycleRegularity} />
            <InfoRow label="Flow Intensity" value={mh.flowIntensity} />
            <InfoRow label="Family History of PCOS" value={mh.familyHistory !== undefined && mh.familyHistory !== null ? (mh.familyHistory ? 'Yes' : 'No') : '—'} />
          </Grid>

          {/* Blood Report — Page 1 */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              🔬 Blood Report (Standard)
            </Typography>
            <InfoRow label="FSH" value={pm.fsh} unit="mIU/mL" />
            <InfoRow label="LH" value={pm.lh} unit="mIU/mL" />
            <InfoRow label="TSH" value={pm.tsh} unit="mIU/L" />
            <InfoRow label="AMH" value={pm.amh} unit="ng/mL" />
            <InfoRow label="Haemoglobin" value={pm.hb} unit="g/dL" />
            <InfoRow label="Random Blood Sugar" value={pm.rbs} unit="mg/dL" />
          </Grid>

          {/* Blood Report — Page 2 (Extended) */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'secondary.main' }}>
              💉 Blood Report (Extended)
            </Typography>
            <InfoRow label="Vitamin D3" value={pm.vitD3} unit="ng/mL" />
            <InfoRow label="SHBG" value={pm.shbg} unit="nmol/L" />
            <InfoRow label="Fasting Insulin" value={pm.fastingInsulin} unit="µIU/mL" />
            <InfoRow label="Insulin Resistance (HOMA-IR)" value={pm.insulinResistance} />
          </Grid>

          {/* Symptoms */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'primary.main' }}>
              🩺 Symptoms
            </Typography>
            {[
              ['Weight Gain', cs.weightGain],
              ['Excessive Hair Growth', cs.hairGrowth],
              ['Skin Darkening', cs.skinDarkening],
              ['Acne / Pimples', cs.pimples],
              ['Hair Loss', cs.hairLoss],
            ].map(([label, val]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Chip label={val ? 'Yes' : 'No'} size="small"
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
              🏃 Lifestyle
            </Typography>
            <InfoRow label="Fast Food" value={lh.fastFoodFreq} />
            <InfoRow label="Exercise" value={lh.exerciseFreq} />
            <InfoRow label="Stress Level" value={lh.stressLevel} />
            <InfoRow label="Sleep Hours" value={lh.sleepHours} unit="hrs" />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PredictionHistoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      toast.success('Prediction deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete prediction.'),
  });

  const predictions = data?.data?.predictions || [];
  const total = data?.data?.total || 0;

  const getResultChip = (result) => {
    const isHigh = result === 'High Risk';
    return (
      <Chip
        label={result}
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
              <Typography variant="h4" fontWeight={800} gutterBottom>Prediction History</Typography>
              <Typography color="text.secondary">Your complete PCOS screening history</Typography>
            </Box>
            <Button variant="contained" startIcon={<Science />} onClick={() => navigate(ROUTES.PREDICTION)}>
              New Screening
            </Button>
          </Box>

          <Card>
            {isLoading ? (
              <Box sx={{ py: 8 }}><Loading message="Loading prediction history..." /></Box>
            ) : predictions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Science sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>No predictions yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Complete your first PCOS screening to see results here.
                </Typography>
                <Button variant="contained" onClick={() => navigate(ROUTES.PREDICTION)}>
                  Start Screening
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell fontWeight={700}>#</TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Result</strong></TableCell>
                        <TableCell><strong>Probability</strong></TableCell>
                        <TableCell><strong>Confidence</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
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
                              {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(p.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
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
                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => { e.stopPropagation(); setViewPrediction(p); }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete prediction">
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
                />
              </>
            )}
          </Card>

          {/* Medical disclaimer */}
          <Alert severity="info" sx={{ mt: 3 }}>
            All predictions are generated for educational purposes only. Consult a medical professional for clinical evaluation.
          </Alert>
        </motion.div>
      </Container>

      {/* Prediction Detail Dialog */}
      <PredictionDetailDialog prediction={viewPrediction} onClose={() => setViewPrediction(null)} />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Delete Prediction</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this prediction? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">Cancel</Button>
          <Button onClick={() => deleteMutation.mutate(deleteId)} variant="contained" color="error" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionHistoryPage;
