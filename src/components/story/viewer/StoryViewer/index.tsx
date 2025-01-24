import { useEffect, useState } from 'react';

import { useStoryNavigation } from '../../../../hooks/story/useStoryNavigation';
import { useStoryViewer } from '../../../../hooks/story/useStoryViewer';
import type { StoryViewerProps } from '../../shared/types';
import { Controls } from './Controls';
import { Progress } from './Progress';
import { ReactionBar } from './ReactionBar';
import { UserHeader } from './UserHeader';

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  currentIndex: initialIndex,
  isOwner,
  onClose,
  onDelete,
}) => {
  const navigation = useStoryNavigation(stories, initialIndex);
  const {
    progress,
    isPaused,
    setIsPaused,
		resetProgress,
		currentIndex,
		goToNext,
		goToPrevious,
		canGoNext,
		canGoPrevious,
		isVisible,
		setIsVisible,
  } = useStoryViewer(stories);

	useEffect(() => {
    resetProgress();
  }, [currentIndex, resetProgress]);

	useEffect(() => {
    if (!isPaused && progress >= 5000) {
  		goToNext();
    }
  }, [progress, isPaused, goToNext]);

  useEffect(() => {
    if (currentIndex >= stories.length) {
      setIsVisible(false);
      onClose();
    }
  }, [currentIndex, stories.length, onClose, setIsVisible]);

  const currentStory = stories[currentIndex];
  if (currentStory == null || !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-screen-md mx-auto">
        <Progress
          duration={5000}
          currentTime={progress}
          total={stories.length}
          current={navigation.currentIndex}
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
                  setIsVisible(false);
                }
              : undefined
          }
        />

        <Controls
          storyId={String(currentStory.story_id)}
          storyUrl={`https://waffle-instaclone.kro.kr/${currentStory.file_url[0] ?? ''}`}
          onNext={navigation.goToNext}
          onPrevious={navigation.goToPrevious}
          onClose={() => {
            setIsVisible(false);
            onClose();
          }}
          onDelete={
            onDelete != null
              ? async () => {
                  await onDelete(currentStory.story_id);
                  setIsVisible(false);
                }
              : undefined
          }
          canGoNext={navigation.canGoNext}
          canGoPrevious={navigation.canGoPrevious}
          isOwner={isOwner}
          username={`user${currentStory.user_id}`}
          timestamp={new Date(currentStory.creation_date).toLocaleString()}
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          onTouchStart={() => { setIsPaused(true); }}
          onTouchEnd={() => { setIsPaused(false); }}
          onMouseDown={() => { setIsPaused(true); }}
          onMouseUp={() => { setIsPaused(false); }}
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