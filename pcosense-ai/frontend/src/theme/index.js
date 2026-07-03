// src/theme/index.js
import { createTheme, alpha } from '@mui/material/styles';

const COLORS = {
  primary: '#1565C0',
  primaryLight: '#1976D2',
  primaryDark: '#0D47A1',
  secondary: '#00897B',
  secondaryLight: '#26A69A',
  secondaryDark: '#00695C',
  accent: '#7C4DFF',
  success: '#2E7D32',
  warning: '#F57F17',
  error: '#C62828',
  info: '#0277BD',
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: COLORS.primary,
      light: COLORS.primaryLight,
      dark: COLORS.primaryDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: COLORS.secondary,
      light: COLORS.secondaryLight,
      dark: COLORS.secondaryDark,
      contrastText: '#FFFFFF',
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: '#0A0E1A',
            paper: '#111827',
          },
          text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
          },
          divider: alpha('#94A3B8', 0.12),
        }
      : {
          background: {
            default: '#F0F4FF',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
          },
          divider: alpha('#1565C0', 0.08),
        }),
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.error },
    info: { main: COLORS.info },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 500, fontSize: '0.8rem' },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6, fontSize: '0.875rem' },
    button: { fontWeight: 600, letterSpacing: '0.03em', textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 4px 6px rgba(0,0,0,0.07)',
    '0 8px 16px rgba(0,0,0,0.08)',
    '0 12px 24px rgba(0,0,0,0.09)',
    '0 16px 32px rgba(0,0,0,0.10)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(21,101,192,0.3)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 20,
          border: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(20px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 4px 24px rgba(21,101,192,0.08)',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8 },
        bar: { borderRadius: 8 },
      },
    },
  },
});

export const createAppTheme = (mode = 'light') =>
  createTheme(getDesignTokens(mode));

export { COLORS };
