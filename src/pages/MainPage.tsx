import { useEffect, useState } from 'react';

import Posts from '../components/feed/Posts';
import { Stories } from '../components/feed/Stories';
import BottomBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import type { Post } from '../types/post';


const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const friendIds = [25, 39, 42, 'user1234']; // 임시 친구 목록

    const fetchPosts = async () => {
      try {
        const postsPromises = friendIds.map((id) =>
          fetch(`https://waffle-instaclone.kro.kr/api/post/user/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
            },
          }).then((res) => res.json()),
        );

        const postsArrays = await Promise.all(postsPromises);
        const allPosts = postsArrays.flat();

        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <MobileHeader />
          <Stories />
          {loading ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : (
            <Posts posts={posts} postsPerPage={5} />
          )}
          <div className="text-xs text-gray-400 mt-8 mb-16 md:mb-4">
            <p>© INSTAGRAM</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <BottomBar />
      </div>
    </div>
  );
};

export default MainPage;
