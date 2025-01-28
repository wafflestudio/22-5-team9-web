import { useNavigate } from 'react-router-dom';

import { useAuth } from './useAuth';

interface GoogleAuthResponse {
  user_info: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
  user_id: number;
  username: string;
  user_password: string;
  is_created: boolean;
}

export function useAuthCallback() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleCallback = async (code: string): Promise<void> => {
    try {
      // Exchange the code for user info
      const callbackResponse = await fetch(
        `https://waffle-instaclone.kro.kr/auth/callback?code=${code}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      if (!callbackResponse.ok) {
        const errorText = await callbackResponse.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to exchange code for tokens');
      }
      
      const authData = await callbackResponse.json() as GoogleAuthResponse;
      console.log('Auth data:', authData);

      if (!authData.is_created) {
        // If user doesn't exist, redirect to registration with Google data
        console.log('New user - redirecting to registration');
        void navigate('/register', {
          state: {
            googleData: {
              email: authData.user_info.email,
              fullName: authData.user_info.name,
              picture: authData.user_info.picture,
              sub: authData.user_info.sub
            },
            isGoogleSignup: true
          }
        });
        return;
      }

      // If user exists, proceed with sign in
      const signinResponse = await fetch('https://waffle-instaclone.kro.kr/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: authData.username,
          password: authData.user_info.sub
        }),
      });

      if (!signinResponse.ok) {
        const errorText = await signinResponse.text();
        console.error('Signin error response:', errorText);
        throw new Error('Failed to sign in with social credentials');
      }

      const tokenData = await signinResponse.json() as {
        access_token: string;
        refresh_token: string;
      };

      // Store tokens and update auth state
      auth.handleLogin(tokenData.access_token, tokenData.refresh_token);

      // Navigate to home page after successful login
      void navigate('/');
    } catch (error) {
      console.error('Auth callback error:', error);
      void navigate('/', { 
        state: { 
          error: 'Failed to complete social login',
          details: error instanceof Error ? error.message : 'Unknown error occurred'
        } 
      });
    }
  };

  return { handleCallback };
}