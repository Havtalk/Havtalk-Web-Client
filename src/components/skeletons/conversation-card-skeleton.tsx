export const ConversationSkeleton = () => (
  <div className="h-full flex flex-col justify-between bg-gray-800 rounded-2xl p-4 animate-pulse">
    <div className="flex items-center mb-3">
      <div className="h-12 w-12 rounded-full bg-gray-600 mr-3 flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <div className="h-5 w-3/4 bg-gray-600 rounded mb-1"></div>
        <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
      </div>
    </div>
    <div className="flex-1 mb-4">
      <div className="h-4 w-full bg-gray-600 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-600 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-600 rounded"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-3 w-16 bg-gray-600 rounded"></div>
      <div className="h-4 w-20 bg-gray-600 rounded"></div>
    </div>
  </div>
);