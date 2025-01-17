import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
  userId: number;
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton = ({ userId, onFollowChange }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      if (token === null) {
        void navigate('/');
        return;
      }

      const endpoint = isFollowing ? 'unfollow' : 'follow';
      const response = await fetch(
        `http://3.34.185.81:8000/api/follower/${endpoint}?follow_id=${userId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint}`);
      }

      setIsFollowing(!isFollowing);
      onFollowChange?.(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => {
        void handleFollow();
      }}
      disabled={isLoading}
      className={`px-6 py-2 rounded font-semibold text-sm ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } transition-colors duration-200 disabled:opacity-50`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
