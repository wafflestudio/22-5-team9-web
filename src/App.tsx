import './index.css';

import { createContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import StoryEditor from './components/story/Editor/StoryEditor';
import { useAuth } from './hooks/useAuth';
import ExplorePage from './pages/ExplorePage';
import FriendMapPage from './pages/FriendMapPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MessagePage from './pages/MessagePage';
import PostDetailPage from './pages/PostDetailPage';
import ProfileEditPage from './pages/ProfileEditPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
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
            path="/stories/:username/:storyId" 
            element={auth.isLoggedIn ? <StoryPage /> : <LoginPage handleIsLoggedIn={auth.handleIsLoggedIn} />} 
          />
          <Route 
            path="/stories/new" 
            element={auth.isLoggedIn ? <StoryEditor /> : <LoginPage handleIsLoggedIn={auth.handleIsLoggedIn} />} 
          />
          <Route
            path="/explore"
            element={auth.isLoggedIn ? <ExplorePage /> : <Navigate to="/" />}
          />
          <Route
            path="/messages"
            element={auth.isLoggedIn ? <MessagePage /> : <Navigate to="/" />}
          />
          <Route
            path="/:username"
            element={auth.isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/accounts/edit"
            element={
              auth.isLoggedIn ? <ProfileEditPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/post/:postId"
            element={auth.isLoggedIn ? <PostDetailPage /> : <Navigate to="/" />}
          />
          <Route
            path="/map"
            element={auth.isLoggedIn ? <FriendMapPage /> : <Navigate to="/" />}
          />
        </Routes>
      </SearchContext.Provider>
    </LoginContext.Provider>
  );
};
