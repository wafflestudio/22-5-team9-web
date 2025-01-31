import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoginContext } from '../App';
import { StoryViewer } from '../components/story/StoryViewer/StoryViewer';
import type { Story } from '../types/story';
import type { UserProfile } from '../types/user';

export default function StoryPage() {
  const { username, storyId } = useParams<{ username: string; storyId: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const context = useContext(LoginContext);

  useEffect(() => {
    const fetchStories = async () => {
      if (username == null) return;
      
      try {
        setLoading(true);
        // First fetch user info to get user_id
        const userResponse = await fetch(
          `https://waffle-instaclone.kro.kr/api/user/${username}`
        );
        if (!userResponse.ok) throw new Error('User not found');
        const userData = await userResponse.json() as UserProfile;
        if (userData?.user_id == null) throw new Error('Invalid user data');

        // Then fetch stories for that user
        const storiesResponse = await fetch(
          `https://waffle-instaclone.kro.kr/api/story/list/${userData.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
            },
          }
        );
        if (!storiesResponse.ok) throw new Error('Failed to fetch stories');
        const storiesData = await storiesResponse.json() as Story[];
        
        setStories(storiesData);
        
        // Find the index of the requested story
        const index = storiesData.findIndex(
          story => story.story_id.toString() === storyId
        );
        if (index === -1) throw new Error('Story not found');
        setCurrentIndex(index);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    void fetchStories();
  }, [username, storyId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error != null || stories.length === 0 || username == null) {
    return <div className="flex items-center justify-center h-screen">Story not found</div>;
  }

  const handleClose = () => {
    void navigate('/', { replace: true });
  };

  const handleDelete = async (storyToDeleteId: number) => {
    try {
      const response = await fetch(
        `https://waffle-instaclone.kro.kr/api/story/${storyToDeleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete story');
      void navigate('/', { replace: true });
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  const isOwner = context?.myProfile?.username === username;

  return (
    <StoryViewer
      stories={stories}
      username={username}
      onClose={handleClose}
      onDelete={isOwner ? handleDelete : undefined}
      isOwner={isOwner}
      initialIndex={currentIndex}
    />
  );
}