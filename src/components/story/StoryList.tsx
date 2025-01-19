import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStories } from '../../hooks/useStories';
import type { Story } from '../../types/story';
import type { UserProfile } from '../../types/user';
import { StoryCreator } from './StoryCreator';
import { StoryItem } from './StoryItem';
import { StoryViewer } from './StoryViewer/StoryViewer';

export function StoryList() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    stories,
    error: storiesError,
    deleteStory,
  } = useStories(currentUserId ?? 0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (token == null) {
          localStorage.removeItem('isLoggedIn'); // Clear login state
          void navigate('/'); // Redirect to login
          throw new Error('No access token found');
        }

        const response = await fetch(
          'http://3.34.185.81:8000/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
  };

  const handleCloseViewer = () => {
    setSelectedUserId(null);
    setViewingStories([]);
  };

  if (loading) {
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

  if (error != null) {
    return null; // Don't show error UI, just hide the stories section
  }

  if (storiesError != null) {
    return null; // Don't show error UI, just hide the stories section
  }

  // Group stories by user
  const storiesByUser = stories.reduce<Record<number, Story[]>>(
    (acc, story) => {
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
      <StoryCreator />
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
          onClose={handleCloseViewer}
          onDelete={selectedUserId === currentUserId ? deleteStory : undefined}
          isOwner={selectedUserId === currentUserId}
        />
      )}
    </div>
  );
}
