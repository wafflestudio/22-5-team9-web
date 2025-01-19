export type User = {
  user_id: number;
  username: string;
  email: string;
  full_name: string;
  profile_image?: string;
} | null;

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginContextType {
  isLoggedIn: boolean;
  user: User;
  handleIsLoggedIn: (value: boolean) => void;
  handleAuthError: () => void;
  handleSocialLogin: (provider: string) => Promise<void>;
  handleLogin: (accessToken: string, refreshToken: string) => void;
  handleLogout: () => void;
  getAccessToken: () => string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone_number: string;
  birthday?: Date;
  gender?: string;
  profile_image?: string;
  introduce?: string;
  website?: string;
}
