import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import { useStoryCreation } from '../../../hooks/story/useStoryCreation';
import { useStoryUpload } from '../../../hooks/story/useStoryUpload';
import { StoryEditor } from './StoryEditor';

interface StoryCreatorProps {
  onFileSelect: (file: File) => Promise<void>;
}

export function StoryCreator({ onFileSelect }: StoryCreatorProps) {
  const [showEditor, setShowEditor] = useState(false);
  const { isUploading, uploadStory } = useStoryUpload();
  const { processMedia } = useStoryCreation();

  const handleStorySubmit = async (file: File) => {
    try {
      // First process the media file
      await processMedia(file);

      // Create a FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fileList = dataTransfer.files;

      // Upload the processed story
      await uploadStory(fileList);
      setShowEditor(false);

      // Trigger the file select callback
      await onFileSelect(file);

      window.location.reload();
    } catch (error) {
      console.error('Error uploading story:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload story');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <button
          onClick={() => {
            setShowEditor(true);
          }}
          className="relative cursor-pointer"
          disabled={isUploading}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <CirclePlus className="w-8 h-8 text-blue-500" />
          </div>
          <p className="mt-1 text-xs">Create Story</p>
        </button>
      </div>

      {showEditor && (
        <StoryEditor
          onClose={() => {
            setShowEditor(false);
          }}
          onSubmit={handleStorySubmit}
        />
      )}
    </>
  );
}
