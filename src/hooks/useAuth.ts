import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//import { authApi } from '../components/api/auth';
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

  const handleLogin = (accessToken: string, refreshToken: string): void => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    void navigate('/', { replace: true });
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
  /* const refreshAccessToken = async (): Promise<string | undefined> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken === null) {
      handleLogout();
      return;
    }
  
    try {
      const response = await fetch('https://waffle-instaclone.kro.kr/api/user/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Refresh failed');
      }
  
      const data = (await response.json()) as TokenResponse;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      return data.access_token;
    } catch (error) {
      handleLogout();
      return undefined;
    }
  };
  */

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
