import { useEffect, useState } from 'react';

import type { Story } from '../../../types/story';
import { StoryControls } from './StoryControls';
import { StoryProgress } from './StoryProgress';

interface StoryViewerProps {
  stories: Story[];
  onClose: () => void;
  onDelete?: (storyId: number) => Promise<void>;
  isOwner?: boolean;
}

const API_BASE_URL = 'http://3.34.185.81:8000';

export function StoryViewer({
  stories,
  onClose,
  onDelete,
  isOwner = false,
}: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000;

  useEffect(() => {
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
  }, [currentStoryIndex, stories.length, onClose]);

  const currentStory = stories[currentStoryIndex];
  if (currentStory == null) return null;

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
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
                ? () => void onDelete(currentStory.story_id)
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
