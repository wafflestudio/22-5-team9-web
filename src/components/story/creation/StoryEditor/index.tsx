import { Image, X } from 'lucide-react';
import React, { useState } from 'react';

import { STORY_CONSTANTS } from '../../shared/constants';
import type { StoryEditorProps } from '../../shared/types';
import {
  processImage,
  processVideo,
  validateStoryMedia,
} from '../../shared/utils';
import { Canvas } from './Canvas';
import { Controls } from './Controls';
import { Filters } from './Filters';
import { TextEditor } from './TextEditor';

interface MediaState {
  url: string;
  type: 'image' | 'video';
  file: File;
}

interface TextStyle {
	fontSize: number;
	fontFamily: string;
	color: string;
	backgroundColor?: string;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({
  onClose,
  onSubmit,
}) => {
  const [media, setMedia] = useState<MediaState | null>(null);
  const [activeTab, setActiveTab] = useState('draw');
  const [currentFilter, setCurrentFilter] = useState('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleCanvasReady = (canvasElement: HTMLCanvasElement) => {
    setCanvas(canvasElement);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file == null) return;

    try {
      await validateStoryMedia(file);
      const isVideo = file.type.startsWith('video/');

      const processed = isVideo
        ? await processVideo(file)
        : await processImage(file);

      setMedia({
        url: processed,
        type: isVideo ? 'video' : 'image',
        file
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process media');
    }
  };

  const handleTextAdd = (text: string, style: TextStyle) => {
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    // Save the current canvas state
    ctx.save();

    // Apply text styles
    ctx.font = `${style.fontSize}px ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textAlign = 'center';
    
    // Add background if specified
    if (style.backgroundColor != null) {
      const metrics = ctx.measureText(text);
      const padding = 5;
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(
        canvas.width / 2 - metrics.width / 2 - padding,
        canvas.height / 2 - style.fontSize / 2 - padding,
        metrics.width + padding * 2,
        style.fontSize + padding * 2
      );
    }

    // Draw text
    ctx.fillStyle = style.color;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Restore canvas state
    ctx.restore();
  };

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    if (canvas == null) return;
    canvas.style.filter = filter;
  };

  const handleShare = async () => {
    if (media == null) return;

    try {
      if (media.type === 'video') {
        // For videos, submit the original processed file
        await onSubmit(media.file);
      } else {
        // For images, get the canvas with applied filters and text
        if (canvas == null) return;

        // Create a new canvas to apply filters permanently
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        const ctx = finalCanvas.getContext('2d');
        if (ctx == null) return;

        // Draw the filtered image
        ctx.filter = currentFilter;
        ctx.drawImage(canvas, 0, 0);

        // Convert to blob and submit
        const blob = await new Promise<Blob | null>(resolve => 
          { finalCanvas.toBlob(resolve, 'image/jpeg', 0.9); }
        );
        
        if (blob != null) {
          await onSubmit(new File([blob], 'story.jpg', { type: 'image/jpeg' }));
        }
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
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
              <Canvas mediaUrl={media.url} onCanvasReady={handleCanvasReady} />
            )}
            
            {activeTab === 'text' && media.type === 'image' && (
              <TextEditor onTextAdd={handleTextAdd} />
            )}
            {activeTab === 'filters' && media.type === 'image' && (
              <Filters
                onFilterSelect={handleFilterChange}
                currentFilter={currentFilter}
              />
            )}
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
            />
            <div className="text-white text-center">
              <Image className="w-16 h-16 mx-auto mb-2" />
              <span className="block">Upload Photo or Video</span>
              <span className="block text-sm text-gray-400 mt-2">
                Photos will be resized to 1080x1920
                <br />
                Videos must be 15 seconds or less
              </span>
            </div>
          </label>
        )}

        {media != null && (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <Controls activeTab={activeTab} onTabChange={setActiveTab} />

            <button
              onClick={() => void handleShare()}
              className="absolute bottom-4 right-4 px-6 py-2 bg-blue-500 text-white rounded-full"
            >
              Share
            </button>
          </>
        )}
      </div>
    </div>
  );
};