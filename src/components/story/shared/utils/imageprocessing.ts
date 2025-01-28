import { STORY_CONSTANTS } from '../constants';

export const processImage = async (file: File): Promise<string> => {
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx == null) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = STORY_CONSTANTS.MAX_WIDTH;
      canvas.height = STORY_CONSTANTS.MAX_HEIGHT;

      // Calculate scaling and positioning for center fit
      const scale = Math.min(
        STORY_CONSTANTS.MAX_WIDTH / img.width,
        STORY_CONSTANTS.MAX_HEIGHT / img.height,
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (STORY_CONSTANTS.MAX_WIDTH - scaledWidth) / 2;
      const y = (STORY_CONSTANTS.MAX_HEIGHT - scaledHeight) / 2;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw blurred background by scaling the original image
      ctx.filter = 'blur(20px)';
      // Extend background beyond edges to prevent white borders during blur
      ctx.drawImage(
        img,
        -20,
        -20,
        STORY_CONSTANTS.MAX_WIDTH + 40,
        STORY_CONSTANTS.MAX_HEIGHT + 40,
      );
      ctx.filter = 'none';

      // Draw the actual image in the center
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};
