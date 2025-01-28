interface ProgressProps {
  duration: number;
  currentTime: number;
  total: number;
  current: number;
}

export const Progress: React.FC<ProgressProps> = ({
  duration,
  currentTime,
  total,
  current,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-2 flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
          {i === current && (
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          )}
          {i < current && <div className="h-full bg-white w-full" />}
        </div>
      ))}
    </div>
  );
};
