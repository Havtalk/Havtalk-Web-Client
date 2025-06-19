export function CharacterCardSkeleton({ isSmallScreen = false }: { isSmallScreen?: boolean }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden flex flex-col items-center justify-center w-fit h-fit ${isSmallScreen ? 'min-w-36' : 'min-w-40'} animate-pulse`}>
      <div className={`relative md:w-56 md:h-72 sm:h-60 sm:w-52 ${isSmallScreen?'w-36':'w-40'} shadow-lg rounded-lg overflow-hidden min-h-60 aspect-[3/4] bg-gray-700`}>
        {/* Skeleton image */}
        <div className="absolute inset-0 w-full h-full bg-gray-600 rounded-lg"></div>
      </div>
      
      {/* Skeleton overlay */}
      <div className='absolute bg-gradient-to-b from-transparent via-black/30 to-black/80 h-full w-full top-0 left-0 flex items-end justify-center rounded-xl'>
        <div className='p-2 flex flex-col items-start w-full max-w-full'>
          {/* Skeleton badge */}
          <div className='h-5 w-20 bg-gray-600 rounded-full mb-2'></div>
          {/* Skeleton title */}
          <div className='h-6 w-3/4 bg-gray-600 rounded mb-2'></div>
          {/* Skeleton description */}
          <div className='h-4 w-full bg-gray-600 rounded mb-1'></div>
          <div className='h-4 w-2/3 bg-gray-600 rounded mb-2'></div>
          {/* Skeleton tags */}
          <div className='flex gap-1 w-full'>
            <div className='h-4 w-12 bg-gray-600 rounded-full'></div>
            <div className='h-4 w-10 bg-gray-600 rounded-full'></div>
            <div className='h-4 w-16 bg-gray-600 rounded-full'></div>
          </div>
        </div>
      </div>
      
      {/* Skeleton heart */}
      <div className='absolute top-2 right-2 h-7 w-7 bg-gray-600 rounded-full'></div>
    </div>
  );
}