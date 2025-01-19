import type { UserProfile } from "../types/user";

type ProfileUpdateData = {
  username?: string;
  introduce?: string;
  profile_image?: File;
}

export const updateProfile = async (data: ProfileUpdateData): Promise<UserProfile> => {
  const formData = new FormData();
  
  if (data.username != null) formData.append('username', data.username);
  if (data.introduce != null) formData.append('introduce', data.introduce);
  if (data.profile_image != null) formData.append('profile_image', data.profile_image);

  const response = await fetch('https://waffle-instaclone.kro.kr/api/user/profile/edit', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token') as string}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json() as Promise<UserProfile>;
};