import { Image, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

import { STORY_CONSTANTS } from '../../shared/constants';
import type { StoryEditorProps } from '../../shared/types';
import {
  processImage,
  processVideo,
  validateStoryMedia,
} from '../../shared/utils';
import { CanvasManager } from './CanvasManager';
import { Controls } from './Controls';
import { DrawingTool } from './DrawingTool';
import { Filters } from './Filters';
import { TextEditor } from './TextEditor';

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  style: {
    fontSize: number;
    color: string;
    backgroundColor: string | null;
    fontFamily: string;
  };
}

interface MediaState {
  url: string;
  type: 'image' | 'video';
  file: File;
  videoElement?: HTMLVideoElement;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({
  onClose,
  onSubmit,
}) => {
  const [media, setMedia] = useState<MediaState | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [currentFilter, setCurrentFilter] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasManagerRef = useRef<CanvasManager | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [drawingLayer, setDrawingLayer] = useState<HTMLCanvasElement | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file == null) return;

    try {
      setIsProcessing(true);
      await validateStoryMedia(file);
      const isVideo = file.type.startsWith('video/');

      const processed = isVideo
        ? await processVideo(file)
        : await processImage(file);

      if (isVideo) {
        const videoElement = document.createElement('video');
        videoElement.src = processed;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsInline = true;

        // Wait for video to be loaded
        await new Promise<void>((resolve) => {
          videoElement.onloadedmetadata = () => {
            resolve();
          };
          videoElement.load();
        });

        setMedia({
          url: processed,
          type: 'video',
          file,
          videoElement,
        });
      } else {
        // Handle image
        const img = document.createElement('img');
        img.onload = () => {
          if (canvasRef.current != null) {
            canvasManagerRef.current = new CanvasManager(canvasRef.current);
            canvasManagerRef.current.drawImage(img);
          }
        };
        img.src = processed;
        setMedia({
          url: processed,
          type: 'image',
          file,
        });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process media');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextAdd = (
    text: string,
    style: TextLayer['style'],
    x: number,
    y: number,
  ) => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      text,
      x,
      y,
      style,
    };
    setTextLayers([...textLayers, newLayer]);
  };

  const handleTextUpdate = (
    id: string,
    text: string,
    style: TextLayer['style'],
    x: number,
    y: number,
  ) => {
    setTextLayers((layers) =>
      layers.map((layer) =>
        layer.id === id ? { ...layer, text, style, x, y } : layer,
      ),
    );
  };

  const handleTextDelete = (id: string) => {
    setTextLayers((layers) => layers.filter((layer) => layer.id !== id));
  };

  const handleDrawingComplete = (drawingCanvas: HTMLCanvasElement) => {
    setDrawingLayer(drawingCanvas);
  };

  const createFinalCanvas = async () => {
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = STORY_CONSTANTS.MAX_WIDTH;
    finalCanvas.height = STORY_CONSTANTS.MAX_HEIGHT;
    const ctx = finalCanvas.getContext('2d');
    if (ctx == null) throw new Error('Could not get canvas context');

    // Apply filter globally if any
    ctx.filter = currentFilter;

    if (media?.type === 'video' && media.videoElement != null) {
      // Set up MediaRecorder for video
      const stream = finalCanvas.captureStream();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      return new Promise<File>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(new File([blob], 'story.webm', { type: 'video/webm' }));
        };

        // Start recording and processing frames
        mediaRecorder.start();

        const processFrame = () => {
          // Draw current video frame
          if (media.videoElement != null) {
            ctx.drawImage(
              media.videoElement,
              0,
              0,
              finalCanvas.width,
              finalCanvas.height,
            );
          }

          // Draw drawing layer if exists
          if (drawingLayer != null) {
            ctx.globalAlpha = 0.8;
            ctx.drawImage(drawingLayer, 0, 0);
            ctx.globalAlpha = 1;
          }

          // Draw text layers
          textLayers.forEach((layer) => {
            ctx.font = `${layer.style.fontSize}px ${layer.style.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (layer.style.backgroundColor != null) {
              const metrics = ctx.measureText(layer.text);
              const padding = 5;
              ctx.fillStyle = layer.style.backgroundColor;
              ctx.fillRect(
                layer.x - metrics.width / 2 - padding,
                layer.y - layer.style.fontSize / 2 - padding,
                metrics.width + padding * 2,
                layer.style.fontSize + padding * 2,
              );
            }

            ctx.fillStyle = layer.style.color;
            ctx.fillText(layer.text, layer.x, layer.y);
          });

          if (
            media.videoElement?.paused === false &&
            !media.videoElement.ended
          ) {
            requestAnimationFrame(processFrame);
          } else {
            mediaRecorder.stop();
          }
        };

        // Start playback and processing
        void media.videoElement?.play().then(() => {
          processFrame();
        });
      });
    } else {
      // For images, draw once
      if (canvasRef.current != null) {
        ctx.drawImage(canvasRef.current, 0, 0);
      }

      if (drawingLayer != null) {
        ctx.globalAlpha = 0.8;
        ctx.drawImage(drawingLayer, 0, 0);
        ctx.globalAlpha = 1;
      }

      textLayers.forEach((layer) => {
        ctx.font = `${layer.style.fontSize}px ${layer.style.fontFamily}`;
        ctx.fillStyle = layer.style.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (layer.style.backgroundColor != null) {
          const metrics = ctx.measureText(layer.text);
          const padding = 5;
          ctx.fillStyle = layer.style.backgroundColor;
          ctx.fillRect(
            layer.x - metrics.width / 2 - padding,
            layer.y - layer.style.fontSize / 2 - padding,
            metrics.width + padding * 2,
            layer.style.fontSize + padding * 2,
          );
        }

        ctx.fillStyle = layer.style.color;
        ctx.fillText(layer.text, layer.x, layer.y);
      });

      return new Promise<File>((resolve) => {
        finalCanvas.toBlob(
          (blob) => {
            if (blob != null) {
              resolve(new File([blob], 'story.jpg', { type: 'image/jpeg' }));
            }
          },
          'image/jpeg',
          0.9,
        );
      });
    }
  };

  const handleShare = async () => {
    if (media == null) return;

    try {
      setIsProcessing(true);
      const finalFile = await createFinalCanvas();
      await onSubmit(finalFile);
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    if (canvasRef.current != null) {
      canvasRef.current.style.filter = filter;
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="relative w-full h-full">
        {media != null ? (
          <>
            {media.type === 'video' ? (
              <video
                src={media.url}
                className="max-h-full w-auto mx-auto"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className="max-h-full w-auto mx-auto"
                  style={{ filter: currentFilter }}
                />
                {activeTab === 'draw' && (
                  <DrawingTool
                    onDrawingComplete={handleDrawingComplete}
                    width={STORY_CONSTANTS.MAX_WIDTH}
                    height={STORY_CONSTANTS.MAX_HEIGHT}
                  />
                )}
                {activeTab === 'text' && (
                  <TextEditor
                    onTextAdd={handleTextAdd}
                    onTextUpdate={handleTextUpdate}
                    onTextDelete={handleTextDelete}
                    layers={textLayers}
                  />
                )}
                {activeTab === 'filters' && (
                  <Filters
                    onFilterSelect={handleFilterChange}
                    currentFilter={currentFilter}
                    previewUrl={media.url}
                  />
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <Controls activeTab={activeTab} onTabChange={setActiveTab} />

            <button
              onClick={() => void handleShare()}
              disabled={isProcessing}
              className={`absolute bottom-4 right-4 px-6 py-2 bg-blue-500 text-white rounded-full ${
                isProcessing ? 'opacity-50' : ''
              }`}
            >
              {isProcessing ? 'Processing...' : 'Share'}
            </button>
          </>
        ) : (
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept={[
                ...STORY_CONSTANTS.SUPPORTED_IMAGE_TYPES,
                ...STORY_CONSTANTS.SUPPORTED_VIDEO_TYPES,
              ].join(',')}
              onChange={(e) => void handleFileUpload(e)}
              className="hidden"
              disabled={isProcessing}
            />
            <div className="text-white text-center">
              <Image className="w-16 h-16 mx-auto mb-2" />
              <span className="block">
                {isProcessing ? 'Processing...' : 'Upload Photo or Video'}
              </span>
              <span className="block text-sm text-gray-400 mt-2">
                Share your story with your followers
              </span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};
