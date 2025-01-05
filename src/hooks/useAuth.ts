import { useState } from 'react';

export type User = {
  username: string;
  email: string;
  password: string;
} | null;

export function useAuth() {
  // 임시 로그인 상태
  // TODO: 로그인 API 관리 로직 구현
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser != null ? (JSON.parse(savedUser) as User) : null;
  });

  const handleIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));
    if (!value) {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return { isLoggedIn, user, handleIsLoggedIn };
}
