export const likePost = async (postId: number) => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/like/post_like?content_id=${postId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<{ likes: number[] }>;
};

export const unlikePost = async (postId: number) => {
  const response = await fetch(
    `https://waffle-instaclone.kro.kr/api/like/post_unlike?content_id=${postId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
      },
    },
  );
  return response.json() as Promise<{ likes: number[] }>;
};
