import React from 'react';
import { PlusCircle, Edit, Trash2, MessageCircle, Users, Sparkles, Search, X, Lock, Zap, Crown, Eye, Globe, Shield, Clock, MapPin, Star, Heart, MoreVertical, Play, Flame, Zap as Lightning, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
function CharacterCard({ character }: { character: any }) {
  return (
     <div key={character.id} className='relative rounded-2xl overflow-hidden flex flex-col items-center justify-center group w-fit h-fit min-w-40 '>
                <div className='relative md:w-56 md:h-72 sm:h-60 sm:w-52 w-40 shadow-lg rounded-lg overflow-hidden min-h-60'>
                    <img src={character?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} 
                    alt={character.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-lg"
                    />
                </div>
                {/* Overlay with character details - Always visible */}
                <div className='absolute shadow-md bg-gradient-to-b from-transparent via-black/30 to-black/80 h-full w-full top-0 left-0 flex items-end justify-center rounded-xl'>
                  <div className='p-2 shadow-md flex flex-col items-start w-full max-w-full'>
                    <Badge variant='default' className='text-xs rounded-full'>
                      @{character.ownerId}
                    </Badge>
                    <h1 className='font-semibold mb-2 text-lg md:text-2xl line-clamp-2'>{character.name}</h1>
                    <p className='text-xs line-clamp-2'>{character.description}</p>
                    <div className='relative mt-2 w-full mb-1'>
                      <div className='flex gap-1 overflow-hidden'>
                        <Badge variant='default' className='text-xs rounded-full bg-stone-500 flex-shrink-0'>
                            funny
                        </Badge>
                        <Badge variant='default' className='text-xs rounded-full bg-stone-500 flex-shrink-0'>
                            witty
                        </Badge>
                        <Badge variant='default' className='text-xs rounded-full bg-stone-500 flex-shrink-0'>
                            sarcastic
                        </Badge>
                        <Badge variant='default' className='text-xs rounded-full bg-stone-500 flex-shrink-0'>
                            intelligent
                        </Badge>
                      </div>
                      <div className='absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none'></div>
                    </div>
                  </div>
                </div>
                
                {/* Overlay with buttons - Slides up on hover */}
                <div className='gap-2 absolute shadow-md bg-black/50 backdrop-blur-md h-full w-full top-0 left-0 flex flex-col justify-start p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-t-xl'>
                    <img src={character?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'} className='h-12 w-12 sm:h-16 sm:w-16 rounded-full'/>
                  <div className='flex flex-col items-start w-full max-w-full mt-1 sm:mt-2'>
                    <Badge variant='default' className='text-xs rounded-full'>
                      @{character.ownerId}
                    </Badge>
                    <h1 className='font-semibold mb-1 sm:mb-2 text-lg lg:text-2xl md:line-clamp-2 line-clamp-2 sm:line-clamp-1'>{character.name}</h1>
                    <p className='text-xs line-clamp-2 md:line-clamp-3 '>{character.description}</p>
                    
                    <div className='absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-full flex items-center justify-center'>
                       <Button variant={'default'} className='rounded-full w-fit px-8 sm:px-12 py-2 sm:py-4 text-sm sm:text-base'>Chat</Button> 
                    </div>
                    <MoreVertical className='text-white absolute bottom-4 sm:bottom-6 right-2' size={20} />
                  </div>
                </div>
    
                <Heart className='text-white absolute top-2 right-2' size={30} />
              </div>
  )
}

export default CharacterCard;