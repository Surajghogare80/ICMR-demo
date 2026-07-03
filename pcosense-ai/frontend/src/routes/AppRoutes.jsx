// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROUTES } from '../constants/index.js';
import Loading from '../layout/Loading/Loading.jsx';

// Pages (lazy load in production, direct import for development)
import LandingPage from '../pages/Landing/LandingPage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import RegisterPage from '../pages/Register/RegisterPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import PredictionWizard from '../pages/Prediction/PredictionWizard.jsx';
import PredictionResult from '../pages/Prediction/PredictionResult.jsx';
import PredictionHistoryPage from '../pages/PredictionHistory/PredictionHistoryPage.jsx';
import ProfilePage from '../pages/Profile/ProfilePage.jsx';
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, initializing } = useAuth();

  if (initializing) return <Loading fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (adminOnly && !isAdmin) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
};

// Guest-only route wrapper (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) return <Loading fullScreen />;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />

      {/* Guest-only routes */}
      <Route path={ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path={ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected user routes */}
      <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path={ROUTES.PREDICTION} element={<ProtectedRoute><PredictionWizard /></ProtectedRoute>} />
      <Route path={ROUTES.PREDICTION_RESULT} element={<ProtectedRoute><PredictionResult /></ProtectedRoute>} />
      <Route path={ROUTES.HISTORY} element={<ProtectedRoute><PredictionHistoryPage /></ProtectedRoute>} />
      <Route path={ROUTES.PROFILE} element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin-only routes */}
      <Route path={ROUTES.ADMIN} element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
