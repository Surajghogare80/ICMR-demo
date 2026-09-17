// src/App.jsx
import { useState, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { createAppTheme, COLORS } from './theme/index.js';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './layout/Navbar/Navbar.jsx';
import Footer from './layout/Footer/Footer.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [mode, setMode] = useState('dark');
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar onThemeToggle={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))} isDark={mode === 'dark'} />
            <Box sx={{ flexGrow: 1 }}>
              <AppRoutes />
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>

        {/*
          Global Toast Notifications — colorblind-safe by design:
          - success/error/warning never rely on hue alone. Each severity keeps
            react-hot-toast's distinct icon glyph (check / cross) AND gets its
            own thick left border stripe, so shape + border + the message text
            all carry the meaning, not just color.
          - error uses vermillion (COLORS.error) instead of red so it doesn't
            collapse into success-green or warning-amber for red-green color
            blindness (the most common form).
        */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: mode === 'dark' ? COLORS.navy : COLORS.white,
              color: mode === 'dark' ? COLORS.navyLight : COLORS.navyDark,
              borderRadius: '12px',
              border: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(21,101,192,0.1)'}`,
              borderLeft: `5px solid ${mode === 'dark' ? 'rgba(148,163,184,0.4)' : 'rgba(21,101,192,0.3)'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: COLORS.success, secondary: COLORS.white },
              style: { borderLeft: `5px solid ${COLORS.success}` },
            },
            error: {
              iconTheme: { primary: COLORS.error, secondary: COLORS.white },
              style: { borderLeft: `5px solid ${COLORS.error}` },
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
