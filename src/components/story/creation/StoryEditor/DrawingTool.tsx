import React, { useEffect, useRef, useState } from 'react';

interface DrawingToolProps {
  onDrawingComplete: (canvas: HTMLCanvasElement) => void;
  width: number;
  height: number;
}

export const DrawingTool: React.FC<DrawingToolProps> = ({
  onDrawingComplete,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(5);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    // Set up canvas
    canvas.width = width;
    canvas.height = height;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getEventPosition(e);
    lastPos.current = pos;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) return;

    const pos = getEventPosition(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current != null) {
      onDrawingComplete(canvasRef.current);
    }
  };

  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (canvas == null) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x =
      (e as React.TouchEvent).touches[0]?.clientX ??
      (e as React.MouseEvent).clientX - rect.left;
    const y =
      (e as React.TouchEvent).touches[0]?.clientY ??
      (e as React.MouseEvent).clientY - rect.top;

    return {
      x: (x * canvas.width) / rect.width,
      y: (y * canvas.height) / rect.height,
    };
  };

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 p-4 rounded-lg flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          className="w-10 h-10 rounded cursor-pointer"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => {
            setLineWidth(Number(e.target.value));
          }}
          className="w-32"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-white"
          style={{ backgroundColor: color }}
        >
          <div
            className="w-full h-full rounded-full bg-current"
            style={{ transform: `scale(${lineWidth / 20})` }}
          />
        </div>
      </div>
    </div>
  );
};
