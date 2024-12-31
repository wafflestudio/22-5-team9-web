import './index.css';

import { createContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

export type LoginContextType = {
  isLoggedIn: boolean;
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

  const handleIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, handleIsLoggedIn }}>
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
        ></Route>
        <Route
          path="/explore"
          element={isLoggedIn ? <ExplorePage /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </LoginContext.Provider>
  );
};

