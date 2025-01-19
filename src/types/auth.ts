import type { UserProfile } from './user';

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
export type LoginContextType = {
  isLoggedIn: boolean;
  myProfile: UserProfile | null;
  handleIsLoggedIn: (value: boolean, userData: UserProfile) => void;
  setMyProfile: (profile: UserProfile) => void;
};

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
