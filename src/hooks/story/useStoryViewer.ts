import { useEffect, useState } from 'react';

import type { Story } from '../../types/story';
import { useStoryNavigation } from './useStoryNavigation';

const STORY_DURATION = 5000; // 5 seconds

export const useStoryViewer = (stories: Story[]) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigation = useStoryNavigation(stories);

  useEffect(() => {
    if (!isVisible || navigation.isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= STORY_DURATION) {
          const hasNext = navigation.goToNext();
          if (!hasNext) {
            setIsVisible(false);
          }
          return 0;
        }
        return prev + 100;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [isVisible, navigation]);

  return {
    isVisible,
    progress,
    setIsVisible,
    ...navigation,
  };
};
