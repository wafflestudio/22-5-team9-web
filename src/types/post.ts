export interface Post {
  post_id: number;
  user_id: number;
  location: string;
  post_text: string;
  creation_date: string;
  file_url: string[];
}

export interface PostsProps {
  posts: Post[];
  postsPerPage: number;
}
