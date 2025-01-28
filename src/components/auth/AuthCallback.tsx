import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuthCallback } from '../../hooks/useAuthCallback';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleCallback } = useAuthCallback();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      
      if (code == null) {
        setError('No authorization code received');
        // Redirect to login page after 3 seconds
        setTimeout(() => void navigate('/'), 3000);
        return;
      }

      try {
        await handleCallback(code);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Redirect to login page after 3 seconds if there's an error
        setTimeout(() => void navigate('/'), 3000);
      }
    };

    void processCallback();
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {(error != null) ? (
          <div className="text-red-500">
            <h2 className="text-xl font-semibold mb-2">Login Failed</h2>
            <p>{error}</p>
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">Processing login...</h2>
            <p className="text-gray-600">Please wait while we complete your sign in.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;