export interface UserProfile {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  creation_date: string;
  profile_image: string;
  gender: string | null;
  birthday: string | null;
  introduce: string | null;
  website: string | null;
  followers: number;
  following: number;
  post_count: number;
  post_ids: number[];
}
