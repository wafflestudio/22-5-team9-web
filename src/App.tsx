import './index.css';

import { createContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import type { LoginContextType } from './types/auth';

export const LoginContext = createContext<LoginContextType | null>(null);

export const App = () => {
  const auth = useAuth();

  return (
    <LoginContext.Provider value={auth}>
      <Routes>
        <Route
          path="/"
          element={
            auth.isLoggedIn ? (
              <MainPage />
            ) : (
              <LoginPage handleIsLoggedIn={auth.handleIsLoggedIn} />
            )
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
          element={auth.isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>
    </LoginContext.Provider>
  );
};
