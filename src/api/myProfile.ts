import type { UserProfile } from '../types/user';
import { refreshToken } from './refresh';

export const myProfile = async (token: string) => {
  const fetchWithRetry = async (url: string, options: RequestInit) => {
    let response = await fetch(url, options);

    // Token expired - attempt refresh
    if (response.status === 401) {
      const newToken = await refreshToken();
      response = await fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
      });
    }

    return response;
  };
  try {
    const response = await fetchWithRetry(
      'https://waffle-instaclone.kro.kr/api/user/profile',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.ok) {
      const profileData = (await response.json()) as UserProfile;
      return profileData;
    }
    throw new Error('Profile fetch failed');
  } catch (err) {
    console.error('Profile fetch error:', err);
    return null;
  }
};
