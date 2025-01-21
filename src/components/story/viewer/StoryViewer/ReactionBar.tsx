import { Heart, Send } from 'lucide-react';
import { useState } from 'react';

interface ReactionBarProps {
  storyId: number;
  userId: number;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  storyId,
  userId,
}) => {
  const [message, setMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleReact = async () => {
    try {
      const endpoint = `https://waffle-instaclone.kro.kr/api/like/story_${isLiked ? 'unlike' : 'like'}`;
      const response = await fetch(`${endpoint}?content_id=${storyId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to react to story');
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error reacting to story:', error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim().length === 0) return;

    try {
      setIsSending(true);
      const response = await fetch(
        'https://waffle-instaclone.kro.kr/api/comment/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment_text: message,
            post_id: storyId,
            user_id: userId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Send message..."
          className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder:text-white/70"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              void handleSendMessage();
            }
          }}
        />
        <button
          onClick={() => void handleReact()}
          className={`text-white hover:scale-110 transition-transform ${
            isLiked ? 'text-red-500' : 'text-white'
          }`}
          type="button"
        >
          <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => void handleSendMessage()}
          disabled={isSending || message.trim().length === 0}
          className="text-white hover:scale-110 transition-transform disabled:opacity-50"
          type="button"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
