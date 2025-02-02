import { useNavigate } from 'react-router-dom';

interface StoryUserInfoProps {
  username: string;
  profileImage?: string;
  creationDate: string;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString + 'Z');
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
};

const StoryUserInfo = ({
  username,
  profileImage,
  creationDate
}: StoryUserInfoProps) => {
  const navigate = useNavigate();
  const handleUsernameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void navigate(`/${username}`);
  };
  return (
    <div className="absolute top-2 left-0 right-0 z-20">
      <div className="flex items-center space-x-3 px-4 py-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
          <img
            src={profileImage}
            alt={username}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = '/default-profile.svg';
            }}
          />
        </div>
        <div className="flex items-center space-x-2">
        <button
            onClick={handleUsernameClick}
            className="text-white font-semibold text-sm hover:underline focus:outline-none"
          >
            {username}
          </button>
          <span className="text-gray-300 text-xs">
            {formatTimeAgo(creationDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryUserInfo;
