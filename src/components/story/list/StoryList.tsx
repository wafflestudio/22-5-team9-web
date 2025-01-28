import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStories } from '../../../hooks/story/useStories';
import { useStoryProcessing } from '../../../hooks/story/useStoryProcessing';
import type { Story } from '../../../types/story';
import type { UserProfile } from '../../../types/user';
import { StoryCreator } from '../creation/StoryCreator';
import { StoryViewer } from '../viewer/StoryViewer/index';
import { StoryItem } from './StoryItem';

export function StoryList() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    stories,
    error: storiesError,
    deleteStory,
  } = useStories(currentUserId);

  const {
    processing,
    error: processingError,
    processMedia,
  } = useStoryProcessing();

  // Handle file processing
  const handleStoryCreate = async (file: File) => {
    try {
      const processedMedia = await processMedia(file);
      if (processedMedia === null) {
        throw new Error('Failed to process media');
      }

      // Add processed media to form data
      const formData = new FormData();
      formData.append('files', processedMedia.file);

      // Upload processed story
      const response = await fetch(
        'https://waffle-instaclone.kro.kr/api/story/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to upload story');
      }

      // Refresh stories
      window.location.reload();
    } catch (err) {
      console.error('Error creating story:', err);
      setError(err instanceof Error ? err.message : 'Failed to create story');
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (token == null) {
          localStorage.removeItem('isLoggedIn');
          void navigate('/');
          throw new Error('No access token found');
        }

        const response = await fetch(
          'https://waffle-instaclone.kro.kr/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('isLoggedIn');
            void navigate('/');
            throw new Error('Token expired or invalid');
          }
          throw new Error('Failed to fetch user info');
        }

        const userData = (await response.json()) as UserProfile;
        if (userData != null) {
          setCurrentUserId(userData.user_id);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching user info:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserInfo();
  }, [navigate]);

  const handleViewStory = (userId: number, userStories: Story[]) => {
    setSelectedUserId(userId);
    setViewingStories(userStories);
    setCurrentStoryIndex(0);
  };

  const handleCloseViewer = () => {
    setSelectedUserId(null);
    setViewingStories([]);
    setCurrentStoryIndex(0);
  };

  if (loading || processing) {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
        <div className="animate-pulse flex space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error != null || storiesError != null || processingError != null) {
    console.error({
      mainError: error,
      storiesError,
      processingError,
    });
    return null;
  }

  // Group stories by user
  const storiesByUser = stories.reduce<Record<number, Story[]>>(
    (acc, story: Story) => {
      if (acc[story.user_id] == null) {
        acc[story.user_id] = [];
      }
      acc[story.user_id]?.push(story);
      return acc;
    },
    {},
  );

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
      <StoryCreator onFileSelect={handleStoryCreate} />
      {Object.entries(storiesByUser).map(([userId, userStories]) => (
        <StoryItem
          key={userId}
          username={`user${userId}`}
          stories={userStories}
          onView={() => {
            handleViewStory(Number(userId), userStories);
          }}
        />
      ))}
      {viewingStories.length > 0 && (
        <StoryViewer
          stories={viewingStories}
          currentIndex={currentStoryIndex}
          onClose={handleCloseViewer}
          onDelete={selectedUserId === currentUserId ? deleteStory : undefined}
          isOwner={selectedUserId === currentUserId}
        />
      )}
    </div>
  );
}
