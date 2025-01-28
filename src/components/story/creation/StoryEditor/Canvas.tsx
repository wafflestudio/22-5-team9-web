import React, { useEffect, useRef, useState } from 'react';

import { STORY_CONSTANTS } from '../../shared/constants';

interface CanvasProps {
  mediaUrl: string;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ mediaUrl, onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null || isInitialized) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = STORY_CONSTANTS.MAX_WIDTH;
      canvas.height = STORY_CONSTANTS.MAX_HEIGHT;

      // Draw image maintaining aspect ratio - using Math.min for proper containment
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) * 0.5;
      const y = (canvas.height - scaledHeight) * 0.5;

      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw blurred background first
      ctx.filter = 'blur(20px)';
      ctx.drawImage(img, -20, -20, canvas.width + 40, canvas.height + 40);
      ctx.filter = 'none';

      // Draw the main image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      setIsInitialized(true);
      onCanvasReady(canvas);
    };
    img.src = mediaUrl;
  }, [mediaUrl, isInitialized, onCanvasReady]);

  return <canvas ref={canvasRef} className="max-h-full w-auto mx-auto" />;
};
