import type { Story } from '../../../types/story';

interface StoryItemProps {
  username: string;
  profileImage?: string;
  stories: Story[];
  onView: () => void;
}

export function StoryItem({
  username,
  profileImage,
  stories,
  onView,
}: StoryItemProps) {
  const hasActiveStory = stories.length > 0;

  const handleClick = () => {
    if (hasActiveStory) {
      onView();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center ${hasActiveStory ? 'cursor-pointer' : 'cursor-default'}`}
      type="button"
      disabled={!hasActiveStory}
    >
      <div
        className={`w-16 h-16 rounded-full p-0.5 ${
          hasActiveStory
            ? 'bg-gradient-to-tr from-yellow-400 to-pink-600'
            : 'bg-gray-200'
        }`}
      >
        <div className="w-full h-full rounded-full bg-white p-0.5">
          <img
            src={profileImage ?? '/placeholder.svg'}
            alt={username}
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
      <p className="mt-1 text-xs">{username}</p>
    </button>
  );
}
