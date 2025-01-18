import { useState } from 'react';

import type { UserProfile } from '../types/user';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);

  const handleIsLoggedIn = (value: boolean, user: UserProfile) => {
    setIsLoggedIn(value);
    localStorage.setItem('isLoggedIn', String(value));

    if (value) {
      setMyProfile(user);
    } else {
      setMyProfile(null);
    }
  };

  return { isLoggedIn, myProfile, handleIsLoggedIn };
}
