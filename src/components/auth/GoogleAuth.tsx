import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Google OAuth configuration
const GOOGLE_CLIENT_ID =
  '557745293077-gbn9t05u2o9q9a6uqmfjar2befgerpnc.apps.googleusercontent.com';
const REDIRECT_URI = 'https://waffle-instaclone.kro.kr/auth/callback';

interface GoogleAuthProps {
  onSuccess: (accessToken: string, refreshToken: string) => void;
  onError: (error: string) => void;
}

interface TokenData {
  access_token: string;
  refresh_token: string;
}

const GoogleAuth = ({ onSuccess, onError }: GoogleAuthProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    try {
      setLoading(true);
      const authUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        'response_type=code&' +
        'scope=email%20profile';

      window.location.href = authUrl;
    } catch (error) {
      setLoading(false);
      onError('Failed to initiate Google login');
      console.error('Google login error:', error);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code != null) {
      const handleCallback = async () => {
        try {
          setLoading(true);
          const callbackResponse = await fetch(
            `https://waffle-instaclone.kro.kr/auth/callback?code=${code}`,
          );

          if (!callbackResponse.ok) {
            throw new Error('Failed to exchange code for tokens');
          }

          interface GoogleAuthData {
            is_created: boolean;
            username: string;
            user_info: {
              email: string;
              name: string;
              picture: string;
              sub: string;
            };
          }
          const authData = (await callbackResponse.json()) as GoogleAuthData;

          // If user doesn't exist, redirect to registration
          if (!authData.is_created) {
            void navigate('/register', {
              state: {
                googleData: {
                  email: authData.user_info.email,
                  fullName: authData.user_info.name,
                  picture: authData.user_info.picture,
                  sub: authData.user_info.sub,
                },
                isGoogleSignup: true,
              },
            });
            return;
          }

          // If user exists, proceed with sign in
          const signinResponse = await fetch(
            'https://waffle-instaclone.kro.kr/api/user/signin',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: authData.username,
                password: authData.user_info.sub,
              }),
            },
          );

          if (!signinResponse.ok) {
            throw new Error('Failed to sign in with Google credentials');
          }
          const tokenData = (await signinResponse.json()) as TokenData;
          onSuccess(tokenData.access_token, tokenData.refresh_token);
          void navigate('/');
        } catch (error) {
          onError(
            error instanceof Error ? error.message : 'Authentication failed',
          );
          console.error('Auth callback error:', error);
        } finally {
          setLoading(false);
        }
      };

      void handleCallback();
    }
  }, [navigate, onSuccess, onError]);

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleAuth;
