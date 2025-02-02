import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useExpiredStories } from '../../hooks/useExpiredStories';
import type { Story } from '../../types/story';
import type { UserProfile } from '../../types/user';
import { StoryCreator } from './StoryCreator';
import { StoryItem } from './StoryItem';
import StoryViewer from './StoryViewer/StoryViewer';

const API_BASE = 'https://waffle-instaclone.kro.kr';

interface UserStoryGroup {
  userId: number;
  hasUnviewed: boolean;
  latestStoryDate: string;
  stories: Story[];
  userProfile?: UserProfile;
}

export function StoryList() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<number, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeStories = useExpiredStories(stories);

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

      const userData = await response.json() as UserProfile;
      setUserProfiles(prev => ({
        ...prev,
        [userId]: userData
      }));

      return userData;
    } catch (err) {
      console.error(`Error fetching profile for user ${userId}:`, err);
      return null;
    }
  };

  const fetchStoriesForUser = async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/story/list/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      return await response.json() as Story[];
    } catch (err) {
      console.error(`Error fetching stories for user ${userId}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        if (token == null) {
          localStorage.removeItem('isLoggedIn');
          void navigate('/');
          return;
        }
        // Fetch current user profile
        const currentUserResponse = await fetch(`${API_BASE}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!currentUserResponse.ok) {
          if (currentUserResponse.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('isLoggedIn');
            void navigate('/');
            return;
          }
          throw new Error('Failed to fetch user info');
        }

        const currentUser = await currentUserResponse.json() as UserProfile;
        if ((currentUser?.user_id) == null) throw new Error('Invalid user data');
        
        setCurrentUserId(currentUser.user_id);
        
        // Fetch stories for current user and their following
        const userIds = [currentUser.user_id, ...currentUser.following];
        const allStories = await Promise.all(
          userIds.map(async (userId) => {
            const userStories = await fetchStoriesForUser(userId);
            return userStories;
          })
        );

        // Fetch profiles for all users with stories
        await Promise.all(
          userIds.map(uid => fetchUserProfile(uid))
        );

        setStories(allStories.flat());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stories');
      } finally {
        setLoading(false);
      }
    };

    void fetchAllStories();
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

      setStories(stories.filter(story => story.story_id !== storyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete story');
      throw err;
    }
  };

  const organizeStories = (storiesToOrganize: Story[]): UserStoryGroup[] => {
    const storyGroups = new Map<number, UserStoryGroup>();
    
    storiesToOrganize.forEach(story => {
      const group = storyGroups.get(story.user_id) ?? {
        userId: story.user_id,
        hasUnviewed: false,
        latestStoryDate: '',
        stories: [],
        userProfile: userProfiles[story.user_id]
      };

      const isViewed = localStorage.getItem(`story-${story.story_id}-viewed`) !== null;
      if (!isViewed) {
        group.hasUnviewed = true;
      }

      if ((group.latestStoryDate.length === 0) || story.creation_date > group.latestStoryDate) {
        group.latestStoryDate = story.creation_date;
      }

      group.stories.push(story);
      storyGroups.set(story.user_id, group);
    });

    return Array.from(storyGroups.values())
      .sort((a, b) => {
        // First sort by unviewed status
        if (a.hasUnviewed !== b.hasUnviewed) {
          return a.hasUnviewed ? -1 : 1;
        }
        // Then sort by latest story date
        return b.latestStoryDate.localeCompare(a.latestStoryDate);
      });
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

  const organizedStories = organizeStories(activeStories);

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
          {organizedStories.map((group) => (
            <StoryItem
              key={group.userId}
              username={group.userProfile?.username ?? 'Loading...'}
              profileImage={((group.userProfile?.profile_image) != null) ? 
                `${API_BASE}/${group.userProfile.profile_image}` : 
                undefined}
              stories={group.stories}
              onView={() => { handleViewStory(group.userId, group.stories); }}
            />
          ))}
        </>
      )}

      {viewingStories.length > 0 && (
        <StoryViewer
          stories={viewingStories}
          username={userProfiles[selectedUserId ?? 0]?.username ?? ''}
          profileImage={((userProfiles[selectedUserId ?? 0]?.profile_image) != null) ? 
            `${API_BASE}/${userProfiles[selectedUserId ?? 0]?.profile_image}` : 
            undefined}
          onClose={handleCloseViewer}
          onDelete={selectedUserId === currentUserId ? deleteStory : undefined}
          isOwner={selectedUserId === currentUserId}
          initialIndex={0}
        />
      )}
    </div>
  );
}