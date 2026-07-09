// src/pages/PredictionHistory/PredictionHistoryPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Button,
  TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Tooltip, alpha,
} from '@mui/material';
import { Delete, Visibility, Science } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { predictionService } from '../../services/predictionService.js';
import { ROUTES } from '../../constants/index.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';

const PredictionHistoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);

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
                        <TableRow key={p._id} hover sx={{ '&:last-child td': { border: 0 } }}>
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
                          <TableCell align="center">
                            <Tooltip title="Delete prediction">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteId(p._id)}
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
