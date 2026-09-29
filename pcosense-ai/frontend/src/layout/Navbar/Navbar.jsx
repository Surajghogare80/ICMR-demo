// src/layout/Navbar/Navbar.jsx
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Tooltip, useTheme, alpha,
} from '@mui/material';
import {
  DarkMode, LightMode, Dashboard, History, Explore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/index.js';
import { APP_NAME } from '../../config/appConfig.js';
import LanguageSelector from '../../components/common/LanguageSelector.jsx';
import { COLORS } from '../../theme/index.js';

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
          : alpha(COLORS.white, 0.85),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 92, sm: 100 } }}>
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.03 }}>
          <Box
            component={Link}
            to={ROUTES.HOME}
            sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, minWidth: 0, textDecoration: 'none' }}
          >
            <Box component="img" src="/LOGO.jpg" alt="MapPMOS" sx={{ width: { xs: 56, sm: 84 }, height: { xs: 56, sm: 84 }, objectFit: 'cover', borderRadius: '22%', flexShrink: 0 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  whiteSpace: 'nowrap',
                  background: `linear-gradient(135deg, ${COLORS.secondaryDark}, ${COLORS.accentRose})`,
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
                  maxWidth: 240,
                }}
              >
                {t('brand.tagline')}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        {/* Nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
          <Button startIcon={<Dashboard />} onClick={() => navigate(ROUTES.DASHBOARD)} size="small">{t('nav.dashboard')}</Button>
          <Button startIcon={<Explore />} onClick={() => navigate(ROUTES.EXPLORE)} size="small">{t('nav.explore')}</Button>
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
