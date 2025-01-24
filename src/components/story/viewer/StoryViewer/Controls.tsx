import {
  Download,
  Flag,
  Heart,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onDelete?: () => Promise<void>;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isOwner: boolean;
  username: string;
  timestamp: string;
  storyId: string;
  storyUrl: string;
}

export const Controls: React.FC<ControlsProps> = ({
  onNext,
  onPrevious,
  onClose,
  onDelete,
  canGoNext,
  canGoPrevious,
  isOwner,
  username,
  timestamp,
  storyId,
  storyUrl,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${username}'s Story`,
        text: `Check out ${username}'s story on Instagram`,
        url: window.location.href,
      });
    } catch {
      // If Web Share API is not supported, show share menu
      setShowShareMenu(true);
    }
  };

  const handleReport = async () => {
    try {
      await fetch('https://waffle-instaclone.kro.kr/api/report/story', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story_id: storyId,
          reason: 'inappropriate',
        }),
      });
      setShowMenu(false);
      alert('Story reported successfully');
    } catch (error) {
      console.error('Error reporting story:', error);
      alert('Failed to report story');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(storyUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `story-${username}-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading story:', error);
      alert('Failed to download story');
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Navigation touch areas */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="absolute left-0 top-0 w-1/3 h-full opacity-0"
        aria-label="Previous story"
      />
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="absolute right-0 top-0 w-1/3 h-full opacity-0"
        aria-label="Next story"
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="/placeholder.svg"
              alt={username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-white font-semibold">{username}</span>
            <span className="text-white/70 text-sm ml-2">{timestamp}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {isOwner && onDelete != null && (
                  <button
                    onClick={() => void onDelete()}
                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                  >
                    Delete Story
                  </button>
                )}
                <button
                  onClick={() => void handleDownload()}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => void handleShare()}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                {!isOwner && (
                  <button
                    onClick={() => void handleReport()}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </button>
                )}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
            aria-label="Close story"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Share menu */}
      {showShareMenu && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4">
          <div className="flex flex-col space-y-4">
            <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
              <MessageCircle className="w-5 h-5" />
              <span>Send in Direct</span>
            </button>
            <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
              <Send className="w-5 h-5" />
              <span>Share to Feed</span>
            </button>
            <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
              <Heart className="w-5 h-5" />
              <span>Share as Story</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
