import { ChevronLeft, ChevronRight, MoreVertical,X } from 'lucide-react';
import { useEffect,useState } from 'react';

interface StoryViewerProps {
  stories: Array<{
    story_id: number;
    file_url: string[];
    creation_date: string;
    user_id: number;
    username: string;
    profileImage: string;
  }>;
  onClose: () => void;
  onDelete?: (storyId: number) => Promise<void>;
  isOwner?: boolean;
}

const StoryViewer = ({ stories, onClose, onDelete, isOwner = false }: StoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000;
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= STORY_DURATION) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex((index) => index + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + 100;
      });
    }, 100);

    return () => { clearInterval(timer); };
  }, [currentStoryIndex, stories.length, onClose, isPaused]);

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const currentStory = stories[currentStoryIndex];
  if (currentStory == null) return null;

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `http://3.34.185.81:8000/${url.replace(/^\/+/, '')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg h-full max-h-screen">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2 flex space-x-1">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: `${index === currentStoryIndex ? (progress / STORY_DURATION) * 100 : index < currentStoryIndex ? '100' : '0'}%`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center">
          <div className="flex items-center flex-1">
            <img
              src={currentStory.profileImage}
              alt={currentStory.username}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="ml-2 text-white font-semibold">{currentStory.username}</span>
            <span className="ml-2 text-gray-300 text-sm">
              {new Date(currentStory.creation_date).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isOwner && (
              <button
                onClick={() => {
                  setIsPaused(true);
                  if (onDelete != null) void onDelete(currentStory.story_id);
                }}
                className="text-white hover:text-gray-300"
              >
                <MoreVertical className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          className="h-full"
          onMouseDown={() => { setIsPaused(true); }}
          onMouseUp={() => { setIsPaused(false); }}
          onMouseLeave={() => { setIsPaused(false); }}
          onTouchStart={() => { setIsPaused(true); }}
          onTouchEnd={() => { setIsPaused(false); }}
        >
          <img
            src={(currentStory.file_url[0] != null) ? getFullImageUrl(currentStory.file_url[0]) : ''}
            alt={`Story ${currentStory.story_id}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white ${
            currentStoryIndex === 0 ? 'invisible' : ''
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white ${
            currentStoryIndex === stories.length - 1 ? 'invisible' : ''
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;