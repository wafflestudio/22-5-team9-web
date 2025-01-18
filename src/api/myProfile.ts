import type { UserProfile } from '../types/user';

export const myProfile = async (token: string) => {
  try {
    const response = await fetch(
      'https://waffle-instaclone.kro.kr/api/user/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
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
