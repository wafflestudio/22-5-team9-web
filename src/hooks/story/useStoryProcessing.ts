import { useState } from 'react';

import type { StoryMediaFile } from '../../components/story/shared/types';
import {
  processImage,
  processVideo,
} from '../../components/story/shared/utils';

export const useStoryProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processMedia = async (file: File): Promise<StoryMediaFile | null> => {
    setProcessing(true);
    setError(null);

    try {
      const isVideo = file.type.startsWith('video/');
      const processed = isVideo
        ? await processVideo(file)
        : await processImage(file);

      return {
        file,
        type: isVideo ? 'video' : 'image',
        preview: processed,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process media');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    error,
    processMedia,
  };
};
