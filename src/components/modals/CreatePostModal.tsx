import { useContext, useEffect, useState } from 'react';

import { createPost } from '../../api/post';
import { LoginContext } from '../../App';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const context = useContext(LoginContext);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file != null) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile == null) return;

    void (async () => {
      try {
        const createdPost = await createPost(selectedFile, content);
        if (context != null && context.myProfile != null) {
          context.setMyProfile({
            ...context.myProfile,
            post_ids: [...context.myProfile.post_ids, createdPost.post_id],
            post_count: context.myProfile.post_count + 1,
          });
        }
        alert('Post created successfully!');
        onClose();
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    })();
  };

  useEffect(() => {
    return () => {
      if (previewUrl != null) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {previewUrl != null ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[400px] mx-auto object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <div className="text-gray-500">
                          <svg
                            className="mx-auto h-12 w-12 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Click to upload image
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  id="content"
                  className="border border-gray-300 rounded-md p-2 w-full resize-none"
                  placeholder="Write a caption..."
                  rows={4}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 text-gray-800 rounded-md px-4 py-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-2"
                  disabled={selectedFile == null}
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
