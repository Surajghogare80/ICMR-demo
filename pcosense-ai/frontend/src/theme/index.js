// src/theme/index.js
import { createTheme, alpha } from '@mui/material/styles';

const COLORS = {
  // Brand
  primary: '#E91E63',
  primaryLight: '#F06292',
  primaryDark: '#C2185B',
  primaryDarker: '#AD1457',
  secondary: '#F8BBD0',
  secondaryLight: '#FFEAF0',
  secondaryDark: '#EC407A',
  secondaryPale: '#FCE4EC',
  accent: '#F06292',
  accentRose: '#F48FB1',
  accentRoseDeep: '#D81B60',

  // Colorblind-safe status colors: avoid red/green and blue/purple pairs that
  // collapse under protanopia/deuteranopia. Success stays green (paired with a
  // check icon everywhere it's used); error uses a vermillion/orange-red instead
  // of pure red so it reads distinctly from both success-green and warning-amber;
  // info uses navy blue, which stays distinct across all common colorblind types.
  success: '#009E73',
  warning: '#F9A825',
  error: '#BF360C',
  info: '#0277BD',

  // Risk / result bands (prediction probability & screening outcomes)
  riskLow: '#009E73',
  riskModerate: '#FBC02D',
  riskDetected: '#F88131',
  riskHigh: '#EF5350',
  riskHighLight: '#EF9A9A',
  riskUnknown: '#9E9E9E',
  riskUnknownLight: '#BDBDBD',

  // BMI / WHR status bands
  bmiUnderweight: '#2196F3',
  bmiNormal: '#009E73',
  bmiOverweight: '#FF9800',
  bmiObesity1: '#FB8C00',
  bmiObesity2: '#F4511E',
  bmiObesity3: '#F44336',

  // Decorative accent palette (dashboard cards, icons, gradients)
  purple: '#7E57C2',
  purpleLight: '#B39DDB',
  purpleDark: '#4A148C',
  purpleAccent: '#BA68C8',
  purpleSoft: '#CE93D8',
  purpleBgLight: '#F3E5F5',
  teal: '#26C6DA',
  tealLight: '#80DEEA',
  tealDeep: '#00897B',
  orange: '#FFA726',
  orangeLight: '#FFD54F',
  orangeMid: '#FFB74D',
  orangePale: '#FFF8E1',
  orangeDeep: '#FB8C00',
  orangeDark: '#E65100',
  blue: '#2196F3',
  blueLight: '#90CAF9',
  blueDark: '#1565C0',
  blueDarker: '#1976D2',
  red: '#F44336',
  redSoft: '#EF5350',
  redSoftLight: '#EF9A9A',
  redDark: '#C62828',
  redDarker: '#B71C1C',
  redMaterial: '#D32F2F',

  // Neutral / gray
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#BDBDBD',
  grayMuted: '#757575',
  offWhite: '#F8F9FA',
  offWhiteHover: '#F5F5F5',
  slate: '#64748B',
  slateLight: '#E2E8F0',
  slateDark: '#475569',
  navy: '#1E293B',
  navyLight: '#F1F5F9',
  navyDark: '#0F172A',

  // Surfaces
  darkBg: '#1A0A0F',
  darkPaper: '#2D1C22',
  darkPaperAlt: '#2D1D23',
  darkPaperAlt2: '#1F0D15',
  lightBg: '#FFF8FB',
  lightBgAlt: '#FFF0F5',
  lightBgAlt2: '#FFE4EC',
  textDark: '#2D2D2D',
  textMutedDark: '#C2A9B2',

  // One-off illustration colors (menstrual cycle SVG icon)
  illustrationBlue: '#4299E1',
  illustrationBlueLight: '#A3D3F7',
  illustrationPurple: '#8B5CF6',
  illustrationRose: '#F43F5E',
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: COLORS.primary,
      light: COLORS.primaryLight,
      dark: COLORS.primaryDark,
      contrastText: COLORS.white,
    },
    secondary: {
      main: COLORS.secondary,
      light: COLORS.secondaryLight,
      dark: COLORS.secondaryDark,
      contrastText: COLORS.textDark,
    },
    ...(mode === 'dark'
      ? {
          background: {
            default: COLORS.darkBg, // deep mulberry dark background
            paper: COLORS.darkPaper,   // dark mulberry paper card
          },
          text: {
            primary: COLORS.secondaryPale,
            secondary: COLORS.textMutedDark,
          },
          divider: alpha(COLORS.secondary, 0.12),
        }
      : {
          background: {
            default: COLORS.lightBg, // calming soft light pink/white background
            paper: COLORS.white,
          },
          text: {
            primary: COLORS.textDark,
            secondary: COLORS.grayMuted,
          },
          divider: alpha(COLORS.primary, 0.08),
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
          background: `linear-gradient(135deg, ${COLORS.secondaryDark} 0%, ${COLORS.accentRose} 100%)`,
          color: COLORS.white,
          '&:hover': {
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondaryDark} 100%)`,
            boxShadow: '0 8px 24px rgba(233,30,99,0.25)',
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.secondaryLight} 100%)`,
          color: COLORS.primaryDark,
          '&:hover': {
            background: `linear-gradient(135deg, ${COLORS.secondaryDark} 0%, ${COLORS.accentRose} 100%)`,
            color: COLORS.white,
            boxShadow: '0 8px 24px rgba(233,30,99,0.15)',
          },
        },
        outlinedPrimary: {
          borderColor: alpha(COLORS.primary, 0.5),
          color: COLORS.primary,
          '&:hover': {
            borderColor: COLORS.primary,
            background: alpha(COLORS.primary, 0.04),
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
              borderColor: alpha(COLORS.primary, 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary,
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
          background: `linear-gradient(135deg, ${COLORS.secondaryDark} 0%, ${COLORS.accentRose} 100%)`,
        },
      },
    },
  },
});

export const createAppTheme = (mode = 'light') =>
  createTheme(getDesignTokens(mode));

export { COLORS };
