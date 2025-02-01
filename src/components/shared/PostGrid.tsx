import { Link } from 'react-router-dom';

import type { Post } from '../../types/post';

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link
          to={`/post/${post.post_id}`}
          key={post.post_id}
          className="aspect-square relative block overflow-hidden"
        >
          <img
            src={`https://waffle-instaclone.kro.kr/${post.file_url[0] as string}`}
            alt="Post image"
            className="absolute inset-0 w-full h-full object-cover hover:opacity-95 transition-opacity"
          />
        </Link>
      ))}
    </div>
  );
};

export default PostGrid;
