import { useContext, useEffect, useState } from 'react';

import { LoginContext } from '../../App';
import type { Story } from '../../types/story';
import type { UserProfile } from '../../types/user';
import { StoryCreator } from './StoryCreator';
import { StoryItem } from './StoryItem';
import StoryViewer from './StoryViewer/StoryViewer';

const API_BASE = 'https://waffle-instaclone.kro.kr';

type NonNullUserProfile = Exclude<UserProfile, null>;
type UserStories = {
  user: NonNullUserProfile;
  stories: Story[];
  latestStory: Story;
  hasUnviewedStories: boolean;
};

export function StoryList() {
  const [userStories, setUserStories] = useState<UserStories[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingStories, setViewingStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(LoginContext);

  useEffect(() => {
    const fetchStoriesForUser = async (userId: number): Promise<Story[]> => {
      const response = await fetch(`${API_BASE}/api/story/list/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
        },
      });
      if (!response.ok) return [];
      return response.json() as Promise<Story[]>;
    };

    const fetchUserProfile = async (
      userId: number,
    ): Promise<UserProfile | null> => {
      try {
        const response = await fetch(`${API_BASE}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
        });
        if (!response.ok) return null;
        return (await response.json()) as UserProfile;
      } catch (err) {
        console.error(`Error fetching profile for user ${userId}:`, err);
        return null;
      }
    };

    const loadAllStories = async () => {
      try {
        setLoading(true);
        if (context?.myProfile == null) return;

        // Get all users we need to fetch (current user + following)
        const userIds = [
          context.myProfile.user_id,
          ...context.myProfile.following,
        ];

        // Fetch stories and profiles for all users
        const usersWithStories = await Promise.all(
          userIds.map(async (userId) => {
            const [stories, userProfile] = await Promise.all([
              fetchStoriesForUser(userId),
              fetchUserProfile(userId),
            ]);

            if (userProfile == null || stories.length === 0) return null;

            // Check for unviewed stories
            const hasUnviewedStories = stories.some((story) => {
              const viewedAt = localStorage.getItem(
                `story-${story.story_id}-viewed`,
              );
              return viewedAt == null;
            });

            // Get latest story by creation date
            const latestStory = stories.reduce((latest, current) => {
              return new Date(current.creation_date) >
                new Date(latest.creation_date)
                ? current
                : latest;
            }, stories[0]);

            return {
              user: userProfile,
              stories,
              latestStory,
              hasUnviewedStories,
            };
          }),
        );

        // Filter out null results and sort
        const validUserStories = usersWithStories
          .filter((item): item is UserStories => item !== null)
          .sort((a, b) => {
            // First sort by unviewed status
            if (a.hasUnviewedStories && !b.hasUnviewedStories) return -1;
            if (!a.hasUnviewedStories && b.hasUnviewedStories) return 1;

            // Then sort by latest story date
            return (
              new Date(b.latestStory.creation_date).getTime() -
              new Date(a.latestStory.creation_date).getTime()
            );
          });

        setUserStories(validUserStories);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch stories',
        );
      } finally {
        setLoading(false);
      }
    };

    void loadAllStories();
  }, [context?.myProfile]);

  const handleViewStory = (userId: number, userStoryData: UserStories) => {
    setSelectedUserId(userId);
    setViewingStories(userStoryData.stories);
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
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8">
      <StoryCreator />

      {userStories.map((userStoryData) => (
        <StoryItem
          key={userStoryData.user.user_id}
          username={userStoryData.user.username}
          profileImage={
            userStoryData.user.profile_image.length > 0
              ? `${API_BASE}/${userStoryData.user.profile_image}`
              : undefined
          }
          stories={userStoryData.stories}
          onView={() => {
            handleViewStory(userStoryData.user.user_id, userStoryData);
          }}
        />
      ))}

      {viewingStories.length > 0 && selectedUserId !== null && (
        <StoryViewer
          stories={viewingStories}
          username={
            userStories.find((us) => us.user.user_id === selectedUserId)?.user
              .username ?? 'Unknown'
          }
          profileImage={`${API_BASE}/${userStories.find((us) => us.user.user_id === selectedUserId)?.user.profile_image}`}
          onClose={handleCloseViewer}
          onDelete={
            selectedUserId === context?.myProfile?.user_id
              ? async (storyId) => {
                  try {
                    const response = await fetch(
                      `${API_BASE}/api/story/${storyId}`,
                      {
                        method: 'DELETE',
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
                        },
                      },
                    );
                    if (!response.ok) throw new Error('Failed to delete story');
                    setUserStories((prevStories) =>
                      prevStories
                        .map((us) =>
                          us.user.user_id === selectedUserId
                            ? {
                                ...us,
                                stories: us.stories.filter(
                                  (s) => s.story_id !== storyId,
                                ),
                              }
                            : us,
                        )
                        .filter((us) => us.stories.length > 0),
                    );
                  } catch (err) {
                    console.error('Failed to delete story:', err);
                    throw err;
                  }
                }
              : undefined
          }
          isOwner={selectedUserId === context?.myProfile?.user_id}
          initialIndex={0}
        />
      )}
    </div>
  );
}
