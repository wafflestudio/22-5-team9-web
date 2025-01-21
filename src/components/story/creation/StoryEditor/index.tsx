import { Image, X } from 'lucide-react';
import React, { useState } from 'react';

import { STORY_CONSTANTS } from '../../shared/constants';
import type { StoryEditorProps } from '../../shared/types';
import {
  processImage,
  processVideo,
  validateStoryMedia,
} from '../../shared/utils/index.ts';
import { Canvas } from './Canvas';
import { Controls } from './Controls';

export const StoryEditor: React.FC<StoryEditorProps> = ({
  onClose,
  onSubmit,
}) => {
  const [media, setMedia] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('draw');
  const [, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file == null) return;

    try {
      await validateStoryMedia(file);

      const processed = file.type.startsWith('image/')
        ? await processImage(file)
        : await processVideo(file);

      setMedia(processed);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process media');
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full h-full">
        {media != null ? (
          <Canvas mediaUrl={media} onCanvasReady={handleCanvasReady} />
        ) : (
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept={[
                ...STORY_CONSTANTS.SUPPORTED_IMAGE_TYPES,
                ...STORY_CONSTANTS.SUPPORTED_VIDEO_TYPES,
              ].join(',')}
              onChange={(e) => void handleFileUpload(e)}
              className="hidden"
            />
            <div className="text-white text-center">
              <Image className="w-16 h-16 mx-auto mb-2" />
              <span className="block">Upload Photo or Video</span>
              <span className="block text-sm text-gray-400 mt-2">
                Photos will be resized to 1080x1920
                <br />
                Videos must be 15 seconds or less
              </span>
            </div>
          </label>
        )}

        {media != null && (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <Controls activeTab={activeTab} onTabChange={setActiveTab} />

            <button
              onClick={() => void onSubmit(new File([media], 'story.jpg'))}
              className="absolute bottom-4 right-4 px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Share
            </button>
          </>
        )}
      </div>
    </div>
  );
};
