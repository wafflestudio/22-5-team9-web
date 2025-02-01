import { useState } from 'react';

import { editPost } from '../../api/post';
import type { Post } from '../../types/post';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onEdit: (updatedPost: Post) => void;
}

const EditPostModal = ({
  isOpen,
  onClose,
  post,
  onEdit,
}: EditPostModalProps) => {
  const [content, setContent] = useState(post.post_text !== '' || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      try {
        const updatedPost = await editPost(post.post_id, content as string);
        onEdit(updatedPost);
        alert('Post updated successfully!');
        onClose();
      } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post. Please try again.');
      }
    })();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <img
              src={`https://waffle-instaclone.kro.kr/${post.file_url[0] as string}`}
              alt="Post"
              className="max-h-[400px] mx-auto object-contain mb-4"
            />
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full resize-none"
              placeholder="Write a caption..."
              rows={4}
              value={content as string}
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
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditPostModal;
