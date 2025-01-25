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

export async function fetchUserProfile(username: string): Promise<UserProfile> {
  try {
    const response = await fetch(
      `https://waffle-instaclone.kro.kr/api/user/${username}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return (await response.json()) as UserProfile;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

type ProfileUpdateData = {
  username?: string;
  introduce?: string;
  profile_image?: File;
};

export const updateProfile = async (
  data: ProfileUpdateData,
): Promise<UserProfile> => {
  const params = new URLSearchParams();

  if (data.username != null) params.append('username', data.username);
  if (data.introduce != null) params.append('introduce', data.introduce);

  const url = `https://waffle-instaclone.kro.kr/api/user/profile/edit?${params.toString()}`;

  const options: RequestInit = {
    method: 'PATCH',
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      Accept: 'application/json',
    }),
  };

  if (data.profile_image != null) {
    const formData = new FormData();
    formData.append('profile_image', data.profile_image);
    options.body = formData;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to update profile`);
  }

  return response.json() as Promise<UserProfile>;
};
