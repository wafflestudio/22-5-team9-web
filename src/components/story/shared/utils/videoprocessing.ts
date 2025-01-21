import { STORY_CONSTANTS } from '../constants';

export const processVideo = async (file: File): Promise<string> => {
  // For now, just validate and return the original file URL
  // In a production environment, you'd want to use FFmpeg.js or similar
  // to process the video properly
  const video = document.createElement('video');

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      if (video.duration > STORY_CONSTANTS.MAX_VIDEO_DURATION) {
        reject(
          new Error(
            `Video must be ${STORY_CONSTANTS.MAX_VIDEO_DURATION} seconds or less`,
          ),
        );
        return;
      }
      resolve(URL.createObjectURL(file));
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
    video.src = URL.createObjectURL(file);
  });
};
