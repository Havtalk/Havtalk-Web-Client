export function CarouselSkeleton() {
  return (
    <div className='relative w-full mx-auto h-[calc(100vh-10rem)] overflow-hidden rounded-none shadow-2xl '>
      {/* Background skeleton */}
      <div className="absolute inset-0  animate-pulse"></div>
      
      {/* Main content skeleton */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16 h-full w-full gap-8 md:gap-12">
        {/* Image skeleton */}
        <div className="relative w-full h-[40vh] md:h-[80%] md:w-1/2 flex items-center justify-center">
          <div className="w-full h-full max-w-md lg:max-w-lg mx-auto bg-gray-500/60 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Text content skeleton */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 md:space-y-6 text-center md:text-left">
          {/* Creator skeleton */}
          <div className="h-4 w-24 bg-gray-500/60 rounded mx-auto md:mx-0 animate-pulse"></div>
          
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-8 md:h-12 w-3/4 bg-gray-500/60 rounded mx-auto md:mx-0 animate-pulse"></div>
            <div className="h-1 w-20 bg-gray-500/60 rounded mx-auto md:mx-0 animate-pulse"></div>
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-500/60 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-500/60 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-500/60 rounded animate-pulse"></div>
          </div>
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="h-6 w-16 bg-gray-500/60 rounded-full animate-pulse"></div>
            <div className="h-6 w-12 bg-gray-500/60 rounded-full animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-500/60 rounded-full animate-pulse"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-12 w-32 bg-gray-500/60 rounded-full mx-auto md:mx-0 animate-pulse"></div>
        </div>
      </div>
      
      {/* Navigation arrows skeleton */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-600/60 animate-pulse"></div>
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-600/60 animate-pulse"></div>
      
      {/* Indicator dots skeleton */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div 
            key={index} 
            className={`rounded-full bg-gray-500/60 animate-pulse ${index === 0 ? 'w-2.5 h-2.5' : 'w-2 h-2'}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
