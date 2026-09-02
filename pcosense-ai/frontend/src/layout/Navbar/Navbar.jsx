// src/layout/Navbar/Navbar.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Tooltip, useTheme, alpha,
} from '@mui/material';
import {
  DarkMode, LightMode, Dashboard, History, Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME, APP_FULL_FORM } from '../../config/appConfig.js';
import LanguageSelector from '../../components/common/LanguageSelector.jsx';

const Navbar = ({ onThemeToggle, isDark }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

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
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  background: 'linear-gradient(135deg, #EC407A, #F48FB1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.4,
                }}
              >
                {APP_NAME}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.secondary',
                  fontSize: '0.65rem',
                  lineHeight: 1.1,
                }}
              >
                {APP_FULL_FORM}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {/* Nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
          <Button startIcon={<Dashboard />} onClick={() => navigate(ROUTES.DASHBOARD)} size="small">{t('nav.dashboard')}</Button>
          <Button startIcon={<Favorite />} onClick={() => navigate(ROUTES.LIFESTYLE)} size="small">{t('nav.lifestyle')}</Button>
          <Button startIcon={<History />} onClick={() => navigate(ROUTES.HISTORY)} size="small">{t('nav.history')}</Button>
        </Box>

        {/* Language selector */}
        <LanguageSelector />

        {/* Theme toggle */}
        <Tooltip title={isDark ? t('nav.light_mode') : t('nav.dark_mode')}>
          <IconButton onClick={onThemeToggle} size="small">
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
