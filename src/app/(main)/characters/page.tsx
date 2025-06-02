import CharacterCard from '@/components/character-card';
import React from 'react';

function AllCharacters() {
     const dummyCharacters = [
  {
    id: "1",
    name: "Sherlock Holmes",
    description: "Brilliant detective with exceptional analytical abilities and keen observation skills.",
    personality: "Analytical, observant, occasionally arrogant, and socially awkward.",
    environment: "Victorian London, primarily at 221B Baker Street.",
    avatar: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80",
    additionalInfo: "Expert in deduction, chemistry, and violin playing. Lives at 221B Baker Street with Dr. Watson.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:22:00Z"
  },
  {
    id: "2",
    name: "Elizabeth Bennet",
    description: "Intelligent, lively, and witty young woman with a strong sense of individuality.",
    personality: "Witty, playful, prejudiced at times, and values personal happiness over societal expectations.",
    environment: "19th century English countryside, Longbourn estate.",
    avatar: null,
    additionalInfo: "Second eldest of five daughters, known for her quick wit and independent spirit.",
    isPublic: false,
    ownerId: "user1",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  },
  {
    id: "3",
    name: "Tony Stark",
    description: "Genius inventor, billionaire, and superhero with a complex personality.",
    personality: "Brilliant, narcissistic, sarcastic, determined, and eventually selfless.",
    environment: "Modern day, high-tech facilities and Stark Tower.",
    avatar: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2031&q=80",
    additionalInfo: "CEO of Stark Industries, creator of the Iron Man suit, member of the Avengers.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-12T11:20:00Z",
    updatedAt: "2024-01-22T13:10:00Z"
  },
  {
    id: "4",
    name: "Hermione Granger",
    description: "Extremely intelligent, hardworking witch with a strong moral compass.",
    personality: "Brilliant, loyal, brave, sometimes overbearing, with strong ethical principles.",
    environment: "Wizarding world, primarily Hogwarts School of Witchcraft and Wizardry.",
    avatar: null,
    additionalInfo: "Muggle-born witch, top student at Hogwarts, best friend to Harry Potter and Ron Weasley.",
    isPublic: false,
    ownerId: "user1",
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-19T10:30:00Z"
  },
  {
    id: "5",
    name: "Captain Jack Sparrow",
    description: "Eccentric and cunning pirate captain with unpredictable behavior.",
    personality: "Eccentric, cunning, self-serving yet loyal, with a peculiar sense of honor.",
    environment: "18th century Caribbean seas, aboard the Black Pearl.",
    avatar: "https://images.unsplash.com/photo-1535063406830-27dfba933db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    additionalInfo: "Captain of the Black Pearl, seeks freedom above all else, master of improvisation.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-21T12:15:00Z"
  },
  {
    id: "6",
    name: "Jane Eyre",
    description: "Independent and passionate young woman with a strong sense of morality.",
    personality: "Independent, passionate, principled, resilient, and introspective.",
    environment: "Victorian England, primarily Thornfield Hall.",
    avatar: null,
    additionalInfo: "Orphaned governess with a strong moral compass, values equality and self-respect.",
    isPublic: true,
    ownerId: "user1",
    createdAt: "2024-01-09T08:30:00Z",
    updatedAt: "2024-01-17T15:20:00Z"
  },

];

  return (
    <section className='w-full pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950'>
        <div className='w-full mx-auto px-4 md:px-8 pt-16 md:pt-20'>
            <h1 className='text-4xl md:text-4xl font-bold text-white mb-4 text-center'>All Characters</h1>
            <p className='text-lg text-gray-300 mb-10 text-center'>Explore the diverse range of characters available in our collection.</p>
            
            <div className='grid justify-center md:gap-6 sm:gap-4 gap-2 lg:grid-cols-[repeat(auto-fill,14rem)] grid-cols-[repeat(auto-fill,10rem)] sm:grid-cols-[repeat(auto-fill,13rem)]'>
                {dummyCharacters.map((character) => (
                    <CharacterCard 
                        character={character}
                        key={character.id}
                    />
                ))}
            
            </div>
        </div>
    </section>
  )
}

export default AllCharacters;