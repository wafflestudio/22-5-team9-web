import { createContext, useEffect,useState } from 'react';
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

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      setIsLoading(true);
      const token = auth.getAccessToken();
      if (token != null) {
        try {
          const response = await fetch('http://3.34.185.81:8000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json() as UserProfile;
            setCurrentUserId(userData.user_id);
          } else {
            console.error('Failed to fetch current user ID');
          }
        } catch (error) {
          console.error('Error fetching current user ID:', error);
        }
      }
      setIsLoading(false);
    };
  
    void fetchCurrentUserId();
  }, [auth]);
  
  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator
  }

  return (
    <LoginContext.Provider value={auth}>
      <Routes>
        <Route
          path="/"
          element={
            auth.isLoggedIn ? <MainPage /> : <LoginPage />
          }
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
          element={auth.isLoggedIn ? <ProfilePage currentUserId={currentUserId} /> : <Navigate to="/" />}
        />
      </Routes>
    </LoginContext.Provider>
  );
};

export default App;