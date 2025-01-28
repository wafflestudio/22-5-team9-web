export interface Comment {
  comment_id: number;
  user_id: number;
  post_id: number;
  parent_id: number | null;
  comment_text: string;
}
