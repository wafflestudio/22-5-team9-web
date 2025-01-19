import { createContext, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import type { LoginContextType } from './types/auth';
import type { UserProfile } from './types/user';

export const LoginContext = createContext<LoginContextType | null>(null);

export const App = () => {
  const auth = useAuth();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken == null) {
        auth.handleLogout();
        return;
      }

      const response = await fetch(
        'https://waffle-instaclone.kro.kr/api/user/refresh',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedRefreshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          auth.handleLogout();
          return;
        }
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data = await response.json() as {
        access_token: string;
        refresh_token: string;
      };

      auth.handleLogin(data.access_token, data.refresh_token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      auth.handleLogout();
    }
  }, [auth]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const fetchCurrentUserId = async () => {
      setIsLoading(true);
      const token = auth.getAccessToken();
      if (token == null) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://waffle-instaclone.kro.kr/api/user/profile',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const userData = await response.json() as UserProfile;
          setCurrentUserId(userData.user_id);
        } else if (response.status === 401) {
          // Token expired, try to refresh
          await refreshToken();
        } else {
          console.error('Failed to fetch user profile');
          auth.handleLogout();
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        auth.handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      void refreshToken();
    }, 8 * 60 * 1000); // Refresh every 8 minutes

    // Initial fetch and refresh
    void refreshToken();
    void fetchCurrentUserId();

    return () => {
      clearInterval(refreshInterval);
    };
  }, [auth, refreshToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LoginContext.Provider value={auth}>
      <Routes>
        <Route
          path="/"
          element={auth.isLoggedIn ? <MainPage /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            auth.isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <RegisterPage handleIsLoggedIn={auth.handleIsLoggedIn} />
            )
          }
        />
        <Route
          path="/explore"
          element={auth.isLoggedIn ? <ExplorePage /> : <Navigate to="/" />}
        />
        <Route
          path="/:username"
          element={
            auth.isLoggedIn ? (
              <ProfilePage currentUserId={currentUserId} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </LoginContext.Provider>
  );
};