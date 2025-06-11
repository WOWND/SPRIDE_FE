import React from 'react';
import AppRouter from './routes/AppRouter';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import TaxiPodPage from './pages/TaxiPod/TaxiPodPage';
import TaxiPodDetailPage from './pages/TaxiPod/TaxiPodDetailPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App; 