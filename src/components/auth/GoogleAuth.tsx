import { type CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React from 'react';
interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    username: string;
    profile_image?: string;
  };
}

interface GoogleAuthProps {
  onSuccess: (accessToken: string, refreshToken: string) => void;
  onError: (error: string) => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, onError }) => {
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (
      typeof (credentialResponse as { credential?: string }).credential !==
      'string'
    ) {
      onError('Google credentials are invalid or missing');
      return;
    }
    try {
      const response = await fetch(
        'https://waffle-instaclone.kro.kr/auth/google',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: (credentialResponse as { credential: string })
              .credential,
          }),
        },
      );

      if (!response.ok) throw new Error('Google authentication failed');

      const data = (await response.json()) as GoogleAuthResponse;
      onSuccess(data.access_token, data.refresh_token);
    } catch (error) {
      onError(
        `Google 로그인 중 오류가 발생했습니다.: ${(error as Error).message}`,
      );
    }
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={(response) => {
          void handleGoogleSuccess(response);
        }}
        onError={() => {
          onError('Google 로그인 중 오류가 발생했습니다.');
        }}
        useOneTap
        theme="outline"
        size="large"
      />
    </div>
  );
};

export default GoogleAuth;
