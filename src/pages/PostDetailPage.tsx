import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MobileBar from '../components/layout/MobileBar';
import MobileHeader from '../components/layout/MobileHeader';
import SideBar from '../components/layout/SideBar';
import type { Post } from '../types/post';

const PostDetailPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://waffle-instaclone.kro.kr/api/post/${postId as string}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token') as string}`,
            },
          },
        );
        const data = (await response.json()) as Post;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();
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
                  {/* Left side - Image */}
                  <div className="md:w-[60%] bg-black flex items-center justify-center h-full">
                    <img
                      src={`https://waffle-instaclone.kro.kr/${post.file_url[0] as string}`}
                      alt="Post"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Right side - Post details and comments */}
                  <div className="md:w-[40%] border-l flex flex-col h-full">
                    {/* Post header */}
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

                    {/* Comments section */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex-1 overflow-y-auto p-4">
                        {/* Original post caption */}
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

                        {/* Comments */}
                        {/* {post.comments?.map((comment) => (
                        <div key={comment.id} className="flex space-x-2 mb-4">
                          <img
                            src={comment.user.profile_image}
                            alt={comment.user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <span className="font-semibold mr-2">{comment.user.username}</span>
                            <span>{comment.content}</span>
                          </div>
                        </div>
                      ))} */}
                      </div>

                      {/* Post actions */}
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
        <SideBar />
        <MobileBar />
      </div>
    </div>
  );
};

export default PostDetailPage;
