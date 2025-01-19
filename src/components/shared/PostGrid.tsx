import type { Post } from '../../types/post';

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div key={post.post_id} className="aspect-square relative">
          <img
            src={`https://waffle-instaclone.kro.kr/${post.file_url[0] as string}`}
            alt="Post image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
