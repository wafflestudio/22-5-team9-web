import { Bookmark, Grid } from 'lucide-react';
import { useState } from 'react';

import PostGrid from '../shared/PostGrid';

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('posts');
import { useEffect, useState } from 'react';

import type { Post } from '../../types/post';
import PostGrid from '../shared/PostGrid';

type ProfileTabsProps = {
  postIds: number[];
};

const ProfileTabs = ({ postIds }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (postIds.length === 0) return;

      setIsLoading(true);
      try {
        const promises = postIds.map((id) =>
          fetch(`https://waffle-instaclone.kro.kr/api/post/${id}`, {
            headers: { accept: 'application/json' },
          }).then((res) => res.json()),
        );

        const results = (await Promise.all(promises)) as Post[];
        setPosts(results);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPosts();
  }, [postIds]);

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
      {activeTab === 'posts' &&
        (isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <PostGrid posts={posts} />
        ))}
      {activeTab === 'saved' && <div className="text-center py-8">저장됨</div>}
    </div>
  );
};

export default ProfileTabs;
