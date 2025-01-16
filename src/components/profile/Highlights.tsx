import { Plus } from 'lucide-react';
import React, { useState } from 'react';

interface HighlightItemProps {
  id: string;
  name: string;
  coverImage?: string;
  onClick: () => void;
  isOwner: boolean;
}

const HighlightItem = ({ name, coverImage, onClick, isOwner }: HighlightItemProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center space-y-1 cursor-pointer"
  >
    <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center">
      {(coverImage != null) ? (
        <img src={coverImage} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {isOwner && <Plus className="w-6 h-6 text-gray-400" />}
        </div>
      )}
    </div>
    <span className="text-xs text-gray-900 truncate w-20 text-center">{name}</span>
  </button>
);

interface HighlightsProps {
  userId: number;
  isOwner: boolean;
}

const Highlights: React.FC<HighlightsProps> = ({ isOwner }) => {
  const [highlights] = useState([
    { id: '1', name: 'Travel', coverImage: 'https://placehold.co/32x32' },
    { id: '2', name: 'Food', coverImage: 'https://placehold.co/32x32' },
    { id: '3', name: 'Pets', coverImage: 'https://placehold.co/32x32' },
  ]);

  const handleHighlightClick = (id: string) => {
    // Here you would typically open a modal or navigate to the highlight viewer
    console.log('Opening highlight:', id);
  };

  const handleAddHighlight = () => {
    // Here you would typically open a modal to create a new highlight
    console.log('Adding new highlight');
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
      {isOwner && (
        <HighlightItem
          id="new"
          name="New"
          onClick={handleAddHighlight}
          isOwner={true}
        />
      )}
      {highlights.map((highlight) => (
        <HighlightItem
          key={highlight.id}
          {...highlight}
          onClick={() => { handleHighlightClick(highlight.id); }}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
};

export default Highlights;