export const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-pulse flex space-x-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);
