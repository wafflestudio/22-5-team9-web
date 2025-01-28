import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '../types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser != null ? (JSON.parse(savedUser) as User) : null;
  });

  const handleIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));
    if (!value) {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const handleLogin = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    void navigate('/');
  };

  const handleAuthError = () => {
    handleLogout();
  };

  const getAccessToken = () => {
    return localStorage.getItem('access_token');
  };

  const handleSocialLogin = async (provider: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        window.location.href = `https://waffle-instaclone.kro.kr/api/auth/${provider}`;
        resolve();
      } catch (error) {
        console.error(`${provider} login failed:`, error);
        reject(
          new Error(
            `${provider} login failed: ${
              error instanceof Error ? error.message : String(error)
            }`,
          ),
        );
      }
    });
  };

  return {
    isLoggedIn,
    user,
    handleIsLoggedIn,
    handleLogin,
    handleLogout,
    handleAuthError,
    handleSocialLogin,
    getAccessToken,
  };
}
