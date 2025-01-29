import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { createComment, fetchComments } from '../api/comment';
import { likePost, unlikePost } from '../api/like';
import { deletePost, fetchPost } from '../api/post';
import { LoginContext } from '../App';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import CommentSection from '../components/post/CommentSection';
import PostActions from '../components/post/PostActions';
import PostContent from '../components/post/PostContent';
import PostHeader from '../components/post/PostHeader';
import PostImage from '../components/post/PostImage';
import type { Comment } from '../types/comment';
import type { Post } from '../types/post';

const PostDetailPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const context = useContext(LoginContext);
  const navigate = useNavigate();

  const isOwnPost = post?.user_id === context?.myProfile?.user_id;

  const handleAddComment = async (comment: string) => {
    if (post == null) return;

    try {
      const newComment = await createComment({
        comment_text: comment,
        post_id: post.post_id,
        parent_id: 0,
      });

      setComments((prevComments) => [
        ...prevComments,
        {
          ...newComment,
          username: context?.myProfile?.username ?? '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentDelete = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.comment_id !== commentId),
    );
  };

  const handleEdit = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  const handleDelete = () => {
    if (post == null) return;
    try {
      void (async () => {
        await deletePost(post.post_id);
        void navigate('/');
      })();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (post == null || context?.myProfile?.user_id == null) return;
    try {
      const userId = context.myProfile.user_id;
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        await unlikePost(post.post_id);
      } else {
        await likePost(post.post_id);
      }

      setPost((prev) => {
        if (prev == null) return null;
        return {
          ...prev,
          likes: isLiked
            ? prev.likes.filter((id) => id !== userId)
            : [...prev.likes, userId],
        };
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    const loadPostAndComments = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          fetchPost(postId as string),
          fetchComments(postId as string),
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadPostAndComments();
  }, [postId]);

  return (
    <div className="flex flex-col h-screen bg-white md:bg-gray-50">
      <MobileHeader />
      <div className="flex-1 md:p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="h-full md:h-[calc(100vh-2rem)] md:max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center py-4">Loading post...</div>
          ) : (
            post != null && (
              <div className="bg-white h-full md:border md:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row h-full">
                  <PostImage imageUrl={post.file_url[0] as string} />
                  <div className="md:w-[40%] md:border-l flex flex-col h-full">
                    <PostHeader
                      userId={post.user_id}
                      isOwnPost={isOwnPost}
                      onDelete={handleDelete}
                      post={post}
                      onEdit={handleEdit}
                    />
                    <div className="flex-1 flex flex-col min-h-0">
                      <PostContent
                        userId={post.user_id}
                        postText={post.post_text}
                      />
                      <CommentSection
                        comments={comments}
                        currentUserId={context?.myProfile?.user_id ?? -1}
                        onCommentDelete={handleCommentDelete}
                      />
                      <PostActions
                        likes={post.likes}
                        currentUserId={context?.myProfile?.user_id ?? -1}
                        onLikeToggle={() => void handleLikeToggle()}
                        onAddComment={(comment) =>
                          void handleAddComment(comment)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 md:left-0 md:top-0 md:right-auto md:w-64 bg-white border-t md:border-r md:border-t-0">
        <SideBar
          onSearchClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
        <MobileBar
          onSearchClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
