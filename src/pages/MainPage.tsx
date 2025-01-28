import { useContext, useEffect, useState } from 'react';

import { likePost, unlikePost } from '../api/like';
import { fetchFollowingPosts } from '../api/post';
import { LoginContext } from '../App';
import Posts from '../components/feed/Posts';
import { Stories } from '../components/feed/Stories';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import SearchModal from '../components/modals/SearchModal';
import { useSearch } from '../hooks/useSearch';
import type { Post } from '../types/post';

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const context = useContext(LoginContext);

  useEffect(() => {
    const targetIds = [
      ...(context?.myProfile?.following as number[]),
      context?.myProfile?.user_id as number,
    ];

    const loadPosts = async () => {
      try {
        const allPosts = await fetchFollowingPosts(targetIds);
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, [context?.myProfile?.following, context?.myProfile?.user_id]);

  const handleLikeToggle = async (postId: number) => {
    const userId = context?.myProfile?.user_id;
    if (userId == null) return;

    try {
      const post = posts.find((p) => p.post_id === postId);
      if (post == null) return;

      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== userId)
                  : [...p.likes, userId],
              }
            : p,
        ),
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
        }}
      />
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <Stories />
          {loading ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : (
            <Posts
              posts={posts}
              postsPerPage={5}
              currentUserId={context?.myProfile?.user_id}
              onLikeToggle={handleLikeToggle}
            />
          )}
          <div className="text-xs text-gray-400 mt-8 mb-16 md:mb-4">
            <p>© INSTAGRAM</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar
          onSearchClick={() => {
            setIsSearchOpen(true);
          }}
        />
        <MobileBar />
      </div>
    </div>
  );
};

export default MainPage;
