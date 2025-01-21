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

      let width = Math.min(img.width, STORY_CONSTANTS.MAX_WIDTH);
      let height = width * STORY_CONSTANTS.ASPECT_RATIO;

      if (height > STORY_CONSTANTS.MAX_HEIGHT) {
        height = STORY_CONSTANTS.MAX_HEIGHT;
        width = height / STORY_CONSTANTS.ASPECT_RATIO;
      }

      canvas.width = width;
      canvas.height = height;

      // Center the image
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width - img.width * scale) * 0.5;
      const y = (height - img.height * scale) * 0.5;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};
