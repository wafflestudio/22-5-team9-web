export type UserProfile = {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  creation_date: string;
  profile_image: string;
  gender: string;
  birthday: string;
  introduce: string;
  website: string;
  follower_count: number;
  following_count: number;
  followers: number[];
  following: number[];
  post_count: number;
  post_ids: number[];
} | null;
