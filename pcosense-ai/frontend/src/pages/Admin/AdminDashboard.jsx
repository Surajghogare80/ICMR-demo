// src/pages/Admin/AdminDashboard.jsx
import { useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemText, Divider, LinearProgress, Tooltip,
} from '@mui/material';
import { People, Science, Warning, CheckCircle, Delete, Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/predictionService.js';
import Loading from '../../layout/Loading/Loading.jsx';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

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
  const logs = stats?.recentLogs || [];

  const statCards = stats ? [
    { title: 'Total Users', value: stats.totalUsers, icon: <People />, color: '#E91E63' },
    { title: 'Total Predictions', value: stats.totalPredictions, icon: <Science />, color: '#F06292' },
    { title: 'High Risk Cases', value: stats.highRiskCount, icon: <Warning />, color: '#EF5350' },
    { title: 'Low Risk Cases', value: stats.lowRiskCount, icon: <CheckCircle />, color: '#66BB6A' },
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
          </Grid>
        </motion.div>
      </Container>

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
