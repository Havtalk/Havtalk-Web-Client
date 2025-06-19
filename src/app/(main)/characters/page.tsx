'use client';

import CharacterCard from '@/components/character-card';
import { BaseUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BackgroundDesign from '@/components/background-design';
import { CharacterCardSkeleton } from '@/components/skeletons/character-card-skeleton';

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

export default function AllCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 400); 
    };
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch characters and favorites in parallel
        const [charactersResponse, favoritesResponse] = await Promise.all([
          axios.get(`${BaseUrl}/character/public`),
          axios.get(`${BaseUrl}/user/favorites`, { withCredentials: true }).catch(() => ({ data: { data: [] } }))
        ]);
        
        setCharacters(charactersResponse.data.characters || []);
        
        // Extract favorite character IDs from response
        const favoritesData = favoritesResponse.data.data || [];
        const favoriteIds = favoritesData.map((fav: Favorite) => fav.characterId);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to fetch characters.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <section className='w-full pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950'>
      <BackgroundDesign/>
      <div className={`w-full mx-auto ${isSmallScreen?'px-2':'px-4'} md:px-16 pt-16 md:pt-20`}>
          <h1 className='text-4xl md:text-4xl font-bold text-white mb-4 text-center'>All Characters</h1>
          <p className='text-lg text-gray-300 mb-10 text-center'>Explore the diverse range of characters available in our collection.</p>
          
          <div className={`grid justify-center md:gap-6 sm:gap-4 gap-2 lg:grid-cols-[repeat(auto-fill,14rem)] ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,10rem)]'} sm:grid-cols-[repeat(auto-fill,13rem)]`}>
              {loading ? (
                // Show skeleton loaders while loading
                Array.from({ length: 12 }).map((_, index) => (
                  <CharacterCardSkeleton key={index} isSmallScreen={isSmallScreen} />
                ))
              ) : error ? (
                <div className="text-white text-center col-span-full">{error}</div>
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
    </section>
  )
}