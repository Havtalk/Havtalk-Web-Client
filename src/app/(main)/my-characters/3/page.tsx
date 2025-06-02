'use client';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Heart } from 'lucide-react';

// Dummy Character Data
const dummyCharacters = [
    {
      id: '1',
      name: 'Sherlock Holmes',
      description:
        'Brilliant detective with exceptional analytical abilities and keen observation skills.',
      personality:
        'Analytical, observant, occasionally arrogant, and socially awkward.',
      environment: 'Victorian London, primarily at 221B Baker Street.',
      avatar:
        'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80',
      additionalInfo:
        'Expert in deduction, chemistry, and violin playing. Lives at 221B Baker Street with Dr. Watson.',
      isPublic: true,
      ownerId: 'user1',
      ownerName: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z',
    },
    {
      id: '2',
      name: 'Elizabeth Bennet',
      description:
        'Intelligent, lively, and witty young woman with a strong sense of individuality.',
      personality:
        'Witty, playful, prejudiced at times, and values personal happiness over societal expectations.',
      environment: '19th century English countryside, Longbourn estate.',
      avatar: null,
      additionalInfo:
        'Second eldest of five daughters, known for her quick wit and independent spirit.',
      isPublic: false,
      ownerId: 'anonymousroleplayer',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
    },
    {
      id: '3',
      name: 'Tony Stark',
      description:
        'Genius inventor, billionaire, and superhero with a complex personality.',
      personality:
        'Brilliant, narcissistic, sarcastic, determined, and eventually selfless.',
      environment: 'Modern day, high-tech facilities and Stark Tower.',
      avatar:
        'https://images.unsplash.com/photo-1635863138275-d9b33299680b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2031&q=80',
      additionalInfo:
        'CEO of Stark Industries, creator of the Iron Man suit, member of the Avengers.',
      isPublic: true,
      ownerId: 'user1',
      createdAt: '2024-01-12T11:20:00Z',
      updatedAt: '2024-01-22T13:10:00Z',
    },
    {
      id: '4',
      name: 'Hermione Granger',
      description:
        'Extremely intelligent, hardworking witch with a strong moral compass.',
      personality:
        'Brilliant, loyal, brave, sometimes overbearing, with strong ethical principles.',
      environment:
        'Wizarding world, primarily Hogwarts School of Witchcraft and Wizardry.',
      avatar: null,
      additionalInfo:
        'Muggle-born witch, top student at Hogwarts, best friend to Harry Potter and Ron Weasley.',
      isPublic: false,
      ownerId: 'user1',
      createdAt: '2024-01-08T14:00:00Z',
      updatedAt: '2024-01-19T10:30:00Z',
    },
    {
      id: '5',
      name: 'Captain Jack Sparrow',
      description:
        'Eccentric and cunning pirate captain with unpredictable behavior.',
      personality:
        'Eccentric, cunning, self-serving yet loyal, with a peculiar sense of honor.',
      environment: '18th century Caribbean seas, aboard the Black Pearl.',
      avatar:
        'https://images.unsplash.com/photo-1535063406830-27dfba933db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
      additionalInfo:
        'Captain of the Black Pearl, seeks freedom above all else, master of improvisation.',
      isPublic: true,
      ownerId: 'user1',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-21T12:15:00Z',
    },
    {
      id: '6',
      name: 'Jane Eyre',
      description:
        'Independent and passionate young woman with a strong sense of morality.',
      personality:
        'Independent, passionate, principled, resilient, and introspective.',
      environment: 'Victorian England, primarily Thornfield Hall.',
      avatar: null,
      additionalInfo:
        'Orphaned governess with a strong moral compass, values equality and self-respect.',
      isPublic: true,
      ownerId: 'user1',
      createdAt: '2024-01-09T08:30:00Z',
      updatedAt: '2024-01-17T15:20:00Z',
    },
  ];
  

export default function MyCharactersPage() {
  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dummyCharacters.map((char, i) => (
          <div
            key={char.id}
            className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center group w-full h-fit"
          >
            <div className="relative w-full aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
              <img
                src={char.avatar || 'https://via.placeholder.com/300'}
                alt={char.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
            </div>

            {/* Always-visible Overlay */}
            <div className="absolute shadow-md bg-gradient-to-b from-transparent via-black/30 to-black/80 h-full w-full top-0 left-0 flex items-end justify-center rounded-xl">
              <div className="p-2 shadow-md flex flex-col items-start w-full max-w-full">
                <Badge variant="default" className="text-xs rounded-full">@{char.ownerId}</Badge>
                <h1 className="font-semibold mb-1 text-base sm:text-lg md:text-xl line-clamp-2 truncate text-white">{char.name}</h1>
                <p className="text-xs sm:text-sm line-clamp-2 text-white/90">{char.description}</p>
                <div className="relative mt-1 sm:mt-2 w-full mb-1">
                  <div className="flex gap-1 overflow-hidden">
                    <Badge variant="default" className="text-xs rounded-full bg-stone-500 flex-shrink-0">
                      clever
                    </Badge>
                    <Badge variant="default" className="text-xs rounded-full bg-stone-500 flex-shrink-0">
                      witty
                    </Badge>
                    <Badge variant="default" className="text-xs rounded-full bg-stone-500 flex-shrink-0">
                      loyal
                    </Badge>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Slide-up overlay */}
            <div className="gap-2 absolute shadow-md bg-black/50 backdrop-blur-md h-full w-full top-0 left-0 flex flex-col justify-start p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out rounded-xl">
              <img
                src={char.avatar || 'https://via.placeholder.com/300'}
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full"
              />
              <div className="flex flex-col items-start w-full max-w-full mt-1 sm:mt-2">
                <Badge variant="default" className="text-xs rounded-full">@{char.ownerId}</Badge>
                <h1 className="font-semibold mb-1 text-lg sm:text-xl md:text-2xl line-clamp-2 truncate text-white">{char.name}</h1>
                <p className="text-sm sm:text-base line-clamp-3 text-white/90">{char.description}</p>
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 w-full flex items-center justify-center rounded-xl">
                  <Button variant="default" className="rounded-full w-fit px-8 sm:px-12 py-2 sm:py-4 text-sm sm:text-base">
                    Chat
                  </Button>
                </div>
                <MoreVertical className="text-white absolute bottom-4 sm:bottom-6 right-2" size={20} />
              </div>
            </div>

            <Heart className="text-white absolute top-2 right-2" size={24} />
          </div>
        ))}
      </div>

      
    </div>
  );
}
