export interface ProfileInfo {
  username: string;
  posts: number;
  followers: number;
  following: number;
  fullName: string;
  bio: string;
}

export interface HighlightItem {
  id: string;
  name: string;
  imageUrl?: string;
}
