import { useEffect, useState } from 'react';

import type { Story } from '../types/story';

export function useStories(userId: number | null) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      if (userId == null || userId === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (token == null) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          `https://waffle-instaclone.kro.kr/api/story/list/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server responded with ${response.status}: ${errorText}`,
          );
        }

        const data = (await response.json()) as Story[];
        setStories(data);
      } catch (err) {
        console.error('Story fetch error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch stories',
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchStories();
  }, [userId]);

  const deleteStory = async (storyId: number) => {
    if (userId == null) return;

    try {
      const response = await fetch(
        `https://waffle-instaclone.kro.kr/api/story/${storyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete story: ${errorText}`);
      }

      setStories(stories.filter((story) => story.story_id !== storyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
      throw err;
    }
  };

  return { stories, loading, error, deleteStory };
}
