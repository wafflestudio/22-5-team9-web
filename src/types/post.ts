export interface Post {
  id: number;
  username: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface PostsProps {
  posts: Post[];
  postsPerPage: number;
}
