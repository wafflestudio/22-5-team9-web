import { useEffect, useState } from 'react';

import { fetchUserProfile } from '../api/profile';
import type { UserProfile } from '../types/user';

export const useUserInfo = (username: string) => {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile(username);
        setUserInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    void loadUserInfo();
  }, [username]);

  return { userInfo, loading, error };
};
