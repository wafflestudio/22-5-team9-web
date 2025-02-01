import { useCallback, useState } from 'react';

import type { Story } from '../../types/story';

export const useStoryNavigation = (
  stories: Story[],
  initialIndex: number = 0,
) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return true;
    }
    return false;
  }, [currentIndex, stories.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return true;
    }
    return false;
  }, [currentIndex]);

  return {
    currentIndex,
    isPaused,
    setIsPaused,
    goToNext,
    goToPrevious,
    canGoNext: currentIndex < stories.length - 1,
    canGoPrevious: currentIndex > 0,
  };
};
