import React from 'react';

export const FILTERS = [
  { id: 'normal', name: 'Normal', filter: '' },
  { id: 'grayscale', name: 'B&W', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
  { id: 'saturate', name: 'Vivid', filter: 'saturate(200%)' },
  { id: 'contrast', name: 'Contrast', filter: 'contrast(150%)' },
  { id: 'brightness', name: 'Bright', filter: 'brightness(150%)' },
  { id: 'blur', name: 'Blur', filter: 'blur(5px)' },
  { id: 'warm', name: 'Warm', filter: 'sepia(50%) saturate(150%)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(120%)' },
] as const;

interface FiltersProps {
  onFilterSelect: (filter: string) => void;
  currentFilter: string;
  previewUrl: string;
}

export const Filters: React.FC<FiltersProps> = ({
  onFilterSelect,
  currentFilter,
  previewUrl,
}) => {
  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center">
      <div className="bg-black/50 p-4 rounded-lg overflow-x-auto max-w-full">
        <div className="flex gap-4 pb-2">
          {FILTERS.map(({ id, name, filter }) => (
            <button
              key={id}
              onClick={() => {
                onFilterSelect(filter);
              }}
              className="flex flex-col items-center min-w-[80px]"
              type="button"
            >
              <div className="w-16 h-16 rounded overflow-hidden mb-2">
                <img
                  src={previewUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  style={{ filter }}
                />
              </div>
              <span
                className={`text-xs ${currentFilter === filter ? 'text-blue-400' : 'text-white'}`}
              >
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
