import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { PostProps } from '../../types/post';

export const WaffleIcon = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 2h20v20H2V2zm2 2v4h4V4H4zm6 0v4h4V4h-4zm6 0v4h4V4h-4zM4 10v4h4v-4H4zm6 0v4h4v-4h-4zm6 0v4h4v-4h-4zM4 16v4h4v-4H4zm6 0v4h4v-4h-4zm6 0v4h4v-4h-4z" />
  </svg>
);

const Post = ({
  post_id,
  username,
  profileImage,
  imageUrl,
  caption,
  likes,
  comments,
  creation_date,
  isLiked,
  onLikeToggle,
}: PostProps) => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const createWaffleParticles = () => {
    const newParticles = Array.from({ length: 12 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * -50,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setParticles([]);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [particles]);

  const handleWaffleClick = () => {
    void onLikeToggle(post_id);
    createWaffleParticles();
  };

  return (
    <div className="bg-white border rounded-md relative overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="waffle-particle absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        >
          🧇
        </div>
      ))}

      <div className="flex items-center p-4">
        <img
          src={`https://waffle-instaclone.kro.kr/${profileImage}`}
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
          <WaffleIcon
            className={`w-6 h-6 cursor-pointer transition-colors ${
              isLiked ? 'fill-amber-500 stroke-amber-500' : 'stroke-current'
            }`}
            onClick={handleWaffleClick}
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
