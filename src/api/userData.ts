import type { UserProfile } from "../types/user";

export async function fetchUserData(username: string): Promise<UserProfile> {
  try {
    const response = await fetch(`https://waffle-instaclone.kro.kr/api/user/${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json() as UserProfile;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}