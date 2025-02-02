import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Story } from '../../types/story';

interface ProfileStoryViewProps {
  userId: number;
  username: string;
  profileImage: string;
}

const ProfileStoryView = ({ userId, username, profileImage }: ProfileStoryViewProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(
          `https://waffle-instaclone.kro.kr/api/story/list/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch stories');
        const data = await response.json() as Story[];
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStories();
  }, [userId]);

  const handleClick = () => {
    const firstStory = stories[0];
    if (stories.length > 0 && (firstStory != null)) {
      void navigate(`/stories/${username}/${firstStory.story_id}`);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="relative w-20 h-20 rounded-full"
    >
      <div 
        className={`w-full h-full rounded-full p-0.5 ${
          stories.length > 0 
            ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' 
            : 'bg-gray-200'
        }`}
      >
        <div className="w-full h-full rounded-full bg-white p-0.5">
          <img
            src={`https://waffle-instaclone.kro.kr/${profileImage}`}
            alt={username}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-full">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
};

export default ProfileStoryView;