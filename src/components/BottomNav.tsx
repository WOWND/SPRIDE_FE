import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
  const t = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  //const { isLoggedIn, openLoginModal, setRedirectPath } = useAuth();
  const { isAuthenticated, openLoginModal, setRedirectPath, isLoadingAuth } = useAuth();


  console.log('BottomNav - isLoggedIn:', isAuthenticated);

  const navs: { key: string; icon: string; labelKey: keyof typeof t; path: string }[] = [
    { key: 'shuttle', icon: '🚌', labelKey: 'navShuttle', path: '/' },
    { key: 'taxi', icon: '🚕', labelKey: 'navTaxi', path: '/taxi' },
    { key: 'lost', icon: '📦', labelKey: 'navLost', path: '/lost' },
    { key: 'profile', icon: '👤', labelKey: 'navProfile', path: '/profile' },
  ];

  const handleNavClick = (path: string) => {
    if (path === '/profile' && !isAuthenticated) {
      setRedirectPath(path);
      openLoginModal();
    } else {
      navigate(path);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50px',
      background: 'white',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTop: '1px solid #eee',
      padding: '0 20px',
      zIndex: 1000,
    }}>
      {navs.map((nav) => {
        const isActive = location.pathname === nav.path;
        return (
          <button
            key={nav.key}
            onClick={() => handleNavClick(nav.path)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? '#00bcd4' : '#888',
              fontWeight: isActive ? 700 : 400,
              fontSize: 22,
              cursor: 'pointer',
              flex: 1,
              padding: 0,
            }}
          >
            <span style={{ fontSize: 26, marginBottom: 2 }}>{nav.icon}</span>
            <span style={{ fontSize: 12 }}>{t[nav.labelKey]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav; 