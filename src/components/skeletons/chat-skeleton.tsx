import React from 'react'
import { Skeleton } from '../ui/skeleton'

function ChatSkeleton() {
  return (
    <section className="relative overflow-hidden h-[calc(100vh-4rem)] flex transition-all duration-500 w-full px-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Skeleton for Character Details Sidebar */}
        <div className="hidden md:block md:w-[320px] lg:w-[360px] xl:w-[400px] h-full border-r border-gray-800 bg-black/20 backdrop-blur-sm p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="flex flex-col items-center">
            {/* Avatar skeleton */}
            <Skeleton className="w-56 h-56 sm:w-60 sm:h-60 md:w-56 md:h-56 lg:w-60 lg:h-60 xl:w-64 xl:h-64 rounded-2xl mb-4" />
            
            {/* Name skeleton */}
            <Skeleton className="h-8 w-40 mb-2" />
            
            {/* Description skeleton */}
            <Skeleton className="h-4 w-full max-w-[90%] mb-1" />
            <Skeleton className="h-4 w-full max-w-[80%] mb-1" />
            <Skeleton className="h-4 w-full max-w-[60%] mb-4" />
            
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-[95%]">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
            
            {/* Persona card skeleton */}
            <Skeleton className="w-full h-32 mb-6 rounded-lg" />
            
            {/* Character info cards skeletons */}
            <Skeleton className="w-full h-24 mb-4 rounded-lg" />
            <Skeleton className="w-full h-24 mb-4 rounded-lg" />
            <Skeleton className="w-full h-24 rounded-lg" />
          </div>
        </div>
        
        {/* Skeleton for Chat Area */}
        <div className="w-full md:w-[calc(100%-320px)] lg:w-[calc(100%-360px)] xl:w-[calc(100%-400px)] h-full flex flex-col backdrop-blur-sm">
          {/* Chat header skeleton */}
          <div className="flex flex-col p-4 border-b border-gray-800 bg-black/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-md mr-2" />
                <Skeleton className="w-8 h-8 rounded-md" />
              </div>
            </div>
          </div>
          
          {/* Messages area skeleton */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i, index) => (
                <div 
                  key={i} 
                  className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[75%] ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {index % 2 === 0 && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}
                    <div>
                      <Skeleton 
                        className={`h-24 ${index % 2 === 0 ? 'w-64' : 'w-48'} rounded-xl`} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input area skeleton */}
          <div className="p-4 border-t border-gray-800 bg-black/20 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="flex-1 h-12 rounded-lg" />
              <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>
  )
}

export default ChatSkeleton