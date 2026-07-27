// src/pages/Register/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, InputAdornment, IconButton, Alert, Grid,
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and a number')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
});

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    const { confirmPassword, ...formData } = data;
    const result = await registerUser(formData);
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', py: 4 }}>
      <Box sx={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(233,30,99,0.06), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(240,98,146,0.05), transparent 60%)', pointerEvents: 'none' }} />
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #EC407A, #F48FB1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '1.6rem' }}>🧬</Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>Create Account</Typography>
            <Typography color="text.secondary">Join {APP_NAME} for free</Typography>
          </Box>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ p: 4 }}>
              {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  id="register-name"
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  autoFocus
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  id="register-email"
                  label="Email Address"
                  fullWidth
                  margin="normal"
                  autoComplete="email"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  id="register-password"
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                          {showPwd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  id="register-confirm-password"
                  label="Confirm Password"
                  type={showPwd ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment> }}
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} style={{ color: '#E91E63', fontWeight: 600 }}>Sign in</Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default RegisterPage;
