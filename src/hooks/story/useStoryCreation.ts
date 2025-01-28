import { useState } from 'react';

import type { StoryMediaFile } from '../../components/story/shared/types';
import { processImage } from '../../components/story/shared/utils/imageprocessing';
import { validateStoryMedia } from '../../components/story/shared/utils/validation';
import { processVideo } from '../../components/story/shared/utils/videoprocessing';

export const useStoryCreation = () => {
  const [media, setMedia] = useState<StoryMediaFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processMedia = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      await validateStoryMedia(file);
      const isVideo = file.type.startsWith('video/');

      const processedUrl = isVideo
        ? await processVideo(file)
        : await processImage(file);

      setMedia({
        file,
        type: isVideo ? 'video' : 'image',
        preview: processedUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process media');
      setMedia(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    media,
    isProcessing,
    error,
    processMedia,
    resetMedia: () => {
      setMedia(null);
    },
  };
};
