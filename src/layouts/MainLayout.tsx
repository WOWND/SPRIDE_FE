import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';
import BottomNav from '../components/BottomNav';
import { useI18n } from '../hooks/useI18n';
import logo from '../assets/spride_logo.png';
import Modal from '../components/Modal/Modal';
import LoginPage from '../pages/Auth/LoginPage';
import { useAuth } from '../contexts/AuthContext';

const fontFamily = `'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', 'sans-serif'`;
const titleFontFamily = `'GmarketSansBold', 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Segoe UI', 'sans-serif'`;

const MainLayout = () => {
  const t = useI18n();
  const { isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5fafd', fontFamily }}>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 200,
          background: '#6ec6ca',
          padding: '14px 0 14px 24px',
          textAlign: 'left',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          borderBottom: '1px solid #b2ebf2',
        }}
      >
        <button
          onClick={handleLogoClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            color: 'inherit',
            font: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img src={logo} alt="logo" style={{ height: 40, marginRight: 8 }} />
          <span style={{ position: 'relative', top: 4, fontFamily: titleFontFamily }}>{t.title}</span>
        </button>
        <span style={{ marginLeft: 'auto', marginRight: 32 }}><LanguageSelector size={36} /></span>
      </header>
      <main style={{ background: '#fff', minHeight: 'calc(100vh - 120px)', paddingTop: 68 }}>
        <Outlet />
      </main>
      <BottomNav />

      {/* 로그인 모달 */}
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <LoginPage />
      </Modal>
    </div>
  );
};

export default MainLayout;