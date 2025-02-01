import { useMemo } from 'react';

import type { Story } from '../types/story';

export const useExpiredStories = (stories: Story[]) => {
  return useMemo(() => {
    const now = new Date();
    return stories.filter(story => {
      const expirationDate = new Date(story.expiration_date);
      return expirationDate > now;
    });
  }, [stories]);
};