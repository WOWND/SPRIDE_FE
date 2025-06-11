import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import kakaoLogo from '../../assets/kakao_logo.png';
import googleLogo from '../../assets/google_logo.png';
import serviceLogo from '../../assets/spride_logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  // 추후 로그인 처리 함수 등을 props로 받을 수 있음
  onKakaoLogin?: () => void;
  onGoogleLogin?: () => void;
  onClose?: () => void; // 모달 닫기 함수 추가
}

// VITE 환경에서 환경 변수는 import.meta.env로 접근합니다.
const KAKAO_AUTH_BASE_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=8b92984a001a2c6e01bcbddd6081a7cb&redirect_uri=${import.meta.env.VITE_CLIENT_URL}/auth/kakao/callback`;

const LoginPage: React.FC<LoginPageProps> = ({ onKakaoLogin, onGoogleLogin, onClose }) => {
  const t = useI18n();
  const { login, redirectPath, setRedirectPath, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    if (onKakaoLogin) {
        onKakaoLogin();
    }
    const finalKakaoAuthUrl = redirectPath
      ? `${KAKAO_AUTH_BASE_URL}&returnTo=${encodeURIComponent(redirectPath)}`
      : KAKAO_AUTH_BASE_URL;
    window.location.href = finalKakaoAuthUrl;
  };

  const handleGoogleLogin = () => {
      if (onGoogleLogin) {
          onGoogleLogin();
      }
      // 추후 구글 인증 URL 연결
      console.log('Google login clicked');
      // 임시로 로그인 성공 처리
      login();
      const redirectTo = redirectPath || '/';
      setRedirectPath(null);
      closeLoginModal();
      navigate(redirectTo);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* 서비스 로고 */}
      <img
        src={serviceLogo}
        alt="SPRIDE Logo"
        style={{
          width: 120,
          height: 'auto',
          marginBottom: 16,
        }}
      />

      {/* 설명 텍스트 */}
      <p style={{
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 100,
      }}>
        {t.loginDescription}
      </p>

      {/* 카카오 로그인 버튼 */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // 중앙 정렬 유지
          width: '80%', // 너비 80%
          maxWidth: 1000, // 최대 너비 설정 (반응형 고려)
          minHeight: 52,
          padding: '12px 24px',
          marginBottom: 12,
          backgroundColor: '#fee500',
          color: '#000',
          border: 'none',
          borderRadius: 6,
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontFamily: 'Pretendard', // 폰트 적용
        }}
        onClick={handleKakaoLogin}
      >
        {/* 로고와 텍스트를 감싸는 flex 컨테이너 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 카카오 아이콘 이미지 */}
          <img src={kakaoLogo} alt="Kakao Logo" style={{ width: 16, height: 16, marginRight: 12 }} /> {/* 마진 조정 */}
          {/* 텍스트 */}
          <span style={{ fontSize: 16 }}>{t.kakaoLogin}</span>
        </div>
      </button>

      {/* 구글 로그인 버튼 */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // 중앙 정렬 유지
          width: '80%', // 너비 80%
          maxWidth: 1000, // 최대 너비 설정
          minHeight: 52,
          padding: '12px 24px', // 좌우 패딩 추가
          backgroundColor: '#e0e0e0',
          color: '#000',
          border: 'none',
          borderRadius: 6,
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontFamily: 'Pretendard', // 폰트 적용
        }}
        //onClick={handleGoogleLogin} //구글 로그인 비활성화
      >
         {/* 로고와 텍스트를 감싸는 flex 컨테이너 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 구글 아이콘 이미지 */}
          <img src={googleLogo} alt="Google Logo" style={{ width: 16, height: 16, marginRight: 12 }} /> {/* 마진 조정 */}
          {/* 텍스트 */}
          <span style={{ fontSize: 16 }}>{t.googleLogin}</span>
        </div>
      </button>

      {/* 모달 닫기 버튼 (선택 사항, 모달 배경 클릭으로도 닫히므로) */}
      {/* <button onClick={onClose}>닫기</button> */}
    </div>
  );
};

export default LoginPage; 