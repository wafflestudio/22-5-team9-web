import type { UserProfile } from '../types/user';

type ProfileUpdateData = {
  username?: string;
  introduce?: string;
  profile_image?: string;
};
// ToDO: 이미지 업로드
export const updateProfile = async (
  data: ProfileUpdateData,
): Promise<UserProfile> => {
  const params = new URLSearchParams();

  if (data.username != null) params.append('username', data.username);
  if (data.introduce != null) params.append('introduce', data.introduce);
  if (data.profile_image != null) {
    params.append('profile_image', data.profile_image);
  }

  const url = `https://waffle-instaclone.kro.kr/api/user/profile/edit?${params.toString()}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile`);
  }

  return response.json() as Promise<UserProfile>;
};
