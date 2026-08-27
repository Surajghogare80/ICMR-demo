// src/pages/Register/RegisterPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, InputAdornment, IconButton, Alert, Grid,
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const schema = useMemo(() => yup.object({
    name: yup.string().min(2, t('auth.register.validation.name_min')).required(t('auth.register.validation.name_required')),
    email: yup.string().email(t('errors.invalid_email')).required(t('errors.email_required')),
    password: yup
      .string()
      .min(8, t('auth.register.validation.password_min'))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('auth.register.validation.password_pattern'))
      .required(t('errors.password_required')),
    confirmPassword: yup.string().oneOf([yup.ref('password')], t('auth.register.validation.confirm_password_mismatch')).required(t('auth.register.validation.confirm_password_required')),
  }), [t]);

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
            <Typography variant="h4" fontWeight={800} gutterBottom>{t('auth.register.title')}</Typography>
            <Typography color="text.secondary">{t('auth.register.subtitle', { appName: APP_NAME })}</Typography>
          </Box>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ p: 4 }}>
              {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  id="register-name"
                  label={t('auth.register.name_label')}
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
                  label={t('auth.register.email_label')}
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
                  label={t('auth.register.password_label')}
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
                  label={t('auth.register.confirm_password_label')}
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
                  {loading ? t('auth.register.submitting') : t('auth.register.submit')}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.register.have_account')}{' '}
                    <Link to={ROUTES.LOGIN} style={{ color: '#E91E63', fontWeight: 600 }}>{t('auth.register.sign_in_link')}</Link>
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
