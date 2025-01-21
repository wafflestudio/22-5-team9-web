import { STORY_CONSTANTS } from '../constants';

export const validateStoryMedia = async (file: File): Promise<void> => {
  if (
    !STORY_CONSTANTS.SUPPORTED_IMAGE_TYPES.includes(file.type) &&
    !STORY_CONSTANTS.SUPPORTED_VIDEO_TYPES.includes(file.type)
  ) {
    throw new Error('Unsupported file type');
  }

  if (file.size > STORY_CONSTANTS.MAX_FILE_SIZE) {
    throw new Error('File size too large');
  }

  if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        if (video.duration > STORY_CONSTANTS.MAX_VIDEO_DURATION) {
          reject(
            new Error(
              `Video must be ${STORY_CONSTANTS.MAX_VIDEO_DURATION} seconds or less`,
            ),
          );
        }
        resolve();
      };
      video.onerror = () => {
        reject(new Error('Invalid video file'));
      };
      video.src = URL.createObjectURL(file);
    });
  }
};
