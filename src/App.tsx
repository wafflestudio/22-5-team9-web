import './index.css';

import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ExplorePage from './pages/ExplorePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path='/' element={isLoggedIn ? <HomePage /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}></Route>
      <Route path='/explore' element={isLoggedIn ? <ExplorePage /> : <Navigate to="/" />}></Route>
    </Routes>
  );
};
