interface StoryProgressProps {
  duration: number;
  currentTime: number;
}

export function StoryProgress({ duration, currentTime }: StoryProgressProps) {
  const progress = (currentTime / duration) * 100;

  return (
    <div className="h-1 bg-black/30 rounded overflow-hidden">
      <div
        className="h-full bg-white rounded transition-all duration-100 shadow-lg"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
