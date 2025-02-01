import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import type { LoginContextType } from './types/auth';

export const LoginContext = createContext<LoginContextType | null>(null);

export const App = () => {
  const auth = useAuth();

  return (
    <GoogleOAuthProvider clientId={'557745293077-gbn9t05u2o9q9a6uqmfjar2befgerpnc.apps.googleusercontent.com'}>
      <LoginContext.Provider value={auth}>
        <Routes>
          <Route 
            path="/" 
            element={auth.isLoggedIn ? <Navigate to="/messages" /> : <LoginPage handleIsLoggedIn={auth.handleIsLoggedIn} />} 
          />
          <Route 
            path="/messages" 
            element={auth.isLoggedIn ? <MessagePage /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LoginContext.Provider>
    </GoogleOAuthProvider>
  );
};