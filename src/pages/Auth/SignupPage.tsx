import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';

interface SignupData {
  nickname: string;
  profileUrl: string;
}

const SignupPage: React.FC = () => {
  const t = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const signupData = location.state as SignupData;

  const [nickname, setNickname] = useState(signupData?.nickname || '');
  const [introduction, setIntroduction] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/kakao/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({
          nickname,
          introText: introduction,
          profileUrl: signupData?.profileUrl,
        }),
      });

      if (response.ok) {
        // 회원가입 성공 시 로그인 상태 업데이트
        auth.login();
        
        // 원래 가려던 페이지로 이동
        const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';
        navigate(returnTo);
      } else {
        console.error('회원가입 실패');
        // 에러 처리
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
    }
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
      <h2>회원가입</h2>

      {/* 프로필 이미지 */}
      {signupData?.profileUrl && (
        <img
          src={signupData.profileUrl}
          alt="프로필"
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            marginBottom: 24,
            objectFit: 'cover',
          }}
        />
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
        {/* 닉네임 입력 */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="nickname" style={{ display: 'block', marginBottom: 8 }}>
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
            }}
            required
          />
        </div>

        {/* 한 줄 소개 입력 */}
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="introduction" style={{ display: 'block', marginBottom: 8 }}>
            한 줄 소개
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              minHeight: 100,
              resize: 'vertical',
            }}
            required
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignupPage;