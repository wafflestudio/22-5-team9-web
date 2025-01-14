import { useState } from 'react';

export type User = {
  username: string;
} | null;

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser != null ? (JSON.parse(savedUser) as User) : null;
  });

  const handleIsLoggedIn = (value: boolean, userData: User) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));

    if (value && userData != null) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else if (!value) {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return { isLoggedIn, user, handleIsLoggedIn };
}
