import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, openLoginModal, setRedirectPath, isLoadingAuth } = useAuth();
  const currentPath = window.location.pathname; // 현재 경로 가져오기

  console.log('ProtectedRoute - isLoggedIn:', isLoggedIn);
  console.log('ProtectedRoute - isLoadingAuth:', isLoadingAuth);

  // 인증 상태 로딩 중이라면 null 반환 (로딩 완료 후 다시 렌더링)
  if (isLoadingAuth) {
    return null;
  }

  // 로그인되어 있지 않을 때 useEffect를 사용하여 모달 열기
  useEffect(() => {
    if (!isLoggedIn) {
      setRedirectPath(currentPath);
      openLoginModal();
    }
  }, [isLoggedIn, currentPath, setRedirectPath, openLoginModal]);

  // 로그인되어 있지 않으면 null 반환 (모달이 열린 상태)
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 