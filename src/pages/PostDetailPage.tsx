import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchComments, fetchPost } from '../api/post';
import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import type { Comment, Post } from '../types/post';

const PostDetailPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

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
                    <div className="p-4 border-b flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <img
                          src={''}
                          alt={post.user_id.toString()}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-semibold">{post.user_id}</span>
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
                          <button>
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                          <button>
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="font-semibold mb-1">{0} likes</p>
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
