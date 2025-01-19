import { useState } from 'react';
import type { UserProfile } from '../types/user';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [myProfile, setMyProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved != null ? (JSON.parse(saved) as UserProfile) : null;
  });

  const handleIsLoggedIn = (value: boolean, user: UserProfile) => {
    setIsLoggedIn(value);
    setMyProfile(user);
    localStorage.setItem('isLoggedIn', String(value));
    localStorage.setItem('userProfile', JSON.stringify(user));
  };

  return { isLoggedIn, myProfile, handleIsLoggedIn, setMyProfile };
}
