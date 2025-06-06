import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ShuttlePage from '../pages/Shuttle/ShuttlePage';
import LoginPage from '../pages/Auth/LoginPage';
import AuthCallbackPage from '../pages/Auth/AuthCallbackPage';
import SignupPage from '../pages/Auth/SignupPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ShuttlePage />} />
        </Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/auth/callback' element={<AuthCallbackPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter; 