import { Link } from 'react-router-dom';

import type { Post } from '../../types/post';

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime(),
  );

  return (
    <div className="grid grid-cols-3 gap-1">
      {sortedPosts.map((post) => (
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
