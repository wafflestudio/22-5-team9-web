import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Story } from '../../types/story';
import type { UserProfile } from '../../types/user';
import { StoryCreator } from './StoryCreator';
import { StoryItem } from './StoryItem';
import { StoryViewer } from './StoryViewer/StoryViewer';

type UserStoryGroup = {
  userId: number;
  username: string;
  profileImage: string;
  stories: Story[];
};

export function StoryList() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStoryGroups, setUserStoryGroups] = useState<UserStoryGroup[]>([]);

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (token == null) {
          localStorage.clear();
          void navigate('/');
          throw new Error('No access token found');
        }

        // First get current user info
        const userResponse = await fetch(
          'http://3.34.185.81:8000/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            localStorage.clear();
            void navigate('/');
            throw new Error('Token expired or invalid');
          }
          throw new Error('Failed to fetch user info');
        }

        const userData = (await userResponse.json()) as UserProfile;
        setCurrentUserId(userData.user_id);

        // Then get stories
        const storiesResponse = await fetch(
          `http://3.34.185.81:8000/api/story/list/${userData.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!storiesResponse.ok) {
          throw new Error('Failed to fetch stories');
        }

        const stories = (await storiesResponse.json()) as Story[];

        // Group stories by user and fetch user details
        const storiesByUser = stories.reduce<Record<number, Story[]>>((acc, story) => {
          if (acc[story.user_id] == null) {
            acc[story.user_id] = [];
          }
          acc[story.user_id]?.push(story);
          return acc;
        }, {});

        // For each user with stories, fetch their profile
        const storyGroups = await Promise.all(
          Object.entries(storiesByUser).map(async ([userId, userStories]) => {
            try {
              const userProfileResponse = await fetch(
                `http://3.34.185.81:8000/api/user/profile`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (!userProfileResponse.ok) {
                throw new Error('Failed to fetch user profile');
              }

              const userProfile = (await userProfileResponse.json()) as UserProfile;

              return {
                userId: Number(userId),
                username: userProfile.username,
                profileImage: userProfile.profile_image,
                stories: userStories,
              };
            } catch (innerError) {
              console.error('Error fetching user profile:', innerError);
              return {
                userId: Number(userId),
                username: `user${userId}`,
                profileImage: 'https://placehold.co/32x32',
                stories: userStories,
              };
            }
          }),
        );

        setUserStoryGroups(storyGroups);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchUserStories();
  }, [navigate]);

  const handleViewStory = (userId: number, stories: Story[]) => {
    setSelectedUserId(userId);
    setViewingStories(stories);
  };

  const handleCloseViewer = () => {
    setSelectedUserId(null);
    setViewingStories([]);
  };

  const handleDeleteStory = async (storyId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (token == null) throw new Error('No access token');

      const response = await fetch(
        `http://3.34.185.81:8000/api/story/${storyId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error('Failed to delete story');

      // Update the UI after successful deletion
      setUserStoryGroups((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          stories: group.stories.filter((story) => story.story_id !== storyId),
        })).filter((group) => group.stories.length > 0),
      );

      handleCloseViewer();
    } catch (deleteError) {
      console.error('Error deleting story:', deleteError);
    }
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
    return null;
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
      <StoryCreator />
      {userStoryGroups.map((group) => (
        <StoryItem
          key={group.userId}
          username={group.username}
          profileImage={group.profileImage}
          stories={group.stories}
          onView={() => { handleViewStory(group.userId, group.stories); }}
        />
      ))}
      {viewingStories.length > 0 && (
        <StoryViewer
          stories={viewingStories}
          onClose={handleCloseViewer}
          onDelete={selectedUserId === currentUserId ? handleDeleteStory : undefined}
          isOwner={selectedUserId === currentUserId}
        />
      )}
    </div>
  );
}