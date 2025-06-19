'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FastAverageColor } from 'fast-average-color'; 
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import Axiosapi from "@/lib/axiosInstance";
import { Ghost, Loader2, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { CarouselSkeleton } from "@/components/skeletons/carousel-skeleton";
import { usePersonaPreferences } from '@/hooks/use-preferences';
import { useRouter } from '@bprogress/next/app';
import { toast } from 'sonner';

type ShowcaseCharacter = {
  id: string;
  character: {
    id: string;
    name: string;
    description: string;
    avatar: string;
    personality?: string;
    tags?: string[];
    owner: {
      id: string;
      name: string;
      username?: string;
    };
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  isActive: boolean;
  createdAt: string;
}

type SlideProps = {
  image: string;
  title: string;
  description: string;
  personality?: string;
  specialty?: string;
  creator?: string;
  tags?: string[];
  characterId?: string;
}

function Carousel3() {
  const [dominantColor, setDominantColor] = useState('rgba(0,0,0,0.5)');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<SlideProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const {currentPersonaId} = usePersonaPreferences();
  const router = useRouter();
  const handleChatClick = async(characterId:string) => {
    if (loadingChat) return;
    setLoadingChat(true);
    try {
      console.log('Creating chat for character:', characterId, 'with persona:', currentPersonaId);
      const response =await Axiosapi.post(
        `/chatsession`,
        { characterId: characterId, userpersonaId: currentPersonaId },);

      
      if (response.data.success||response.status === 201) {
        console.log('Chat created successfully:', response.data);
        toast.success('Chat created successfully!');
        router.push(`/chat/${response.data.chat.id}`); 
        
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoadingChat(false);
    }
  }


  // Fetch character showcase data
  useEffect(() => {
    const fetchShowcaseCharacters = async () => {
      try {
        setLoading(true);
        const response = await Axiosapi.get('/character/character-showcase');
        
        if (response.data.success && response.data.data) {
          const showcaseData: ShowcaseCharacter[] = response.data.data;
          
          // Filter only active characters and transform to slide format
          const transformedSlides: SlideProps[] = showcaseData
            .filter(item => item.isActive && item.character) // Ensure character exists
            .map(item => ({
              image: item.character.avatar || '/placeholder-character.png',
              title: item.character.name,
              description: item.character.description,
              personality: item.character.personality,
              creator: item.character.owner?.username || item.character.owner?.name || 'Unknown Creator',
              characterId: item.character.id,
              tags: item.character.tags || ['AI Character', 'Featured'] // Use actual tags from character
            }));

          setSlides(transformedSlides);
          
        } else {
          setSlides([]);
        }
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching character showcase:', err);
        setSlides([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseCharacters();
  }, []);

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (slides.length === 0) return;
    
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    if (slides && slides[current]) {
      img.src = slides[current].image;
    } else {
      setDominantColor('rgba(0,0,0,0.5)');
      return;
    }
    
    img.onload = async () => {
      const fac = new FastAverageColor();
      try {
        const color = await fac.getColorAsync(img);
        setDominantColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.7)`);
      } catch (e) {
        console.error('Error getting color:', e);
        setDominantColor('rgba(0,0,0,0.5)');
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image');
      setDominantColor('rgba(0,0,0,0.5)');
    };
  }, [current, slides]);

  if (loading) {
    return <CarouselSkeleton />;
  }

  if (slides.length === 0) {
    return (
      <div className='relative w-full mx-auto h-[calc(100vh-10rem)] overflow-hidden rounded-none shadow-2xl bg-gradient-to-b from-black to-gray-950 flex items-center justify-center'>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text ">
              No Featured Characters Yet
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              The character showcase is currently empty. Explore our amazing collection of characters or create your own unique personalities to chat with.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/characters">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Users className="w-5 h-5 mr-2" />
                Browse Characters
              </Button>
            </Link>
            
            <Link href="/characters/create-character">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-950 hover:text-purple-200 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                <Ghost className="w-5 h-5 mr-2" />
                Create Character
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-400">
            <p>✨ Featured characters are curated by our community</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - Update to match empty state style
  if (error) {
    return (
      <div className='relative w-full mx-auto h-[calc(100vh-10rem)] overflow-hidden rounded-none shadow-2xl bg-gradient-to-b from-black to-gray-950 flex items-center justify-center'>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Something went wrong</h3>
            <p className="text-red-400 text-lg mb-6">{error}</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
            >
              Try Again
            </Button>
            
            <div className="text-sm text-gray-400">
              <Link href="/characters" className="text-purple-400 hover:text-purple-300 underline">
                Browse all characters instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className='relative w-full mx-auto h-[calc(100vh-10rem)] overflow-hidden rounded-none shadow-2xl transition-all duration-500 ease-in-out'
      style={{
        backgroundImage: `radial-gradient(circle at center, ${dominantColor}, rgba(0,0,0,0.8))`,
      }}
    >
      {/* Background blur effect with parallax */}
      <div 
        className="absolute inset-0 -z-10 transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: (slides && slides[current]) ? `url(${slides[current].image})` : '',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px) brightness(0.7)',
          transform: isTransitioning ? 'scale(1.1)' : 'scale(1.05)',
        }}
      ></div>
      
      <Carousel 
        className='h-full'
        setApi={setApi}
        plugins={[Autoplay()]}
        opts={{
          align: "center",
          loop: true,
        }}
        onTransitionStart={() => setIsTransitioning(true)}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full flex items-center justify-center">
              <Card className="w-full h-full border-none bg-transparent">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16 h-full w-full gap-8 md:gap-12">
                  {/* Image container */}
                  <div className="relative w-full h-[40vh] md:h-[80%] md:w-1/2 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md lg:max-w-lg mx-auto">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="drop-shadow-2xl"
                        priority
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-character.png';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Text content container */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 md:space-y-2 text-center md:text-left">
                    {slide.creator && (
                      <div className="text-white/70 flex items-center justify-center md:justify-start">
                        <span className="text-white/80">@{slide.creator}</span>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                        {slide.title} 
                      </h3>
                      <div className="h-1 w-20 bg-white/40 mx-auto md:mx-0 mb-3 rounded-full"></div>
                    </div>
                    
                    <p className="text-white/80 text-base md:text-lg leading-relaxed md:line-clamp-2 lg:line-clamp-3 xl:line-clamp-4">
                      {slide.description}
                    </p>
                    
                    {/* Tags */}
                    {slide.tags && slide.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-3 justify-center md:justify-start">
                        {slide.tags.slice(0,4).map((tag, i) => (
                          <Badge 
                            key={i} 
                            variant="default" 
                            className="rounded-full border-white/30 bg-white/30 hover:bg-white/40 text-white/90 px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {slide.tags.length > 4 && (
                          <Badge
                            variant="default"
                            className="rounded-full border-white/30 bg-white/30 hover:bg-white/40 text-white/90 px-3 py-1 text-xs sm:text-sm font-medium backdrop-blur-sm transition-colors"
                          > 
                            +{slide.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold 
                           py-3 px-8 md:px-10 rounded-full shadow-lg hover:shadow-xl
                           transform transition-all duration-300 hover:scale-105 mt-2"
                      onClick={() => {
                      if (slide.characterId) {
                        handleChatClick(slide.characterId);
                      }
                      }}
                      disabled={loadingChat}
                    >
                      {loadingChat ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                      ) : (
                      "Chat Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation arrows */}
        <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 
                                     bg-black/40 hover:bg-black/60 text-white 
                                     w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg" />
        <CarouselNext className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 
                                   bg-black/40 hover:bg-black/60 text-white 
                                   w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg" />
      
        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`rounded-full transition-all duration-300 ease-out
                ${
                  index === current 
                    ? 'w-2.5 h-2.5 bg-white shadow-md scale-110'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70' 
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to ${slides[index]?.title || `slide ${index + 1}`}`}
              title={slides[index]?.title || `slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

export default Carousel3;