import React from 'react';

const FILTERS = [
  { id: 'normal', name: 'Normal', filter: '' },
  { id: 'grayscale', name: 'B&W', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
  { id: 'saturate', name: 'Vivid', filter: 'saturate(200%)' },
  { id: 'contrast', name: 'Contrast', filter: 'contrast(150%)' },
] as const;

interface FiltersProps {
  onFilterSelect: (filter: string) => void;
  currentFilter: string;
}

export const Filters: React.FC<FiltersProps> = ({
  onFilterSelect,
  currentFilter,
}) => {
  return (
    <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 p-4">
      {FILTERS.map(({ id, name, filter }) => (
        <button
          key={id}
          onClick={() => {
            onFilterSelect(filter);
          }}
          className={`p-2 rounded ${
            currentFilter === filter
              ? 'bg-blue-500 text-white'
              : 'bg-black/50 text-white'
          }`}
          type="button"
        >
          {name}
        </button>
      ))}
    </div>
  );
};
