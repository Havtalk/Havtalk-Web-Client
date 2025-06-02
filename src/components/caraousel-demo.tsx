import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Character {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
}

function CarouselDemo() {
  const characters: Character[] = [
    {
      id: 1,
      name: "Detective Noir",
      description: "Master of deduction with a mysterious past.",
      image: "https://picsum.photos/id/1005/400/600",
      tags: ["mystery", "detective", "noir"]
    },
    {
      id: 2,
      name: "Scarlet Shadow",
      description: "The enigmatic femme fatale of the city.",
      image: "https://picsum.photos/id/1011/400/600",
      tags: ["stealth", "dangerous", "ally"]
    },
    {
      id: 3,
      name: "The Informant",
      description: "Knows all the secrets that flow through the underworld.",
      image: "https://picsum.photos/id/1012/400/600",
      tags: ["information", "networker", "shady"]
    },
    {
      id: 4,
      name: "The Enforcer",
      description: "When words fail, he makes sure actions speak louder.",
      image: "https://picsum.photos/id/1025/400/600",
      tags: ["muscle", "intimidation", "loyalty"]
    },
    {
      id: 5,
      name: "The Mastermind",
      description: "Always three steps ahead of everyone else.",
      image: "https://picsum.photos/id/1074/400/600",
      tags: ["genius", "planner", "manipulative"]
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full mx-auto h-[calc(100vh-6rem)] overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl">
      <Carousel 
        className="w-full h-full" 
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        current={currentIndex}
      >
        <CarouselContent className="h-full">
          {characters.map((character, index) => (
            <CarouselItem key={character.id} className="h-full">
              <div className="flex flex-col md:flex-row h-full">
                {/* Character Info Section */}
                <div className="p-8 md:w-1/2 text-white space-y-4 flex flex-col justify-center pt-0">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <span>{character.tags.map(tag => `#${tag}`).join(' ')}</span>
                    <span className="text-gray-400">• {Math.floor(Math.random() * 100)}k</span>
                  </div>
                  
                  <h2 className="text-5xl font-bold text-blue-100">{character.name}</h2>
                  
                  <p className="text-xl text-slate-300">
                    {character.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {character.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="px-4 py-2 bg-slate-700/80 border border-slate-600/50 rounded-full text-sm text-blue-100 hover:bg-slate-600 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button className="w-full md:w-fit bg-blue-700 hover:bg-blue-600 transition-colors py-3 px-8 rounded-md text-white font-medium shadow-sm">
                      Select Character
                    </button>
                  </div>
                </div>

                {/* Character Image Section */}
                <div className="md:w-1/2 relative">
                  <div className="aspect-[3/4] relative overflow-hidden h-full">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 transition-colors p-2 rounded-full text-white border-0" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 transition-colors p-2 rounded-full text-white border-0" />
      </Carousel>

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        {characters.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-blue-400 w-6' : 'bg-gray-400 bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default CarouselDemo;