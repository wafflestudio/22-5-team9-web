import { useCallback, useEffect, useState } from 'react';

import type { StoryViewerProps } from '../../shared/types';
import { Controls } from './Controls';
import { Progress } from './Progress';
import { ReactionBar } from './ReactionBar';
import { UserHeader } from './UserHeader';

const STORY_DURATION = 5000; // 5 seconds

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentIndex: initialIndex,
  isOwner,
  onClose,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= STORY_DURATION) {
          handleNext();
          return 0;
        }
        return prev + 100;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [handleNext, isPaused]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const currentStory = stories[currentIndex];
  if (currentStory == null) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-screen-md mx-auto">
        <Progress
          duration={STORY_DURATION}
          currentTime={progress}
          total={stories.length}
          current={currentIndex}
        />

        <UserHeader
          username={`user${currentStory.user_id}`}
          profileImage="/placeholder.svg"
          timestamp={new Date(currentStory.creation_date).toLocaleString()}
          isOwner={isOwner}
          onDelete={
            onDelete != null
              ? async () => {
                  await onDelete(currentStory.story_id);
                }
              : undefined
          }
        />

        <Controls
          onNext={handleNext}
          onPrevious={handlePrevious}
          onClose={onClose}
          onDelete={
            onDelete != null
              ? async () => {
                  await onDelete(currentStory.story_id);
                }
              : undefined
          }
          canGoNext={currentIndex < stories.length - 1}
          canGoPrevious={currentIndex > 0}
          isOwner={isOwner}
          username={`user${currentStory.user_id}`}
          timestamp={new Date(currentStory.creation_date).toLocaleString()}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={() => {
            setIsPaused(true);
          }}
          onTouchEnd={() => {
            setIsPaused(false);
          }}
          onMouseDown={() => {
            setIsPaused(true);
          }}
          onMouseUp={() => {
            setIsPaused(false);
          }}
        >
          <img
            src={`https://waffle-instaclone.kro.kr/${currentStory.file_url[0] ?? ''}`}
            alt={`Story ${currentStory.story_id}`}
            className="max-h-full object-contain"
          />
        </div>

        <ReactionBar
          storyId={currentStory.story_id}
          userId={currentStory.user_id}
        />
      </div>
    </div>
  );
};
