import './index.css';

import { createContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import StoryPage from './pages/StoryPage';
import type { LoginContextType } from './types/auth';
import type { SearchContextType } from './types/search';

export const LoginContext = createContext<LoginContextType | null>(null);
export const SearchContext = createContext<SearchContextType | null>(null);

export const App = () => {
  const auth = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <LoginContext.Provider value={auth}>
      <SearchContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
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
            path="/stories/:username/:storyId" 
            element={auth.isLoggedIn ? <StoryPage /> : <LoginPage handleIsLoggedIn={auth.handleIsLoggedIn} />} 
          />
        </Routes>
      </SearchContext.Provider>
    </LoginContext.Provider>
  );
};
