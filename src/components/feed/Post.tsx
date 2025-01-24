import { Heart, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { PostProps } from '../../types/post';

const Post = ({
  post_id,
  username,
  imageUrl,
  caption,
  likes,
  comments,
  creation_date,
  isLiked,
  onLikeToggle,
}: PostProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-md">
      <div className="flex items-center p-4">
        <img
          src="/placeholder.svg"
          alt={username}
          className="w-8 h-8 rounded-full"
        />
        <span className="ml-3 font-semibold">{username}</span>
      </div>
      <img
        src={
          imageUrl.startsWith('http')
            ? imageUrl
            : `https://waffle-instaclone.kro.kr/${imageUrl}`
        }
        alt="Post"
        className="w-full"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <div className="p-4">
        <div className="flex space-x-4 mb-4">
          <Heart
            className={`w-6 h-6 cursor-pointer ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
            onClick={() => {
              void onLikeToggle(post_id);
            }}
          />
          <MessageCircle
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              void navigate(`/post/${post_id}`);
            }}
          />
          <Send className="w-6 h-6" />
        </div>
        <p className="font-semibold mb-2">{likes.toLocaleString()} likes</p>
        <p>
          <span className="font-semibold">{username}</span> {caption}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          View all {comments} comments
        </p>
        <p className="text-gray-400 text-xs mt-1">{creation_date}</p>
      </div>
    </div>
  );
};

export default Post;
