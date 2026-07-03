// src/layout/Loading/Loading.jsx
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
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
          background: 'linear-gradient(135deg, #0A0E1A 0%, #111827 100%)',
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
        sx={{ color: fullScreen ? 'rgba(255,255,255,0.6)' : 'text.secondary', fontWeight: 500 }}
      >
        {message}
      </Typography>
    </Box>
  );

  return content;
};

export default Loading;
