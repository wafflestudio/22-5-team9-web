export const followUser = async (token: string, followId: number) => {
  try {
    const response = await fetch(
      `http://3.34.185.81:8000/api/follower/follow?follow_id=${followId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Follow request failed');
    }

    return true;
  } catch (err) {
    console.error('Follow error:', err);
    return false;
  }
};

export const unfollowUser = async (token: string, followId: number) => {
  try {
    const response = await fetch(
      `http://3.34.185.81:8000/api/follower/unfollow?follow_id=${followId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Unfollow request failed');
    }

    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};
