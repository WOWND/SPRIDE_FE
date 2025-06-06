import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL 쿼리 파라미터에서 백엔드가 전달한 응답 정보를 읽습니다.
    const queryParams = new URLSearchParams(location.search);
    const httpStatus = queryParams.get('httpStatus'); // 백엔드가 넘겨줄 HTTP 상태 코드
    const appStatus = queryParams.get('appStatus');   // 백엔드가 넘겨줄 앱 상태 코드 (예: SIGNUP_REQUIRED)
    const nickname = queryParams.get('nickname');
    const profileUrl = queryParams.get('profileUrl');

    console.log('Auth Callback Params:', { httpStatus, appStatus, nickname, profileUrl });

    if (httpStatus === '401' && appStatus === 'SIGNUP_REQUIRED') {
      // 회원가입이 필요한 경우
      console.log('회원가입 필요');
      // 닉네임과 프로필 URL을 state에 담아 회원가입 페이지로 이동
      navigate('/signup', { state: { nickname: nickname || '', profileUrl: profileUrl || undefined } });
    } else if (httpStatus === '200') {
      // 로그인 성공 (기존 회원)
      console.log('로그인 성공');
      // TODO: 백엔드에서 받은 토큰 등 로그인 상태 저장 (예: Context, LocalStorage 등)
      navigate('/'); // 홈 페이지로 이동
    } else {
      // 기타 오류 처리 또는 상태 코드 누락
      console.error('인증 실패 또는 오류. 수신된 파라미터:', { httpStatus, appStatus });
      // TODO: 에러 메시지 표시 또는 에러 페이지로 리다이렉트
      navigate('/login'); // 예시: 로그인 페이지로 이동
    }

  }, [navigate, location.search]); // navigate와 location.search를 의존성 배열에 추가

  // 사용자에게 로딩 중임을 알리는 UI를 표시할 수 있습니다.
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <p>로그인 처리 중...</p> {/* 다국어 텍스트 필요 */}
    </div>
  );
};

export default AuthCallbackPage; 