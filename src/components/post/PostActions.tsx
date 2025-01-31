import { MessageCircle, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

import { WaffleIcon } from '../feed/Post';

interface PostActionsProps {
  likes: number[];
  currentUserId: number;
  onLikeToggle: () => void;
  onAddComment: (comment: string) => void;
}

const PostActions = ({
  likes,
  currentUserId,
  onLikeToggle,
  onAddComment,
}: PostActionsProps) => {
  const [comment, setComment] = useState('');
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
    onLikeToggle();
    createWaffleParticles();
  };

  return (
    <div className="border-t p-4 relative">
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
      <div className="flex space-x-4 mb-4">
        <WaffleIcon
          className={`w-6 h-6 cursor-pointer transition-colors ${
            likes.includes(currentUserId)
              ? 'fill-amber-500 stroke-amber-500'
              : 'stroke-current'
          }`}
          onClick={handleWaffleClick}
        />
        <MessageCircle className="w-6 h-6" />
        <Send className="w-6 h-6" />
      </div>
      <div className="font-semibold mb-2">{likes.length} likes</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (comment.trim().length > 0) {
            onAddComment(comment);
            setComment('');
          }
        }}
      >
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          className="w-full border-none focus:ring-0"
        />
      </form>
    </div>
  );
};

export default PostActions;
