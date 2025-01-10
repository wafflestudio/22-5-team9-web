interface StoryControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  onDelete?: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isOwner: boolean;
}

export function StoryControls({
  onNext,
  onPrevious,
  onClose,
  onDelete,
  canGoNext,
  canGoPrevious,
  isOwner,
}: StoryControlsProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full"
        disabled={!canGoPrevious}
        type="button"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 p-2 rounded-full"
        disabled={!canGoNext}
        type="button"
      >
        Next
      </button>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full"
        type="button"
      >
        Close
      </button>
      {isOwner && onDelete != null && (
        <button
          onClick={onDelete}
          className="absolute bottom-4 right-4 text-white bg-red-500 px-4 py-2 rounded"
          type="button"
        >
          Delete
        </button>
      )}
    </>
  );
}
