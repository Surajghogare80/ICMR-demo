// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/index.js';

// Pages
import LandingPage from '../pages/Landing/LandingPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import PredictionWizard from '../pages/Prediction/PredictionWizard.jsx';
import PredictionResult from '../pages/Prediction/PredictionResult.jsx';
import PredictionHistoryPage from '../pages/PredictionHistory/PredictionHistoryPage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';
import ExplorePage from '../pages/Explore/ExplorePage.jsx';
import ExploreArticlePage from '../pages/Explore/ExploreArticlePage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      <Route path={ROUTES.PREDICTION} element={<PredictionWizard />} />
      <Route path={ROUTES.PREDICTION_RESULT} element={<PredictionResult />} />
      <Route path={ROUTES.HISTORY} element={<PredictionHistoryPage />} />
      <Route path={ROUTES.EXPLORE} element={<ExplorePage />} />
      <Route path={ROUTES.EXPLORE_ARTICLE} element={<ExploreArticlePage />} />

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
