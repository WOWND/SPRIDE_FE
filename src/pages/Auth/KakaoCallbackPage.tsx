import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface KakaoLoginResponse {
  status: string;
  nickname: string;
  profileUrl: string;
}

const KakaoCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      // URL에서 인증 코드 추출
      const code = new URLSearchParams(location.search).get('code');
      const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
      
      if (!code) {
        console.error('인증 코드가 없습니다.');
        navigate('/login');
        return;
      }

      try {
        // 백엔드로 인증 코드 전달
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/kakao/login?code=${code}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
          }
        );

        const data: KakaoLoginResponse = await response.json();

        if (data.status === 'LOGIN_SUCCESS') {
          // 로그인 성공 시 모달 닫기
          auth.closeLoginModal();
          // 로그인 상태 업데이트
          auth.login();
          // redirectPath가 있으면 해당 경로로, 없으면 메인 페이지로 이동
          const redirectTo = auth.redirectPath || '/';
          auth.setRedirectPath(null);
          navigate(redirectTo);
        } else if (data.status === 'SIGNUP_REQUIRED') {
          // 회원가입 필요 시 회원가입 페이지로 이동
          navigate(`/signup?returnTo=${encodeURIComponent(returnTo)}`, {
            state: {
              nickname: data.nickname,
              profileUrl: data.profileUrl,
            },
          });
        } else {
          // 기타 오류 시 메인 페이지로 이동
          console.error('로그인 처리 중 오류 발생:', data);
          navigate('/');
        }
      } catch (error) {
        // 에러 발생 시 메인 페이지로 이동
        console.error('카카오 로그인 처리 중 오류 발생:', error);
        navigate('/');
      } finally {
        isProcessing.current = false;
      }
    };

    handleKakaoCallback();
  }, [navigate, location.search, auth]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <p>카카오 로그인 처리 중...</p>
    </div>
  );
};

export default KakaoCallbackPage; 