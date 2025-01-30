import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStories } from '../../../hooks/story/useStories';
import { useStoryProcessing } from '../../../hooks/story/useStoryProcessing';
import type { Story } from '../../../types/story';
import type { UserProfile } from '../../../types/user';
import { authenticatedFetch } from '../../../utils/auth';
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
        console.log('Access token check:', !(token == null));

        if (token == null) {
          localStorage.removeItem('isLoggedIn');
          void navigate('/');
          throw new Error('No access token found');
        }

        const response = await authenticatedFetch(
          'https://waffle-instaclone.kro.kr/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            credentials: 'include'
          },
        );

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        console.log('Content type:', contentType);
        if (contentType?.includes('application/json') === false) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned non-JSON response');
        }
        try {
          const userData = await response.json() as UserProfile;
          console.log('User data received:', userData?.user_id); // Debug user data
          if (userData?.user_id === 0) throw new Error('Invalid user data format');
          setCurrentUserId(userData != null ? userData.user_id : null);
          setError(null);
        } catch (err) {
          console.error('Failed to parse response:', err);
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching user info:', {
          error: err,
          token: (localStorage.getItem('access_token') != null) ? 'Token exists' : 'No token',
          currentUserId
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchUserInfo();
  }, [currentUserId, navigate]);

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
        <StoryCreator onFileSelect={handleStoryCreate} />
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
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
        <StoryCreator onFileSelect={handleStoryCreate} />
      </div>
    );
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
