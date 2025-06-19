export function PersonaCardSkeleton({ isSmallScreen = false }: { isSmallScreen?: boolean }) {
  return (
    <div className={`perspective-[1000px] ${isSmallScreen?"w-11/12 h-[160px] mx-auto":"w-44 h-[200px]"} m-2 group sm:w-44 sm:h-[180px] xs:w-11/12 xs:h-[160px] xs:mx-auto animate-pulse`}>
      <div className="relative w-full h-full duration-500 preserve-3d transition-transform">
        {/* Skeleton card */}
        <div className="absolute w-full h-full flex flex-col border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800">
          <div className="relative w-full h-full">
            {/* Skeleton background */}
            <div className="absolute inset-0 w-full h-full bg-gray-600"></div>
            
            {/* Skeleton gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            
            {/* Skeleton content overlay */}
            <div className="absolute bottom-0 w-full p-2 z-10">
              {/* Skeleton title */}
              <div className="h-5 w-3/4 bg-gray-600 rounded mb-2"></div>
              {/* Skeleton description lines */}
              <div className="h-3 w-full bg-gray-600 rounded mb-1"></div>
              <div className="h-3 w-2/3 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
