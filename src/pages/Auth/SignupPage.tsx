import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useLocation, useNavigate } from 'react-router-dom';

interface SignupPageProps {
  // 추후 회원가입 처리 함수 등을 props로 받을 수 있음
}

interface SignupData {
  nickname: string;
  profileUrl?: string; // 백엔드에서 받은 프로필 URL
}

const SignupPage: React.FC<SignupPageProps> = () => {
  const t = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  // Auth 콜백 페이지에서 전달받은 데이터 (예: state 이용)
  const signupData = location.state as SignupData | undefined;

  const [nickname, setNickname] = useState(signupData?.nickname || '');
  const [introduction, setIntroduction] = useState('');

  useEffect(() => {
    // 만약 state에 데이터가 없다면 (예: 직접 /signup으로 접근 시) 홈으로 리다이렉트
    if (!signupData) {
       // navigate('/'); // 또는 적절한 에러 페이지로 이동
       // 일단 개발 편의상 주석 처리. 실제 배포시에는 처리 필요.
    }
  }, [signupData, navigate]);

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleIntroductionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduction(event.target.value);
  };

  const handleSubmit = () => {
    // 여기서 회원가입 API 호출 로직을 구현합니다.
    console.log('Signup data:', { nickname, introduction });
    // API 호출 후 성공 시 로그인 완료 처리 및 페이지 이동
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px',
      width: '100%%',
      boxSizing: 'border-box',
    }}>
      <h2>{t.signupTitle}</h2> {/* 다국어 텍스트 필요 */}

      {/* 닉네임 입력 필드 */}
      <label htmlFor='nickname'>{t.signupNicknameLabel}</label> {/* 다국어 텍스트 필요 */}
      <input
        id='nickname'
        type='text'
        value={nickname}
        onChange={handleNicknameChange}
        placeholder={t.signupNicknamePlaceholder} // 다국어 텍스트 필요
        style={{ marginBottom: 16, padding: '8px', width: '80%%', boxSizing: 'border-box' }}
      />

      {/* 한 줄 소개 입력 필드 */}
      <label htmlFor='introduction'>{t.signupIntroductionLabel}</label> {/* 다국어 텍스트 필요 */}
      <textarea
        id='introduction'
        value={introduction}
        onChange={handleIntroductionChange}
        placeholder={t.signupIntroductionPlaceholder} // 다국어 텍스트 필요
        style={{ marginBottom: 24, padding: '8px', width: '80%%', minHeight: 80, boxSizing: 'border-box' }}
      />

      {/* 회원가입 완료 버튼 */}
      <button
        onClick={handleSubmit}
        style={{
          width: '80%%',
          padding: '12px 24px',
          backgroundColor: '#007bff', // 적절한 색상으로 변경
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 18,
          cursor: 'pointer',
        }}
      >
        {t.signupButtonText} {/* 다국어 텍스트 필요 */}
      </button>
    </div>
  );
};

export default SignupPage; 