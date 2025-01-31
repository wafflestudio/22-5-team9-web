import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Story } from '../../../types/story';
import StoryControls from './StoryControls';
import { StoryProgress } from './StoryProgress';

interface StoryViewerProps {
  stories: Story[];
  username: string;
  onClose: () => void;
  onDelete?: (storyId: number) => Promise<void>;
  isOwner?: boolean;
  initialIndex: number;
}

const API_BASE_URL = 'https://waffle-instaclone.kro.kr';

export function StoryViewer({
  stories,
  onClose,
  onDelete,
  isOwner = false,
  username,
}: StoryViewerProps) {
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000;

  useEffect(() => {
    const currentStory = stories[currentStoryIndex];
    if (currentStory != null) {
      localStorage.setItem(`story-${currentStory.story_id}-viewed`, new Date().toISOString());
    }
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= STORY_DURATION) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex((index) => index + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + 100;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [currentStoryIndex, stories, onClose]);

  const handleDelete = async (storyId: number) => {
    try {
      if (onDelete != null) {
        await onDelete(storyId);
        void navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const currentStory = stories[currentStoryIndex];
  if (currentStory == null) return null;

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
      const nextStory = stories[currentStoryIndex + 1];
      if (nextStory != null) {
        void navigate(`/stories/${username}/${nextStory.story_id}`, { replace: true });
      }
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Convert relative URL to absolute URL
  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url.replace(/^\/+/, '')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <StoryProgress duration={STORY_DURATION} currentTime={progress} />
        <div className="relative">
          <img
            src={
              currentStory.file_url[0] != null
                ? getFullImageUrl(currentStory.file_url[0])
                : ''
            }
            alt={`Story ${currentStory.story_id}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Image failed to load:', e);
              const img = e.target as HTMLImageElement;
              img.alt = 'Failed to load story image';
            }}
          />
          <StoryControls
            onNext={handleNext}
            onPrevious={handlePrevious}
            onClose={onClose}
            onDelete={
              onDelete != null
                ? () => void handleDelete(currentStory.story_id)
                : undefined
            }
            canGoNext={currentStoryIndex < stories.length - 1}
            canGoPrevious={currentStoryIndex > 0}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}
