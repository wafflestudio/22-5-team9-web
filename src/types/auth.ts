import type { User } from "../hooks/useAuth";

export type LoginContextType = {
  isLoggedIn: boolean;
  user: User;
  handleIsLoggedIn: (value: boolean, userData: User) => void;
};
