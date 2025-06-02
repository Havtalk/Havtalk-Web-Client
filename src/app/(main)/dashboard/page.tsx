"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Star, PlusCircle, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CharacterCard from "@/components/character-card";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import CarouselDemo from "@/components/caraousel-demo";
import Carousel2 from "@/components/carousel2";
import Carousel3 from "@/components/carousel3";
// import { signIn, signUp } from "@/lib/auth";

export default function Dashboard() {
  const heroRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const personasScrollRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  // Ref for "Your Characters" carousel scroll container
  const ownCharactersCarouselRef = useRef<HTMLDivElement>(null);
  // State to track the currently visible character in the "Your Characters" carousel
  const [currentOwnCharacterIndex, setCurrentOwnCharacterIndex] = useState(0);

  const [animationDetails, setAnimationDetails] = useState<{
    isAnimating: boolean;
    incomingCardId: string | null;
    originalIncomingCardIndex: number | null; // Visual index before reorder
    displacedCardIds: string[];
  }>({
    isAnimating: false,
    incomingCardId: null,
    originalIncomingCardIndex: null,
    displacedCardIds: [],
  });

  const [orbs, setOrbs] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    color: string;
    direction: { x: number; y: number };
  }>>([]);
  
  // Initialize and animate orbs & Setup Intersection Observer for "Your Characters" carousel
  useEffect(() => {
    // Create initial orbs
    const colors = ['rgba(147, 51, 234, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)'];
    const initialOrbs = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 150 + 50,
      speed: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      direction: { 
        x: Math.random() * 2 - 1, 
        y: Math.random() * 2 - 1 
      }
    }));
    setOrbs(initialOrbs);
    let orbAnimationFrameId: number;
    const animateOrbs = () => {
      setOrbs(prevOrbs => 
        prevOrbs.map(orb => {
          let newX = orb.x + orb.direction.x * orb.speed;
          let newY = orb.y + orb.direction.y * orb.speed;
          let newDirectionX = orb.direction.x;
          let newDirectionY = orb.direction.y;
          if (newX <= 0 || newX >= window.innerWidth) newDirectionX *= -1;
          if (newY <= 0 || newY >= window.innerHeight) newDirectionY *= -1;
          return { ...orb, x: newX, y: newY, direction: { x: newDirectionX, y: newDirectionY } };
        })
      );
      orbAnimationFrameId = requestAnimationFrame(animateOrbs);
    };
    animateOrbs();

    // Intersection Observer for "Your Characters" carousel
    const observerOptions = {
      root: ownCharactersCarouselRef.current, // The scroll container
      rootMargin: '0px',
      threshold: 0.8, // Trigger when 80% of the item is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const characterId = entry.target.getAttribute('data-character-id');
          const index = dummyCharacters.findIndex(char => char.id === characterId);
          if (index !== -1) {
            setCurrentOwnCharacterIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const characterSlides = ownCharactersCarouselRef.current?.querySelectorAll('.own-character-slide');
    
    if (characterSlides) {
      characterSlides.forEach(slide => observer.observe(slide));
    }

    return () => {
      cancelAnimationFrame(orbAnimationFrameId);
      if (characterSlides) {
        characterSlides.forEach(slide => observer.unobserve(slide));
      }
    };
  }, []); // Rerun if dummyCharacters length changes, though it's static here.

  // owncharacters array is not directly used for the carousel, dummyCharacters is.
  const owncharacters = [{
    id: 1,
    name: "Your Character",
    image: "/characters/your_character.png",
    description: "Your custom character description goes here.",
  },
  {
    id: 2,
    name: "Another Character",
    image: "/characters/another_character.png",
    description: "Another custom character description goes here.",
  },
  {
    id: 3,
    name: "Third Character",
    image: "/characters/third_character.png",
    description: "Third custom character description goes here.",
  },
  {
    id: 4,
    name: "Fourth Character",
    image: "/characters/fourth_character.png",
    description: "Fourth custom character description goes here.",
  },
  {
    id: 5,
    name: "Fifth Character",
    image: "/characters/fifth_character.png",
    description: "Fifth custom character description goes here.",
  },
  {
    id: 6,
    name: "Sixth Character",
    image: "/characters/sixth_character.png",
    description: "Sixth custom character description goes here.",
  },
  {
    id: 7,
    name: "Seventh Character",
    image: "/characters/seventh_character.png",
    description: "Seventh custom character description goes here.",
  },
  {
    id: 8,
    name: "Eighth Character",
    image: "/characters/eighth_character.png",
    description: "Eighth custom character description goes here.",
  }

  ]

  // Sample characters data
  const characters = [
    { id: 1, name: "Einstein", image: "/characters/einstein.png", description: "The brilliant physicist" },
    { id: 2, name: "Marie Curie", image: "/characters/curie.png", description: "Pioneer in radioactivity" },
    { id: 3, name: "Shakespeare", image: "/characters/shakespeare.png", description: "The famous playwright" },
    { id: 4, name: "Cleopatra", image: "/characters/cleopatra.png", description: "Ancient Egyptian ruler" },
    { id: 5, name: "Leonardo da Vinci", image: "/characters/davinci.png", description: "Renaissance polymath" },
    { id: 6, name: "Nikola Tesla", image: "/characters/tesla.png", description: "Inventor and electrical engineer" },
    { id: 7, name: "Aristotle", image: "/characters/aristotle.png", description: "Greek philosopher" },
    { id: 8, name: "Ada Lovelace", image: "/characters/lovelace.png", description: "First computer programmer" },
  ];

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

  // Sample conversations data - keeping modern/sci-fi feel
  const conversations = [
    { id: 101, character: "Nexus AI", preview: "Analyzing temporal distortions. Recommend immediate action...", date: "Last Sync: 0.2h ago", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=160&q=80" }, 
    { id: 102, character: "Void Navigator", preview: "Log entry: Sector Gamma-7 remains unstable. Further scans required...", date: "Last Sync: 1.5d ago", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726c?ixlib=rb-4.0.3&auto=format&fit=crop&w=160&q=80" },
    { id: 103, character: "Cybernetic Emissary", preview: "Transmission decoded. The council requests your presence...", date: "Last Sync: 3.1d ago", image: "https://images.unsplash.com/photo-1605511220601-833595052c93?ixlib=rb-4.0.3&auto=format&fit=crop&w=160&q=80" },
    // ... more conversations if needed
  ];

  // Placeholder for a modern "Log" or "Data" icon - refined
  const DataLogIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );


  // Function to handle persona selection with animation
  const handlePersonaSelection = (personaId: string) => {
    if (animationDetails.isAnimating) return;

    if (personaId === selectedPersonaId) return;

    if (personaId === "__CREATE_NEW__") {
      setSelectedPersonaId("__CREATE_NEW__");
      setAnimationDetails({ // Reset animation for "Create New"
        isAnimating: false,
        incomingCardId: null,
        originalIncomingCardIndex: null,
        displacedCardIds: [],
      });
      return;
    }

    const currentPersonasOrder = getOrderedPersonas(); // Order before this selection
    const clickedPersonaVisualIndex = currentPersonasOrder.findIndex(p => p.id === personaId);

    if (clickedPersonaVisualIndex === -1) return; // Should not happen

    const displaced: string[] = [];
    for (let i = 0; i < clickedPersonaVisualIndex; i++) {
      if (currentPersonasOrder[i]) {
        displaced.push(currentPersonasOrder[i].id);
      }
    }
    
    setAnimationDetails({
      isAnimating: true,
      incomingCardId: personaId,
      originalIncomingCardIndex: clickedPersonaVisualIndex,
      displacedCardIds: displaced,
    });

    setSelectedPersonaId(personaId); // This triggers re-render with new order

    setTimeout(() => {
      setAnimationDetails({
        isAnimating: false,
        incomingCardId: null,
        originalIncomingCardIndex: null,
        displacedCardIds: [],
      });
    }, 600); // Animation duration
  };

  // Create reordered personas list with selected persona first
  const getOrderedPersonas = () => {
    if (!selectedPersonaId || selectedPersonaId === "__CREATE_NEW__") {
      return dummyCharacters;
    }
    
    const selectedPersona = dummyCharacters.find(p => p.id === selectedPersonaId);
    const otherPersonas = dummyCharacters.filter(p => p.id !== selectedPersonaId);
    
    return selectedPersona ? [selectedPersona, ...otherPersonas] : dummyCharacters;
  };

  // Functions for "Your Characters" carousel
  const handleOwnCarouselScroll = (direction: 'next' | 'prev') => {
    if (!ownCharactersCarouselRef.current) return;

    const scrollContainer = ownCharactersCarouselRef.current;
    const scrollAmount = scrollContainer.clientWidth; 

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentOwnCharacterIndex + 1) % dummyCharacters.length;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      newIndex = (currentOwnCharacterIndex - 1 + dummyCharacters.length) % dummyCharacters.length;
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
    // setCurrentOwnCharacterIndex(newIndex); // Let IntersectionObserver handle this for accuracy
  };

  const testimonialData = dummyCharacters.map(character => ({
    id: character.id, // Add id
    quote: character.description,
    name: character.name,
    designation: character.personality || "Character", 
    src: character.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(character.name)}&background=random&color=fff&size=500`, 
    tags: ["Interactive", "AI", character.isPublic ? "Public" : "Private"], // Example tags
    ownerUsername: character.ownerId.replace(/^user/, ''), // Format ownerId as username
  }));

  return (
    <section
      ref={heroRef}
      className="w-full  pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950"
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {orbs.map(orb => (
          <div
            key={orb.id}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${orb.x}px`,
              top: `${orb.y}px`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: orb.color,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <Carousel3/>


      {/* Characters you can talk to */}
      <div className="w-full mb-12 relative z-10 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pl-4 text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center">
            {/* <MessageSquare className="mr-2" size={24} /> */}
            Characters
          </h2>
          <Link href="/characters">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              See All Characters <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        
        {/* Single scrollable container with both rows */}
        <div 
          ref={charactersRef}
          className="overflow-x-auto pb-4"
        >
          <div className="min-w-max">
            {/* First row of characters */}
            <div className="flex space-x-4 px-4 mb-4">
              {dummyCharacters.slice(0, 8).map(character => (
                  <CharacterCard key={character.id} character={character} />
              ))}
            </div>
            
            {/* Second row of characters */}
            <div className="flex space-x-4 px-4">
              {dummyCharacters.slice(0, 8).map(character => (
                  <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Past conversations -> Renamed to Continue Talking */}
      <div className="w-full px-4 mb-12 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-50 flex items-center [text-shadow:0_0_12px_rgba(96,165,250,0.35)]">
            {/* <Clock className="mr-3.5 text-sky-400/90" size={28} strokeWidth={2.2} />  */}
              Recent Chats
          </h2>
          <Link href="/conversations">
            <Button variant="outline" className="font-medium border-sky-600/70 text-sky-300 hover:bg-sky-500/20 hover:text-sky-200 hover:border-sky-500/90 transition-all duration-300 group px-6 py-3 text-[0.9rem] rounded-lg"> {/* More rounded button */}
              View All Logs <DataLogIcon className="ml-2.5 h-4.5 w-4.5 text-sky-400/80 group-hover:text-sky-300 transition-colors duration-300" />
            </Button>
          </Link>
        </div>
        
        {conversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {conversations.map(convo => (
              <Link href={`/chat/history/${convo.id}`} key={convo.id} className="block h-full">
                {/* Improved card */}
                <div className="h-full flex flex-col justify-between bg-gradient-to-r from-red-500 to-yellow-600 rounded-2xl p-4 shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1 hover:scale-[1.02] duration-200">
                  
                  {/* avatar + title */}
                  <div className="flex items-center mb-3">
                    <div className="h-12 w-12 rounded-full bg-slate-700 overflow-hidden mr-3 flex-shrink-0">
                      <img
                        src={convo.image}
                        alt={convo.character}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {convo.character}
                      </h3>
                      {/* <p className="text-xs text-slate-800 flex items-center">
                        <Clock className="mr-1 opacity-70" size={12} />{convo.date}
                      </p> */}
                    </div>
                  </div>
                  
                  {/* preview */}
                  <p className="flex-1 text-sm text-slate-800 line-clamp-3 mb-4 overflow-hidden">
                    {convo.preview}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex justify-end">
                    <div className="text-white hover:text-white transition-colors flex items-center">
                      <span className="text-sm mr-1">Continue Chat</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
               </Link>
            ))}

          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-500 to-yellow-400 backdrop-blur-2xl rounded-3xl p-16 text-center border border-slate-700/50 shadow-2xl hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.2)] transition-shadow duration-500"> {/* More rounded */}
            <div className="relative w-24 h-24 mx-auto mb-10">
              <div className="absolute inset-0 rounded-full bg-sky-600/20 animate-pulse-slow blur-xl"></div>
              {/* Replace with a more abstract/modern "connection" icon if available */}
              <svg className="absolute inset-0 m-auto text-sky-400/70 w-14 h-14 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <h3 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-purple-400 mb-5 [text-shadow:0_0_12px_rgba(96,165,250,0.35)]">Connection Standby</h3>
            <p className="text-slate-300/70 max-w-md mx-auto text-lg leading-relaxed">
              No active dialogues found. Initiate a new connection or explore available character interfaces.
            </p>
          </div>
        )}
      </div>
      {/* All Personas */}
      <div className="w-full px-4 mb-12 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
            <Star className="mr-2" size={20} /> {/* Adjusted icon size slightly */}
            Your Personas
          </h2>
          <Link href="/characters">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              See All Characters <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

        {/* Personas list */}
        <div className="overflow-x-auto pb-4" ref={personasScrollRef}>
          <div className="flex space-x-6 px-4 py-6">
            {/* Create New Persona Card */}
            <Link
              href="/create-character"
              data-persona-id="__CREATE_NEW__"
              className={`group flex-shrink-0 w-48 bg-gradient-to-br from-green-700 via-green-800 to-green-900 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1.5 border-2 ${
                selectedPersonaId === "__CREATE_NEW__" ? 'border-green-400 shadow-2xl scale-110 bg-gradient-to-br from-green-600 via-green-700 to-green-800' : 'border-green-500 hover:border-green-400'
              }`}
              onClick={() => handlePersonaSelection("__CREATE_NEW__")}
            >
              <div className={`h-20 w-20 rounded-full bg-green-600/50 flex items-center justify-center shadow-lg border-2 transition-colors mb-3 relative ${
                selectedPersonaId === "__CREATE_NEW__" ? 'border-green-300' : 'border-green-400 group-hover:border-green-300'
              }`}>
                <PlusCircle className="text-green-200 group-hover:text-green-100" size={40} />
                {selectedPersonaId === "__CREATE_NEW__" && (
                  <div className="absolute -top-1 -right-1 bg-green-400 h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="text-white" size={12} />
                  </div>
                )}
              </div>
              <span className={`text-white text-md font-semibold mt-1 truncate w-full transition-colors ${
                selectedPersonaId === "__CREATE_NEW__" ? 'text-green-100' : 'group-hover:text-green-200'
              }`}>
                Create New
              </span>
              <p className={`text-xs mt-1 line-clamp-2 h-8 transition-colors ${
                selectedPersonaId === "__CREATE_NEW__" ? 'text-green-200' : 'text-green-300 group-hover:text-green-200'
              }`}>
                Design a unique persona.
              </p>
              {selectedPersonaId === "__CREATE_NEW__" && (
                <div className="mt-2 px-2 py-1 text-xs font-medium bg-green-500/30 text-green-200 rounded-full border border-green-400/50">
                  Selected
                </div>
              )}
            </Link>

            {getOrderedPersonas().map((persona, index) => {
              let animationClass = '';
              let dynamicStyle: React.CSSProperties = {};
              const cardWidthPlusMarginPx = 216; // Approx w-48 (192px) + space-x-6 (24px)

              if (animationDetails.isAnimating) {
                if (persona.id === animationDetails.incomingCardId && animationDetails.originalIncomingCardIndex !== null) {
                  // This is the card moving to the first slot
                  animationClass = 'animate-slide-to-first';
                  dynamicStyle = { '--start-x-offset': `${animationDetails.originalIncomingCardIndex * cardWidthPlusMarginPx}px` } as React.CSSProperties;
                } else if (animationDetails.displacedCardIds.includes(persona.id)) {
                  // This card is being displaced one slot to the right
                  animationClass = 'animate-slide-one-slot-right';
                }
              }
              
              const isSelectedForStaticStyling = selectedPersonaId === persona.id && !animationDetails.isAnimating;

              return (
                <div
                  key={persona.id} 
                  data-persona-id={persona.id}
                  onClick={() => handlePersonaSelection(persona.id)}
                  className={`group flex-shrink-0 w-48 bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-xl p-4 flex flex-col items-center text-center transition-opacity duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1.5 border cursor-pointer ${
                    isSelectedForStaticStyling ? 'border-purple-500 shadow-2xl scale-110 bg-gradient-to-br from-purple-800/50 via-gray-800 to-gray-900' : 'border-transparent hover:border-purple-500/50'
                  } ${animationClass}`}
                  style={dynamicStyle}
                >
                  <div className="w-full flex flex-col items-center">
                    <div className="relative mb-3" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/chat/${persona.id}`}>
                        {persona.avatar ? (
                          <img
                            src={persona.avatar}
                            alt={persona.name}
                            className={`h-20 w-20 rounded-full object-cover border-2 shadow-lg transition-colors ${
                              isSelectedForStaticStyling ? "border-purple-400" : "border-purple-500/70 group-hover:border-purple-400"
                            }`}
                          />
                        ) : (
                          <div className={`h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center shadow-lg border-2 transition-colors ${
                            isSelectedForStaticStyling ? "border-purple-400" : "border-purple-500/70 group-hover:border-purple-400"
                          }`}>
                            <User className={`text-purple-300 group-hover:text-purple-200 ${isSelectedForStaticStyling && "text-purple-200"}`} size={32} />
                          </div>
                        )}
                      </Link>
                      {/* {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-purple-500 h-5 w-5 rounded-full border-2 border-gray-800 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )} */}
                      {!isSelectedForStaticStyling && <div className="absolute -bottom-1 -right-1 bg-green-500 h-3 w-3 rounded-full border-2 border-gray-800 group-hover:animate-pulse"></div>}
                    </div>
                    <span className={`text-white text-md font-semibold mt-1 truncate w-full group-hover:text-purple-300 transition-colors ${isSelectedForStaticStyling && "text-purple-300"}`}>
                      {persona.name}
                    </span>
                    <p className={`text-gray-400 text-xs mt-1 line-clamp-2 h-8 group-hover:text-gray-300 transition-colors ${isSelectedForStaticStyling && "text-gray-300"}`}>
                      {persona.description}
                    </p>
                    {isSelectedForStaticStyling && (
                      <div className="mt-2 px-2 py-1 text-xs font-medium bg-purple-500/30 text-purple-300 rounded-full border border-purple-400/50">
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create your character */}
      <div className="w-full px-4 relative z-10">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white flex items-center">
              <Sparkles className="mr-2" size={20} /> {/* Adjusted icon size slightly */}
              New Persona
            </h2>
            <p className="text-gray-300 max-w-lg">
              Design a custom character with unique personality traits, knowledge, and voice.
              Bring your imagination to life and have conversations with your creation.
            </p>
          </div>
          <Link href="/create-character">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              <PlusCircle className="mr-2" size={18} />
              Create Character
            </Button>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-to-first {
          from {
            transform: translateX(var(--start-x-offset)) scale(1);
            opacity: 0.7;
            z-index: 10; 
          }
          to {
            transform: translateX(0) scale(1.1); 
            opacity: 1;
            z-index: 10;
          }
        }

        @keyframes slide-one-slot-right {
          from {
            transform: translateX(-216px) scale(1); /* Start one slot to the left of its new position */
            opacity: 0.7;
            z-index: 5;
          }
          to {
            transform: translateX(0) scale(1); /* End at its new position */
            opacity: 1;
            z-index: 5;
          }
        }

        .animate-slide-to-first {
          animation: slide-to-first 0.6s cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }

        .animate-slide-one-slot-right {
          animation: slide-one-slot-right 0.6s cubic-bezier(0.35, 0, 0.25, 1) forwards;
        }
        
        /* Add this to your global CSS (e.g., globals.css or a Tailwind plugin) for scrollbar-hide */
        /*
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  // IE and Edge
          scrollbar-width: none;  // Firefox
        }
        */
      `}</style>
    </section>
  );
}