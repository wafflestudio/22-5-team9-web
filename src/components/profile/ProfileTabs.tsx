import { Grid } from 'lucide-react';
import { useState } from 'react';

import type { APIPost } from '../../types/post';
import PostGrid from '../shared/PostGrid';
import PostModal from '../shared/PostModal';

interface ProfileTabsProps {
  postIds: number[];
}

const ProfileTabs = ({ postIds }: ProfileTabsProps) => {
  const [selectedPost, setSelectedPost] = useState<APIPost | null>(null);

  return (
    <div>
      <div className="border-t">
        <div className="flex justify-center">
          <button className="flex items-center py-4 space-x-1 text-sm font-semibold border-t border-black">
            <Grid className="w-4 h-4" />
            <span>POSTS</span>
          </button>
        </div>
      </div>

      <PostGrid 
        postIds={postIds} 
        onPostClick={(post: APIPost) => { setSelectedPost(post); }} 
      />

      {selectedPost !== null && (
        <PostModal post={selectedPost} onClose={() => { setSelectedPost(null); }} />
      )}
    </div>
  );
};

export default ProfileTabs;