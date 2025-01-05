import './index.css';

import { createContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export type LoginContextType = {
  isLoggedIn: boolean;
  user: User;
  handleIsLoggedIn: (value: boolean) => void;
};

export const LoginContext = createContext<LoginContextType | null>(null);

export const App = () => {
  // 임시 로그인 상태
  // TODO: 로그인 API 관리 로직 구현
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return (savedUser != null) ? JSON.parse(savedUser) as User : null;
  });

  const handleIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));
    if (!value) {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, user, handleIsLoggedIn }}>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <MainPage />
            ) : (
              <LoginPage handleIsLoggedIn={handleIsLoggedIn} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <RegisterPage handleIsLoggedIn={handleIsLoggedIn} />
            )
          }
        />
        <Route
          path="/explore"
          element={isLoggedIn ? <ExplorePage /> : <Navigate to="/" />}
        />
        <Route
          path="/:username"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>
    </LoginContext.Provider>
  );
};
