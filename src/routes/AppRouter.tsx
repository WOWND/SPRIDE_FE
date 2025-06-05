import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ShuttlePage from '../pages/Shuttle/ShuttlePage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ShuttlePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
); 