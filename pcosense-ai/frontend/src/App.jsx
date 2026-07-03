// src/App.jsx
import { useState, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { createAppTheme } from './theme/index.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
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
        <AuthProvider>
          <BrowserRouter>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar onThemeToggle={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))} isDark={mode === 'dark'} />
              <Box sx={{ flexGrow: 1 }}>
                <AppRoutes />
              </Box>
              <Footer />
            </Box>
          </BrowserRouter>
        </AuthProvider>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
              color: mode === 'dark' ? '#F1F5F9' : '#0F172A',
              borderRadius: '12px',
              border: `1px solid ${mode === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(21,101,192,0.1)'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: '#2E7D32', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#C62828', secondary: '#fff' },
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
