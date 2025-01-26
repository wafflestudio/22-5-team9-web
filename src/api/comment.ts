import type { Comment } from '../types/post';

export const fetchComments = async (postId: string) => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/comment/list/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<Comment[]>;
};

interface CommentRequest {
  comment_text: string;
  post_id: number;
  parent_id: number;
}

interface CommentResponse {
  comment_id: number;
  user_id: number;
  post_id: number;
  parent_id: number;
  comment_text: string;
}

export const createComment = async (
  data: CommentRequest,
): Promise<CommentResponse> => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/comment/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return (await response.json()) as CommentResponse;
};
