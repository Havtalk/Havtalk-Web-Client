'use client';
import React, { useState, useEffect } from 'react';
import {Edit, Eye,  Heart, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Added Dialog components
import { usePersonaPreferences } from '@/hooks/use-preferences';
// import { useRouter } from 'next/navigation';
import { useRouter } from '@bprogress/next/app';
import { toast } from 'sonner';
import api from '@/lib/axiosInstance';

// Define proper interface for Character
interface Character {
  id: string;
  name: string;
  description: string;
  personality?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  owner: {
    id: string;
    username?: string;
    name: string;
  };
}

interface CharacterCardProps {
  character: Character;
  isFavorite?: boolean;
  isOwner?: boolean;
  isFavouritePage?: boolean;
  handleFavoriteRemoved?: (characterId: string) => void;
}

function CharacterCard({ 
  character, 
  isFavorite: initialIsFavorite = false, 
  isOwner = true, 
  handleFavoriteRemoved,
  isFavouritePage = false 
}: CharacterCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // New state for small screens (360px)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
      setIsSmallScreen(window.innerWidth <= 400); // Check for 360px width
    };
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {currentPersonaId} = usePersonaPreferences();
  const router = useRouter();

  const toggleFavourite = async(e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the card
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      
      // const response = await axios.post(
      //   `${BaseUrl}/user/toggle-favourite`, 
      //   { characterId: character.id },
      //   { withCredentials: true }
      // );
      const response = await api.post(
        `/user/toggle-favourite`, 
        { characterId: character.id },
      );
      
      if (response.data.success) {
        setIsFavorite(prev => !prev);
        if (isFavouritePage && handleFavoriteRemoved) {
          handleFavoriteRemoved(character.id);
        }
        toast.success(isFavorite ? 'Removed from favorites!' : 'Added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChatClick = async(e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log('Creating chat for character:', character.id, 'with persona:', currentPersonaId);
      // const response = await axios.post(
      //   `${BaseUrl}/chatsession`, 
      //   { characterId: character.id, userpersonaId: currentPersonaId },
      //   { withCredentials: true }
      // );
      const response =await api.post(
        `/chatsession`,
        { characterId: character.id, userpersonaId: currentPersonaId },);

      
      if (response.data.success||response.status === 201) {
        console.log('Chat created successfully:', response.data);
        toast.success('Chat created successfully!');
        router.push(`/chat/${response.data.chat.id}`); // Navigate to the chat page
        
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCardClick = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    }
    
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = () => {
      setDropdownOpen(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [dropdownOpen]);

  // Handlers for dropdown actions
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    router.push(`/characters/${character.id}`); 
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(false);
    router.push(`/characters/${character.id}/edit`); 
  };

  const fallbackAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  return (
    <>
      <div 
        key={character.id} 
        className={`relative rounded-2xl overflow-hidden flex flex-col items-center justify-center group w-fit h-fit ${isSmallScreen ? 'min-w-36' : 'min-w-40'} cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className={`relative md:w-56 md:h-72 sm:h-60 sm:w-52 ${isSmallScreen?'w-36':'w-40'} shadow-lg rounded-lg overflow-hidden min-h-60 aspect-[3/4]`}>
            <img 
              src={character?.avatar || fallbackAvatar} 
              alt={character.name} 
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 rounded-lg"
            />
        </div>
        {/* Overlay with character details - Always visible */}
        <div className='absolute shadow-md bg-gradient-to-b from-transparent via-black/30 to-black/80 h-full w-full top-0 left-0 flex items-end justify-center rounded-xl pointer-events-none'>
          <div className='p-2 shadow-md flex flex-col items-start w-full max-w-full'>
            <Badge variant='default' className='text-xs rounded-full'>
              @{character.owner.username ||character.owner.name}
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
        
        {/* Overlay with buttons - Slides up on hover (Desktop only effectively) */}
        {!isMobile && (
          <div className='gap-2 absolute shadow-md bg-black/50 backdrop-blur-md h-full w-full top-0 left-0 flex flex-col justify-start p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-t-xl'>
              <img src={character?.avatar || fallbackAvatar} className='h-12 w-12 sm:h-16 sm:w-16 rounded-full'/>
            <div className='flex flex-col items-start w-full max-w-full mt-1 sm:mt-2'>
              <Badge variant='default' className='text-xs rounded-full'>
                @{character.owner.username ||character.owner.name}
              </Badge>
              <h1 className='font-semibold mb-1 sm:mb-2 text-lg lg:text-2xl md:line-clamp-2 line-clamp-2 sm:line-clamp-1'>{character.name}</h1>
              <p className='text-xs line-clamp-2 md:line-clamp-3 '>{character.description}</p>
              
              <div className='absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-full flex items-center justify-center'>
                 <Button 
                   variant={'default'} 
                   className='rounded-full w-fit px-8 sm:px-12 py-2 sm:py-4 text-sm sm:text-base'
                   onClick={handleChatClick}
                   disabled={isLoading}
                 >
                   Chat
                 </Button> 
              </div>
              {/* MoreVertical Dropdown */}
              {isOwner&&(<div className='absolute bottom-4 sm:bottom-6 right-2'>
                <MoreVertical
                  className='text-white cursor-pointer'
                  size={20}
                  onClick={e => {
                    e.stopPropagation();
                    setDropdownOpen(v => !v);
                  }}
                />
                {dropdownOpen && (
                  <div
                    className="absolute right-0 bottom-8 z-50 bg-slate-950/90 backdrop-blur-3xl rounded shadow-lg py-1 w-32 flex flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/70 text-sm text-left"
                      onClick={handleView}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/70 text-sm text-left"
                      onClick={handleEdit}
                    >
                      <Edit size={16} /> Edit
                    </button>
                  </div>
                )}
              </div>)}
            </div>
          </div>
        )}

        <Heart 
          className={`absolute top-2 right-2 cursor-pointer transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-110'} ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} 
          size={30}  
          onClick={toggleFavourite}
        />
      </div>

      {/* Dialog for Mobile View */}
      {isMobile && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
            <DialogHeader>
              <div className="flex items-start space-x-4 mb-3">
                <img 
                  src={character?.avatar || fallbackAvatar} 
                  alt={character.name} 
                  className="h-20 w-20 rounded-full object-cover" // Increased size and rounded-lg
                />
                <div className="flex-1 items-start flex flex-col gap-1">
                  <Badge variant='secondary' className='text-xs rounded-full mt-1'>
                    @{character.owner.username || character.owner.name}
                  </Badge>
                  <DialogTitle className="text-xl font-bold line-clamp-2 text-left">{character.name}</DialogTitle>
                  
                </div>
              </div>
            </DialogHeader>
            <div className="max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"> 
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {character.description}
              </p>
            </div>
            <DialogFooter className="mt-4 relative w-full flex justify-center items-center">
              <div className="relative flex flex-row items-center justify-center w-full gap-2">
                <Button
                  variant={'default'}
                  className='w-2/3 py-3 text-base'
                  onClick={handleChatClick}
                  disabled={isLoading}
                >
                  Chat 
                </Button>
                {isOwner&&(<div className="relative">
                  <MoreVertical
                    className='text-white cursor-pointer'
                    size={20}
                    onClick={e => {
                      e.stopPropagation();
                      setDropdownOpen(v => !v);
                    }}
                  />
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 bottom-8 z-50 bg-slate-950/90 backdrop-blur-3xl rounded shadow-lg py-1 w-32 flex flex-col"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/70 text-sm text-left"
                        onClick={handleView}
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800/70 text-sm text-left"
                        onClick={handleEdit}
                      >
                        <Edit size={16} /> Edit
                      </button>
                    </div>
                  )}
                </div>)}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default CharacterCard;
