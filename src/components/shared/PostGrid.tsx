import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { APIPost } from '../../types/post';

interface PostGridProps {
  postIds: number[];
  onPostClick: (post: APIPost) => void;
}

const PostGrid = ({ postIds, onPostClick }: PostGridProps) => {
  const [posts, setPosts] = useState<APIPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        if (token === null) {
          void navigate('/');
          return;
        }

        const postsPromises = postIds.map(id =>
          fetch(`http://3.34.185.81:8000/api/post/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then(res => res.json())
        );

        const postsData = await Promise.all(postsPromises);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPosts();
  }, [postIds, navigate]);

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `http://3.34.185.81:8000/${url.replace(/^\/+/, '')}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div
          key={post.post_id}
          onClick={() => { onPostClick(post); }}
          className="aspect-square relative group cursor-pointer"
        >
          <img
            src={(post.file_url[0] != null) ? getFullImageUrl(post.file_url[0]) : '/placeholder.svg'}
            alt={post.post_text ?? 'Post image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              {((post.post_text != null) || (post.location != null)) && (
                <div className="text-white text-center p-2">
                  {(post.post_text != null) && <p className="text-sm mb-1">{post.post_text}</p>}
                  {(post.location != null) && <p className="text-xs">{post.location}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;