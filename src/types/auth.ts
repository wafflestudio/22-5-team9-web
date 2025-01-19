import type { UserProfile } from './user';

export type LoginContextType = {
  isLoggedIn: boolean;
  myProfile: UserProfile | null;
  handleIsLoggedIn: (value: boolean, userData: UserProfile) => void;
  setMyProfile: (profile: UserProfile) => void;
};
