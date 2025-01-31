import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ImageProcessor from './ImageProcessor';

const StoryEditor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { file: File };

  const handleProcessed = (processedBlob: Blob): void => {
    void (async () => {
      setIsProcessing(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('files', processedBlob, 'story.jpg');

        const response = await fetch('https://waffle-instaclone.kro.kr/api/story/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload story');
        }

        void navigate('/', { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsProcessing(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Story</h1>
        
        <ImageProcessor 
          file={state.file} 
          onProcessed={handleProcessed}
        />

        {isProcessing && (
          <div className="mt-4 text-center text-gray-600">
            Processing and uploading your story...
          </div>
        )}

        {(error != null) && (
          <div className="mt-4 text-center text-red-500">
            {error}
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => void navigate('/')}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {}} // This will be handled by ImageProcessor
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Share Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;