import { useEffect, useState } from 'react';

import type { UserProfile } from '../types/user';

const userProfileCache = new Map<number, UserProfile>();

export function useUserProfiles(userIds: number[]) {
  const [profiles, setProfiles] = useState<Map<number, UserProfile>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uncachedIds = userIds.filter(id => !userProfileCache.has(id));
    if (uncachedIds.length === 0) {
      setProfiles(new Map(userIds.map(id => [id, userProfileCache.get(id) ?? {} as UserProfile])));
      return;
    }

    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        if (token == null) throw new Error('No access token');

        const promises = uncachedIds.map(async (id) => {
          const response = await fetch(`/api/user/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!response.ok) throw new Error(`Failed to fetch profile for user ${id}`);
          return response.json() as Promise<UserProfile>;
        });

        const newProfiles = await Promise.all(promises);
        newProfiles.forEach((profile, index) => {
          const id = uncachedIds[index];
          if (id !== undefined) {
            userProfileCache.set(id, profile);
          }
        });

        setProfiles(new Map(userIds.map(id => [id, userProfileCache.get(id) ?? {} as UserProfile])));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    void fetchProfiles();
  }, [userIds]);

  return { profiles, loading, error };
}