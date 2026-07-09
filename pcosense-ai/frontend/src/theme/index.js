// src/theme/index.js
import { createTheme, alpha } from '@mui/material/styles';

const COLORS = {
  primary: '#E91E63',
  primaryLight: '#F06292',
  primaryDark: '#C2185B',
  secondary: '#F8BBD0',
  secondaryLight: '#FFEAF0',
  secondaryDark: '#EC407A',
  accent: '#F06292',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: '#F06292',
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
      contrastText: '#2D2D2D',
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: '#1A0A0F', // deep mulberry dark background
            paper: '#2D1C22',   // dark mulberry paper card
          },
          text: {
            primary: '#FCE4EC',
            secondary: '#C2A9B2',
          },
          divider: alpha('#F8BBD0', 0.12),
        }
      : {
          background: {
            default: '#FFF8FB', // calming soft light pink/white background
            paper: '#FFFFFF',
          },
          text: {
            primary: '#2D2D2D',
            secondary: '#757575',
          },
          divider: alpha('#E91E63', 0.08),
        }),
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    error: { main: COLORS.error },
    info: { main: COLORS.info },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.25 },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, letterSpacing: '0.01em' },
    subtitle2: { fontWeight: 500, fontSize: '0.8rem' },
    body1: { lineHeight: 1.7, fontWeight: 400 },
    body2: { lineHeight: 1.6, fontSize: '0.875rem', fontWeight: 400 },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
  },
  shape: { borderRadius: 20 }, // Beautiful 20px border radius
  shadows: [
    'none',
    '0 2px 4px rgba(233,30,99,0.02)',
    '0 4px 12px rgba(233,30,99,0.03)',
    '0 8px 24px rgba(233,30,99,0.04)',
    '0 12px 32px rgba(233,30,99,0.06)',
    '0 16px 40px rgba(233,30,99,0.08)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Pill shape
          padding: '10px 24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(233,30,99,0.18)',
            transform: 'translateY(-1.5px)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)`,
          color: '#FFFFFF',
          '&:hover': {
            background: `linear-gradient(135deg, #E91E63 0%, #EC407A 100%)`,
            boxShadow: '0 8px 24px rgba(233,30,99,0.25)',
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, #F8BBD0 0%, #FFEAF0 100%)`,
          color: '#C2185B',
          '&:hover': {
            background: `linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)`,
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(233,30,99,0.15)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha('#E91E63', 0.5),
          color: '#E91E63',
          '&:hover': {
            borderColor: '#E91E63',
            background: alpha('#E91E63', 0.04),
          },
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
              ? '0 10px 40px rgba(0,0,0,0.45)'
              : '0 8px 30px rgba(233,30,99,0.035)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'all 0.2s ease',
            '&:hover fieldset': {
              borderColor: alpha('#E91E63', 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E91E63',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 12, fontWeight: 500 },
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
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)',
        },
      },
    },
  },
});

export const createAppTheme = (mode = 'light') =>
  createTheme(getDesignTokens(mode));

export { COLORS };
