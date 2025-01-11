import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export function useAuth() {
  // 임시 로그인 상태
  // TODO: 로그인 API 관리 로직 구현
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const setAuthTokens = (access_token: string, refresh_token: string) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  const getAccessToken = () => {
    return localStorage.getItem('access_token');
  }

  const handleLogin = (accessToken: string, refreshToken: string) => {
    setAuthTokens(accessToken, refreshToken);
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    void navigate('/');
  }
  
  const handleAuthError = () => {
    handleLogout();
  }

  return { isLoggedIn, handleLogin, handleLogout, handleAuthError, getAccessToken };
}
