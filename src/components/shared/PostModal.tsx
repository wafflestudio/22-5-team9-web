import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { APIPost, FeedPost } from '../../types/post';

interface PostModalProps {
  post: APIPost | FeedPost;
  onClose: () => void;
}

interface UserResponse {
  username: string;
  // Add other fields as needed
}

const PostModal = ({ post, onClose }: PostModalProps) => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // If it's a feed post, we already have the username
    if ('username' in post) {
      setUsername(post.username);
      return;
    }

    // If it's an API post, we need to fetch the username
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token === null) return;

        const response = await fetch(
          `http://3.34.185.81:8000/api/user/profile/${post.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error('Failed to fetch user');

        const data = (await response.json()) as UserResponse;
        if (typeof data.username === 'string') {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    void fetchUsername();
  }, [post]);

  const getImageUrl = () => {
    if ('imageUrl' in post) return post.imageUrl;
    return post.file_url[0] != null
      ? `http://3.34.185.81:8000/${post.file_url[0].replace(/^\/+/, '')}`
      : '/placeholder.svg';
  };

  const getCaption = () => {
    if ('caption' in post) return post.caption;
    return post.post_text;
  };

  const getTimestamp = () => {
    if ('timestamp' in post) return post.timestamp;
    return post.creation_date;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg max-w-4xl w-full flex overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Image Side */}
          <div className="w-[65%] bg-black flex items-center">
            <img
              src={getImageUrl()}
              alt={getCaption() ?? 'Post image'}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Info Side */}
          <div className="w-[35%] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center">
              <img
                src="/placeholder.svg"
                alt={username}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="font-semibold flex-grow">{username}</span>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Caption */}
            <div className="p-4 flex-grow">
              {getCaption() !== null && <p className="mb-2">{getCaption()}</p>}
              {'location' in post && post.location !== null && (
                <p className="text-sm text-gray-500">{post.location}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">{getTimestamp()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
