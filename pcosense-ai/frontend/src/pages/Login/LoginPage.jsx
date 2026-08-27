// src/pages/Login/LoginPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, InputAdornment, IconButton, Divider, Alert,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const schema = useMemo(() => yup.object({
    email: yup.string().email(t('errors.invalid_email')).required(t('errors.email_required')),
    password: yup.string().required(t('errors.password_required')),
  }), [t]);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    const result = await login(data);
    if (result.success) {
      navigate(result.user?.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', py: 4 }}>
      {/* Background */}
      <Box sx={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(233,30,99,0.06), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(240,98,146,0.05), transparent 60%)', pointerEvents: 'none' }} />
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #EC407A, #F48FB1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, fontSize: '1.6rem' }}>🧬</Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>{t('auth.login.title')}</Typography>
            <Typography color="text.secondary">{t('auth.login.subtitle', { appName: APP_NAME })}</Typography>
          </Box>

          <Card sx={{ p: 1 }}>
            <CardContent sx={{ p: 4 }}>
              {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  id="login-email"
                  label={t('auth.login.email_label')}
                  fullWidth
                  margin="normal"
                  autoComplete="email"
                  autoFocus
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  id="login-password"
                  label={t('auth.login.password_label')}
                  type={showPwd ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  autoComplete="current-password"
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}
                >
                  {loading ? t('auth.login.submitting') : t('auth.login.submit')}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">{t('auth.login.no_account')}</Typography>
              </Divider>

              <Button fullWidth variant="outlined" component={Link} to={ROUTES.REGISTER} size="large">
                {t('auth.login.create_account')}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  <Link to={ROUTES.HOME} style={{ color: 'inherit', textDecoration: 'none' }}>
                    ← {t('auth.login.back_home')}
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
