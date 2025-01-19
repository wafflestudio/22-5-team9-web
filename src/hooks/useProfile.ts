import { useCallback, useEffect, useState } from 'react';

import type { UserProfile } from '../types/user';
import { useAuth } from './useAuth';

export const useProfile = (username: string | undefined) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const fetchProfile = useCallback(() => {
    if (username == null) return () => {};

    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch(
          `https://waffle-instaclone.kro.kr/api/user/${username}`,
          {
            headers: { Authorization: `Bearer ${auth.getAccessToken() ?? ''}` },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data: UserProfile = (await response.json()) as UserProfile;
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [username, auth]);

  useEffect(() => {
    const cleanup = fetchProfile();
    return () => {
      cleanup();
    };
  }, [fetchProfile]);

  return { profile, isLoading, error, refreshProfile: fetchProfile };
};
