import { CirclePlus } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStoryUpload } from '../../hooks/useStoryUpload';

export function StoryCreator() {
  const navigate = useNavigate();
  const { isUploading } = useStoryUpload();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files == null) return;

      if (files[0] != null) {
        void navigate('/stories/new', {
          state: { file: files[0] },
        });
      }
    },
    [navigate],
  );

  return (
    <div className="flex flex-col items-center">
      <label className="relative cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <CirclePlus className="w-8 h-8 text-blue-500" />
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      <p className="mt-1 text-xs">Create Story</p>
    </div>
  );
}
