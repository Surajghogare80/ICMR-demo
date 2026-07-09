// src/pages/Profile/ProfilePage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box, Container, Typography, Card, CardContent, TextField,
  Button, Grid, Avatar, Divider, Alert,
} from '@mui/material';
import { Person, Lock, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  });

  const { register: pwdReg, handleSubmit: pwdSubmit, reset: pwdReset, formState: { errors: pwdErrors } } = useForm();

  const onUpdateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPwdLoading(true);
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully!');
      pwdReset();
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>Profile Settings</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>Manage your account information and password</Typography>

          {/* Profile Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #EC407A, #F48FB1)', fontSize: '1.8rem', fontWeight: 700 }}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
                  <Typography color="text.secondary">{user?.email}</Typography>
                  <Typography variant="caption" color="primary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onUpdateProfile)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading} sx={{ mt: 3 }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Lock color="primary" />
                <Typography variant="h6" fontWeight={700}>Change Password</Typography>
              </Box>

              <Box component="form" onSubmit={pwdSubmit(onChangePassword)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      {...pwdReg('currentPassword', { required: 'Current password is required' })}
                      error={!!pwdErrors.currentPassword}
                      helperText={pwdErrors.currentPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      {...pwdReg('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 8, message: 'Minimum 8 characters' },
                      })}
                      error={!!pwdErrors.newPassword}
                      helperText={pwdErrors.newPassword?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Confirm New Password" type="password" {...pwdReg('confirmPassword')} />
                  </Grid>
                </Grid>
                <Button type="submit" variant="outlined" startIcon={<Lock />} disabled={pwdLoading} sx={{ mt: 3 }}>
                  {pwdLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProfilePage;
