// src/layout/Navbar/Navbar.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Avatar,
  Menu, MenuItem, Box, Tooltip, Divider, Badge, useTheme, alpha,
} from '@mui/material';
import {
  DarkMode, LightMode, Notifications, AccountCircle,
  Dashboard, History, AdminPanelSettings, Logout, Person, Favorite
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';
import LanguageSelector from '../../components/common/LanguageSelector.jsx';

const Navbar = ({ onThemeToggle, isDark }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: isDark
          ? alpha(theme.palette.background.paper, 0.85)
          : alpha('#FFFFFF', 0.85),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Box
            component={Link}
            to={ROUTES.HOME}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
          >
            <Box
              sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.1rem' }}>🧬</Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {/* Nav links (authenticated) */}
        {isAuthenticated && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            <Button startIcon={<Dashboard />} onClick={() => navigate(ROUTES.DASHBOARD)} size="small">{t('nav.dashboard')}</Button>
            <Button startIcon={<Favorite />} onClick={() => navigate(ROUTES.LIFESTYLE)} size="small">{t('nav.lifestyle')}</Button>
            <Button startIcon={<History />} onClick={() => navigate(ROUTES.HISTORY)} size="small">{t('nav.history')}</Button>
            {isAdmin && (
              <Button startIcon={<AdminPanelSettings />} onClick={() => navigate(ROUTES.ADMIN)} size="small" color="secondary">{t('nav.admin')}</Button>
            )}
          </Box>
        )}

        {/* Language selector */}
        <LanguageSelector />

        {/* Theme toggle */}
        <Tooltip title={isDark ? t('nav.light_mode') : t('nav.dark_mode')}>
          <IconButton onClick={onThemeToggle} size="small">
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {/* Auth buttons / user menu */}
        {isAuthenticated ? (
          <>
            <Tooltip title={user?.name}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #EC407A, #F48FB1)', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { borderRadius: 3, minWidth: 200, mt: 1 } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); navigate(ROUTES.PROFILE); }}>
                <Person fontSize="small" sx={{ mr: 1.5 }} /> {t('nav.profile')}
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); navigate(ROUTES.DASHBOARD); }}>
                <Dashboard fontSize="small" sx={{ mr: 1.5 }} /> {t('nav.dashboard')}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Logout fontSize="small" sx={{ mr: 1.5 }} /> {t('nav.logout')}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => navigate(ROUTES.LOGIN)}>{t('nav.login')}</Button>
            <Button variant="contained" size="small" onClick={() => navigate(ROUTES.REGISTER)}>{t('nav.signup')}</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
