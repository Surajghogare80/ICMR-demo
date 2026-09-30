// src/layout/Loading/Loading.jsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../theme/index.js';

const Loading = ({ fullScreen = false, message }) => {
  const { t } = useTranslation();
  const displayMessage = message ?? t('loading.default_message');
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && {
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${COLORS.darkBg} 0%, ${COLORS.darkPaper} 100%)`
              : `linear-gradient(135deg, ${COLORS.lightBg} 0%, ${COLORS.lightBgAlt} 100%)`,
        }),
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: 'primary.main',
            filter: 'drop-shadow(0 0 12px rgba(21,101,192,0.6))',
          }}
        />
      </motion.div>
      <Typography
        variant="body2"
        sx={{ color: (theme) => fullScreen ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'text.secondary') : 'text.secondary', fontWeight: 500 }}
      >
        {displayMessage}
      </Typography>
    </Box>
  );

  return content;
};

export default Loading;
