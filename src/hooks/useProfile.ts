import { useEffect, useState } from 'react';

import type { ProfileInfo } from '../types/profile';

export function useProfile(username: string) {
  const [profileData, setProfileData] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Future API integration
    setProfileData({
      username,
      posts: 4,
      followers: 100,
      following: 100,
      fullName: 'User1',
      bio: 'User1 Bio',
    });
    setLoading(false);
  }, [username]);

  return { profileData, loading, error };
}
