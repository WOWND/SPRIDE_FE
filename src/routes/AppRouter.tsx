import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ShuttlePage from '../pages/Shuttle/ShuttlePage';
import LoginPage from '../pages/Auth/LoginPage';
import KakaoCallbackPage from '../pages/Auth/KakaoCallbackPage';
import SignupPage from '../pages/Auth/SignupPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import TaxiPage from '../pages/Taxi/TaxiPage';
import LostPage from '../pages/Lost/LostPage';
import ShuttleDetailPage from '../pages/Shuttle/ShuttleDetailPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/auth/kakao/callback' element={<KakaoCallbackPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<ShuttlePage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="taxi" element={<TaxiPage />} />
          <Route path="lost" element={<LostPage />} />
          <Route path="shuttle/:id" element={<ShuttleDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter; 