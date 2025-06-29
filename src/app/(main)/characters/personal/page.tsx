'use client';
import CharacterCard from '@/components/character-card';
import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BaseUrl } from '@/lib/utils';
import Link from 'next/link';
import { Inbox, Plus } from 'lucide-react';
import BackgroundDesign from '@/components/background-design';
import { CharacterCardSkeleton } from '@/components/skeletons/character-card-skeleton';
import api from '@/lib/axiosInstance';

// Define proper interfaces for type safety
interface Character {
  id: string;
  name: string;
  description: string;
  personality?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic?: boolean;
  owner:{
    id: string;
    name: string;
    avatar?: string;
  }
}

interface Favorite {
  characterId: string;
}

function MyCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charactersResponse, favoritesResponse] = await Promise.all([
          api.get(`/character`, { withCredentials: true }),
          api.get(`/user/favorites`, { withCredentials: true })
        ]);
        
        setCharacters(charactersResponse.data.characters || []);
        
        const favoritesData = favoritesResponse.data.data || [];
        const favoriteIds = favoritesData.map((fav: Favorite) => fav.characterId);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
      const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth <= 400); // Check for 360px width
      };
      checkScreenSize(); // Initial check
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

  return (
    <section className='w-full pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950'>
       <BackgroundDesign/>
        <div className={`w-full mx-auto ${isSmallScreen?'px-2':'px-4'} md:px-8 pt-16 md:pt-20`}>
            <div className='relative w-full mb-4 flex flex-col items-center justify-center'>
                <h1 className='text-3xl sm:text-4xl font-bold text-white text-center mb-6 sm:mb-10'>My Characters</h1>
                <div className='flex items-center gap-2'>
                  <Link href="/characters/personal/requests" className='hidden sm:block'>
                    <button className='px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center text-sm'>
                      <Inbox className="w-4 h-4 mr-2" />
                      My Requests
                    </button>
                  </Link>
                  <Link href="/characters/create-character" className=''>
                    <button className='hidden sm:flex px-4 py-2 bg-primary text-white rounded-xl hover:bg-indigo-700 transition-colors items-center text-sm'>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Character
                    </button>
                  </Link>
                </div>
            </div>
            
            <div className={`grid justify-center md:gap-6 sm:gap-4 gap-2 lg:grid-cols-[repeat(auto-fill,14rem)] ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,10rem)]'} sm:grid-cols-[repeat(auto-fill,13rem)]`}>
                {loading ? (
                  // Show skeleton loaders while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <CharacterCardSkeleton key={index} isSmallScreen={isSmallScreen} />
                  ))
                ) : characters.length === 0 ? (
                  <div className="text-white text-center col-span-full">No characters found.</div>
                ) : (
                  characters.map((character) => (
                    <CharacterCard 
                        character={character}
                        key={character.id}
                        isFavorite={favorites.includes(character.id)}
                    />
                  ))
                )}
            </div>
        </div>
        
        {/* Mobile floating buttons */}
        <div className='sm:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50'>
            <Link href="/characters/personal/requests">
                <button className='bg-purple-600 text-white rounded-full p-3 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors'>
                    <Inbox className="w-5 h-5" />
                </button>
            </Link>
            <button className='bg-primary text-white rounded-full p-3 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors'>
                <Plus className="w-5 h-5" />
            </button>
        </div>
    </section>
  )
}

export default MyCharacters;