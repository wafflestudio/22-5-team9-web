import { usePosts } from '../../hooks/usePosts';
import type { PostsProps } from '../../types/post';
import Post from './Post';

const Posts = ({
  posts,
  postsPerPage,
  currentUserId,
  onLikeToggle,
}: PostsProps) => {
  const { currentPosts, currentPage, totalPages, nextPage, prevPage } =
    usePosts(posts, postsPerPage);

  return (
    <div className="space-y-8">
      {currentPosts.map((post) => (
        <Post
          key={post.post_id}
          post_id={post.post_id}
          username={post.user_id.toString()}
          imageUrl={post.file_url[0] as string}
          caption={post.post_text}
          likes={post.likes.length}
          location={post.location}
          creation_date={post.creation_date}
          comments={post.comments.length}
          isLiked={
            currentUserId != null ? post.likes.includes(currentUserId) : false
          }
          onLikeToggle={onLikeToggle}
        />
      ))}
      <div className="flex justify-center mt-8 mb-16 md:mb-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-4 self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
