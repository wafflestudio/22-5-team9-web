export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export type LoginContextType = {
  isLoggedIn: boolean;
  user: User;
  handleIsLoggedIn: (value: boolean) => void;
  handleAuthError: () => void;
};
