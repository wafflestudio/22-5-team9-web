export interface APIPost {
  post_id: number;
  user_id: number;
  post_text: string | null;
  location: string | null;
  creation_date: string;
  file_url: string[];
}

export interface FeedPost {
  id: number;
  username: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface PostsProps {
  posts: FeedPost[];
  postsPerPage: number;
}

export type Post = FeedPost;
