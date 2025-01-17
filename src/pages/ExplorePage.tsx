import { useState } from 'react';

import MobileBar from '../components/layout/MobileBar';
import SideBar from '../components/layout/SideBar';
import PostGrid from '../components/shared/PostGrid';
import PostModal from '../components/shared/PostModal';
import type { APIPost } from '../types/post';

const ExplorePage = () => {
  const [selectedPost, setSelectedPost] = useState<APIPost | null>(null);

  // This is a placeholder. In a real app, you'd fetch this from an API
  const dummyPostIds = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <PostGrid 
            postIds={dummyPostIds} 
            onPostClick={setSelectedPost}
          />
          {selectedPost !== null && (
            <PostModal 
              post={selectedPost} 
              onClose={() => { setSelectedPost(null); }} 
            />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar />
        <MobileBar />
      </div>
    </div>
  );
};

export default ExplorePage;