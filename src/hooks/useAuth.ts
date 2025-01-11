import { useState } from 'react';

export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export function useAuth() {
  // 임시 로그인 상태
  // TODO: 로그인 API 관리 로직 구현
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const getAccessToken = () => {
    return localStorage.getItem('access_token');
  }

  const handleLogin = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  }

  return { isLoggedIn, handleLogin, handleLogout, getAccessToken };
}
