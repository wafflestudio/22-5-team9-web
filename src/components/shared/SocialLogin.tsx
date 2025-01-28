import { Mail } from 'lucide-react';

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    try {
      // Use the full OAuth URL directly since this is what's being used
      window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' +
        'client_id=557745293077-gbn9t05u2o9q9a6uqmfjar2befgerpnc.apps.googleusercontent.com&' +
        'redirect_uri=https://waffle-instaclone.kro.kr/auth/callback&' +
        'response_type=code&' +
        'scope=email%20profile';
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <button 
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
      >
        <Mail className="h-5 w-5" />
        <span>Google</span>
      </button>
    </div>
  );
};

export default SocialLogin;