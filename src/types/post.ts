export interface Post {
  post_id: number;
  user_id: number;
  location: string;
  post_text: string;
  creation_date: string;
  file_url: string[];
  comments: number[];
  likes: number[];
}

export type PostProps = {
  post_id: number;
  username: string;
  profileImage: string;
  imageUrl: string;
  location: string;
  caption: string;
  likes: number;
  comments: number;
  creation_date: string;
  isLiked: boolean;
  onLikeToggle: (postId: number) => Promise<void>;
};

export type PostsProps = {
  posts: Post[];
  postsPerPage: number;
  currentUserId?: number;
  onLikeToggle: (postId: number) => Promise<void>;
};

export interface Comment {
  comment_id: number;
  user_id: number;
  post_id: number;
  parent_id: number | null;
  comment_text: string;
}
