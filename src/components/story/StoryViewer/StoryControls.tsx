import { ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';

interface StoryControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onDelete?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isOwner: boolean;
}

export default function StoryControls({
  onNext,
  onPrevious,
  onClose,
  onDelete,
  canGoNext,
  canGoPrevious,
  isOwner,
}: StoryControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full">
        <button
          onClick={onPrevious}
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 pointer-events-auto transition-opacity
            ${canGoPrevious ? 'opacity-75 hover:opacity-100' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canGoPrevious}
          type="button"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={onNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 pointer-events-auto transition-opacity
            ${canGoNext ? 'opacity-75 hover:opacity-100' : 'opacity-30 cursor-not-allowed'}`}
          disabled={!canGoNext}
          type="button"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 pointer-events-auto opacity-75 hover:opacity-100 transition-opacity"
          type="button"
          aria-label="Close story"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {isOwner && (onDelete != null) && (
          <button
            onClick={onDelete}
            className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-red-500 pointer-events-auto opacity-75 hover:opacity-100 transition-opacity"
            type="button"
            aria-label="Delete story"
          >
            <Trash2 className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
