import type { UserProfile } from '../types/user';

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/user/search?query=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to search users');
  }

  return response.json() as Promise<UserProfile[]>;
};
