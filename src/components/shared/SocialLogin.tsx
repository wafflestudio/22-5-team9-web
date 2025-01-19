import { Mail, Share2 } from 'lucide-react';

const SocialLogin = () => {
  const handleSocialLogin = (provider: string): void => {
    try {
      window.location.href = `https://waffle-instaclone.kro.kr/api/auth/${provider}`;
    } catch (error) {
      console.error(
        `${provider} login failed:`,
        error instanceof Error ? error.message : String(error),
      );
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
        onClick={() => {
          handleSocialLogin('google');
        }}
        className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
      >
        <Mail className="h-5 w-5" />
        <span>Google</span>
      </button>

      <button
        onClick={() => {
          handleSocialLogin('facebook');
        }}
        className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
      >
        <Share2 className="h-5 w-5" />
        <span>Facebook</span>
      </button>
    </div>
  );
};

export default SocialLogin;
