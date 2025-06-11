export interface User {
  id: string;
  nickname: string;
  profileImage: string;
  email?: string;
  description?: string;
  // 기타 사용자 관련 필드
}

export interface LoginStatusResponse {
  isLoggedIn: boolean;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
} 