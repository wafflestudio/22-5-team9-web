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

      // Draw image maintaining aspect ratio
      const scale = Math.max(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      const x = (canvas.width - img.width * scale) * 0.5;
      const y = (canvas.height - img.height * scale) * 0.5;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      setIsInitialized(true);
      onCanvasReady(canvas);
    };
    img.src = mediaUrl;
  }, [mediaUrl, isInitialized, onCanvasReady]);

  return <canvas ref={canvasRef} className="max-h-full w-auto mx-auto" />;
};
