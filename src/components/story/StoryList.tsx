import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Story } from '../../types/story';
import type { UserProfile } from '../../types/user';
import { StoryCreator } from './StoryCreator';
import { StoryItem } from './StoryItem';
import StoryViewer from './StoryViewer/StoryViewer';

const API_BASE = 'https://waffle-instaclone.kro.kr';

export function StoryList() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<number, UserProfile>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile for a specific user ID
  const fetchUserProfile = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = (await response.json()) as UserProfile;
      setUserProfiles((prev) => ({
        ...prev,
        [userId]: userData,
      }));
    } catch (err) {
      console.error(`Error fetching profile for user ${userId}:`, err);
    }
  };

  // Fetch current user profile
  useEffect(() => {
    // Fetch stories and associated user profiles
    const fetchStories = async (userId: number) => {
      try {
        const token = localStorage.getItem('access_token');
        if (token == null) return;

        const response = await fetch(`${API_BASE}/api/story/list/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { detail: string };
          throw new Error(errorData.detail || 'Failed to fetch stories');
        }

        const data = (await response.json()) as Story[];
        setStories(data);

        // Fetch user profiles for all unique user IDs in stories
        const uniqueUserIds = [...new Set(data.map((story) => story.user_id))];
        await Promise.all(uniqueUserIds.map((uid) => fetchUserProfile(uid)));

        setError(null);
      } catch (err) {
        console.error('Story fetch error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch stories',
        );
      }
    };
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        if (token == null) {
          localStorage.removeItem('isLoggedIn');
          void navigate('/');
          return;
        }

        const response = await fetch(`${API_BASE}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('isLoggedIn');
            void navigate('/');
            return;
          }
          throw new Error('Failed to fetch user info');
        }

        const userData = (await response.json()) as UserProfile;
        if (userData?.user_id != null) {
          setCurrentUserId(userData.user_id);
          void fetchStories(userData.user_id);
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

  const deleteStory = async (storyId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/story/${storyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      setStories(stories.filter((story) => story.story_id !== storyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
      throw err;
    }
  };

  const handleViewStory = (userId: number, userStories: Story[]) => {
    setSelectedUserId(userId);
    setViewingStories(userStories);
  };

  const handleCloseViewer = () => {
    setSelectedUserId(null);
    setViewingStories([]);
  };

  if (error != null) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const storyGroups = stories.reduce<Record<number, Story[]>>((acc, story) => {
    if (acc[story.user_id] == null) {
      acc[story.user_id] = [];
    }
    acc[story.user_id]?.push(story);
    return acc;
  }, {});

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
      <StoryCreator />

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        </div>
      ) : (
        <>
          {Object.entries(storyGroups).map(([userId, userStories]) => {
            const userProfile = userProfiles[Number(userId)];
            return (
              <StoryItem
                key={userId}
                username={userProfile?.username ?? 'Loading...'}
                profileImage={
                  userProfile?.profile_image != null
                    ? `${API_BASE}/${userProfile.profile_image}`
                    : undefined
                }
                stories={userStories}
                onView={() => {
                  handleViewStory(Number(userId), userStories);
                }}
              />
            );
          })}
        </>
      )}

      {viewingStories.length > 0 && (
        <StoryViewer
          stories={viewingStories}
          username={userProfiles[selectedUserId ?? 0]?.username ?? ''}
          onClose={handleCloseViewer}
          onDelete={selectedUserId === currentUserId ? deleteStory : undefined}
          isOwner={selectedUserId === currentUserId}
          initialIndex={0}
        />
      )}
    </div>
  );
}
