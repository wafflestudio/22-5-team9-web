import { Bookmark, Grid } from 'lucide-react';
import { useState } from 'react';

import PostGrid from '../shared/PostGrid';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div>
      <div className="flex justify-around border-t">
        <button
          className={`flex-1 py-2 ${activeTab === 'posts' ? 'border-t-2 border-black' : ''}`}
          onClick={() => {
            setActiveTab('posts');
          }}
        >
          <Grid className="w-6 h-6 mx-auto" />
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 'saved' ? 'border-t-2 border-black' : ''}`}
          onClick={() => {
            setActiveTab('saved');
          }}
        >
          <Bookmark className="w-6 h-6 mx-auto" />
        </button>
      </div>
      {activeTab === 'posts' && <PostGrid />}
      {activeTab === 'saved' && <div className="text-center py-8">저장됨</div>}
    </div>
  );
};

export default ProfileTabs;
