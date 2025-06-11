import { LoginResponse, LoginStatusResponse } from '../types/auth';

export const checkLoginStatus = async (): Promise<LoginStatusResponse> => {
  console.log('API: Checking login status...');
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return { isLoggedIn: data.isLoggedIn };
    } else {
      console.error('Error checking login status:', response.statusText);
      return { isLoggedIn: false, message: response.statusText };
    }
  } catch (error) {
    console.error('Network error checking login status:', error);
    return { isLoggedIn: false, message: 'Network error' };
  }
};

export const login = async (code: string): Promise<LoginResponse> => {
  console.log('API: Attempting login...', code);
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/kakao/callback?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Login successful');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('Login failed:', response.status, errorText);
      return { success: false, message: `Login failed: ${response.status} ${errorText}` };
    }
  } catch (error) {
    console.error('Network error during login:', error);
    return { success: false, message: 'Network error during login' };
  }
};

export const logout = async (): Promise<void> => {
  console.log('API: Attempting logout...');
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Logout successful');
    } else {
      console.error('Logout failed:', response.statusText);
    }
  } catch (error) {
    console.error('Network error during logout:', error);
  }
}; 