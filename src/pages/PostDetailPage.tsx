import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchComments } from '../api/comment';
import { likePost, unlikePost } from '../api/like';
import { deletePost, fetchPost } from '../api/post';
import { LoginContext } from '../App';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import type { Comment, Post } from '../types/post';

const PostDetailPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { postId } = useParams();
  const context = useContext(LoginContext);
  const navigate = useNavigate();

  const isOwnPost = post?.user_id === context?.myProfile?.user_id;

  const handleDelete = async () => {
    if (post == null) return;

    try {
      await deletePost(post.post_id);
      void navigate('/');
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
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 p-4 pb-16 md:pb-4 md:ml-64 overflow-y-auto">
        <div className="h-[calc(100vh-2rem)] max-w-5xl mx-auto">
          <MobileHeader />

          {loading ? (
            <div className="text-center py-4">Loading post...</div>
          ) : (
            post != null && (
              <div className="bg-white border rounded-lg overflow-hidden h-full">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-[60%] bg-black flex items-center justify-center h-full">
                    <img
                      src={`https://waffle-instaclone.kro.kr/${post.file_url[0] as string}`}
                      alt="Post"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="md:w-[40%] border-l flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center space-x-2">
                        <img
                          src={''}
                          alt={post.user_id.toString()}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">{post.user_id}</span>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => {
                            setIsMenuOpen(!isMenuOpen);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1">
                              {isOwnPost ? (
                                <>
                                  <button
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          'Are you sure you want to delete this post?',
                                        )
                                      ) {
                                        void handleDelete();
                                      }
                                      setIsMenuOpen(false);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                  }}
                                >
                                  Report
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex space-x-2 mb-4">
                          <img
                            src={''}
                            alt={post.user_id.toString()}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <span className="font-semibold mr-2">
                              {post.user_id}
                            </span>
                            <span>{post.post_text}</span>
                          </div>
                        </div>

                        {comments.map((comment) => (
                          <div
                            key={comment.comment_id}
                            className="flex space-x-2 mb-4"
                          >
                            <img
                              src={''}
                              alt={comment.user_id.toString()}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <span className="font-semibold mr-2">
                                {comment.user_id}
                              </span>
                              <span>{comment.comment_text}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t p-4 flex-shrink-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <Heart
                            className={`w-6 h-6 cursor-pointer ${
                              post.likes.includes(
                                context?.myProfile?.user_id ?? -1,
                              )
                                ? 'fill-red-500 text-red-500'
                                : ''
                            }`}
                            onClick={() => {
                              void handleLikeToggle();
                            }}
                          />
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <p className="font-semibold mb-1">
                          {post.likes.length.toLocaleString()} likes
                        </p>
                      </div>
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
        <MobileBar />
      </div>
    </div>
  );
};

export default PostDetailPage;
