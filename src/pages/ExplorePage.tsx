import { useEffect, useState } from 'react';

import { getExplorePosts } from '../api/post';
import MobileBar from '../components/layout/MobileBar';
import SideBar from '../components/layout/SideBar';
import PostGrid from '../components/shared/PostGrid';
import type { Post } from '../types/post';

const ExplorePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getExplorePosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching explore posts:', error);
      }
    };

    void fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <PostGrid posts={posts} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar
          onSearchClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
        <MobileBar />
      </div>
    </div>
  );
};

export default ExplorePage;
