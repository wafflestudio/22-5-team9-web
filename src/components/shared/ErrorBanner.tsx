interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm text-red-600">{message}</p>
        </div>
        <div className="flex space-x-2">
          {onRetry != null && (
            <button
              onClick={onRetry}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          )}
          {onDismiss != null && (
            <button
              onClick={onDismiss}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
