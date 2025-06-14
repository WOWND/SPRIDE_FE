import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextProps {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const openLoginModal = () => {
    console.log('Opening login modal');
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    console.log('Closing login modal');
    setIsLoginModalOpen(false);
  };

  const login = () => {
    console.log('Login function called, setting isAuthenticated to true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logout function called, setting isAuthenticated to false');
    setIsAuthenticated(false);
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/kakao/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          console.log('Initial auth check: User is logged in');
          setIsAuthenticated(true);
        } else {
          console.log('Initial auth check: User is not logged in');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkLoginStatus();
  }, []);

  // isAuthenticated 상태 변경 시 로그 출력
  useEffect(() => {
    console.log('isAuthenticated state changed:', isAuthenticated);
  }, [isAuthenticated]);

  // isLoginModalOpen 상태 변경 시 로그 출력
  useEffect(() => {
    console.log('isLoginModalOpen state changed:', isLoginModalOpen);
  }, [isLoginModalOpen]);

  return (
    <AuthContext.Provider value={{
      isLoginModalOpen, openLoginModal, closeLoginModal,
      isAuthenticated, login, logout,
      redirectPath, setRedirectPath,
      isLoadingAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 