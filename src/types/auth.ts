export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export type SocialLoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    profile_image?: string;
  };
};

export type LoginContextType = {
  isLoggedIn: boolean;
  user: User;
  handleIsLoggedIn: (value: boolean) => void;
  handleAuthError: () => void;
  handleSocialLogin: (provider: string) => Promise<void>;
};