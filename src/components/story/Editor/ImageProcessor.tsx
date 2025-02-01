import { useEffect, useRef, useState } from 'react';

type Color = {
  r: number;
  g: number;
  b: number;
};

const ImageProcessor = ({
  file,
  onProcessed,
}: {
  file: File | null;
  onProcessed: (blob: Blob) => void;
}) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const canvasRef = useRef(null);

  const TARGET_WIDTH = 1080;
  const TARGET_HEIGHT = 1920;
  const TARGET_RATIO = TARGET_HEIGHT / TARGET_WIDTH;

  const extractColors = (
    ctx: CanvasRenderingContext2D | null,
    width: number,
    height: number,
  ): [Color, Color] => {
    if (ctx == null)
      return [
        { r: 0, g: 0, b: 0 },
        { r: 0, g: 0, b: 0 },
      ];
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const colors: Color[] = [];

    // Sample pixels at regular intervals
    const sampleSize = Math.floor(imageData.length / 1000);
    for (let i = 0; i < imageData.length; i += sampleSize * 4) {
      const r = imageData[i] ?? 0;
      const g = imageData[i + 1] ?? 0;
      const b = imageData[i + 2] ?? 0;
      colors.push({ r, g, b });
    }

    // Get average color for muted background
    const avg: Color = colors.reduce(
      (acc, color) => ({
        r: acc.r + color.r / colors.length,
        g: acc.g + color.g / colors.length,
        b: acc.b + color.b / colors.length,
      }),
      { r: 0, g: 0, b: 0 },
    );

    // Create slightly varied second color for gradient
    const secondColor: Color = {
      r: Math.min(255, avg.r * 0.8),
      g: Math.min(255, avg.g * 0.8),
      b: Math.min(255, avg.b * 0.8),
    };

    return [avg, secondColor];
  };

  useEffect(() => {
    const processImage = async (imageFile: Blob | MediaSource) => {
      if (hasProcessed) return;
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current as HTMLCanvasElement | null;
      if (canvas == null) return;
      const ctx = canvas.getContext('2d');
      if (ctx == null) return;

      // Set canvas to target dimensions
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;

      // Extract colors from original image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx == null) return;
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
      const [color1, color2] = extractColors(tempCtx, img.width, img.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, TARGET_HEIGHT);
      gradient.addColorStop(
        0,
        `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.8)`,
      );
      gradient.addColorStop(
        1,
        `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.8)`,
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // Calculate dimensions to maintain aspect ratio
      let drawWidth = TARGET_WIDTH;
      let drawHeight = TARGET_HEIGHT;
      const imageRatio = img.height / img.width;

      if (imageRatio > TARGET_RATIO) {
        drawWidth = TARGET_HEIGHT / imageRatio;
        drawHeight = TARGET_HEIGHT;
      } else {
        drawWidth = TARGET_WIDTH;
        drawHeight = TARGET_WIDTH * imageRatio;
      }

      // Center the image
      const x = (TARGET_WIDTH - drawWidth) / 2;
      const y = (TARGET_HEIGHT - drawHeight) / 2;

      // Draw the image centered
      ctx.drawImage(img, x, y, drawWidth, drawHeight);

      // Convert to blob and create URL
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
      });
      if (blob == null) return;
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImage(processedUrl);
      setHasProcessed(true);
      onProcessed(blob);
    };
    if (file != null && !hasProcessed) {
      void processImage(file);
    }
  }, [TARGET_RATIO, file, hasProcessed, onProcessed, processedImage]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <canvas ref={canvasRef} className="hidden" />
      {processedImage != null && (
        <img
          src={processedImage}
          alt="Processed story"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default ImageProcessor;
