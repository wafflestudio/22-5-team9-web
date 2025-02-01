import { Flag, MoreHorizontal, Share2, User } from 'lucide-react';
import { useState } from 'react';

interface UserHeaderProps {
  username: string;
  profileImage: string;
  timestamp: string;
  isOwner: boolean;
  onDelete?: () => Promise<void>;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  username,
  profileImage,
  timestamp,
  isOwner,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
      setShowOptions(false);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleViewProfile = () => {
    window.location.href = `/${username}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
      <button
        onClick={handleViewProfile}
        className="flex items-center group hover:opacity-80 transition-opacity"
      >
        {profileImage.length > 0 ? (
          <img
            src={profileImage}
            alt={username}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
        )}
        <div className="ml-2">
          <span className="text-white font-semibold group-hover:underline">
            {username}
          </span>
          <span className="ml-2 text-white/70 text-sm">{timestamp}</span>
        </div>
      </button>

      <div className="relative">
        <button
          onClick={() => {
            setShowOptions(!showOptions);
          }}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          type="button"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            {isOwner ? (
              <>
                {onDelete != null && (
                  <button
                    onClick={() => {
                      onDelete()
                        .then(() => {
                          setShowOptions(false);
                        })
                        .catch((error: unknown) => {
                          console.error(error);
                        });
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    type="button"
                  >
                    Delete Story
                  </button>
                )}
                <button
                  onClick={() => {
                    void handleCopyLink();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  type="button"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Link
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleViewProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  type="button"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    void handleCopyLink();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  type="button"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    // Report functionality would go here
                    alert('Report functionality not implemented');
                    setShowOptions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  type="button"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
