import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Story } from '../../types/story';

interface StoryItemProps {
  username: string;
  profileImage?: string;
  stories: Story[];
  onView: () => void;
}

export function StoryItem({
  username,
  profileImage,
  stories,
  onView
}: StoryItemProps) {
  const navigate = useNavigate();
  const [hasUnviewedStories, setHasUnviewedStories] = useState(false);
  useEffect(() => {
    const checkUnviewed = () => {
      const hasUnviewed = stories.some(story => {
        const viewedAt = localStorage.getItem(`story-${story.story_id}-viewed`);
        return viewedAt == null;
      });
      setHasUnviewedStories(hasUnviewed);
    };
    checkUnviewed();
  }, [stories]);
  const handleClick = () => {
    if (stories.length > 0) {
      // Find first unviewed story
      const firstUnviewed = stories.find(story => {
        const viewedAt = localStorage.getItem(`story-${story.story_id}-viewed`);
        return viewedAt == null;
      });

      // If all stories are viewed, show the first story
      const storyToShow = firstUnviewed ?? stories[0];
      
      if (storyToShow != null) {
        void navigate(`/stories/${username}/${storyToShow.story_id}`);
        onView();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center"
      type="button"
    >
      <div
        className={`w-16 h-16 rounded-full p-0.5 ${
          stories.length > 0 && hasUnviewedStories
            ? 'bg-gradient-to-tr from-yellow-400 to-pink-600'
            : 'bg-gray-200'
        }`}
      >
        <div className="w-full h-full rounded-full bg-white p-0.5">
          <img
            src={profileImage ?? '../shared/default-profile.png'}
            alt={username}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      <p className="mt-1 text-xs">{username}</p>
    </button>
  );
}
