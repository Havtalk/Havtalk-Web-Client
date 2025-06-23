"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles,User, Calendar } from "lucide-react";
import Link from "next/link";
import CharacterCard from "@/components/character-card";
import Carousel3 from "@/components/carousel3";
import PersonaCard from "@/components/persona-card";
import axios from "axios";
import { BaseUrl } from "@/lib/utils";
import api from "@/lib/axiosInstance";
import { CharacterCardSkeleton } from "@/components/skeletons/character-card-skeleton";
import { PersonaCardSkeleton } from "@/components/skeletons/persona-card-skeleton";
import { ConversationSkeleton } from "@/components/skeletons/conversation-card-skeleton";

interface UserDetails {
  success: boolean;
  message: string;
  data: {
    id: string;
    bio: string | null;
    personality: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      username?: string;
      avatar?: string;
    };
    userPersona?: {
      id: string;
      name: string;
      avatar?: string;
    } | null;
  };
}

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

interface Persona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  character: string;
  preview: string;
  date: string;
  image: string;
  userpersona?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
}

interface Message {
  role: 'USER' | 'AI';
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  character?: {
    name: string;
    avatar?: string;
  };
  messages: Message[];
  updatedAt: string;
  userpersona?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
}

interface Favorite {
  characterId: string;
}

export default function Dashboard() {
  const heroRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 400); // Check for 400px width
    };
    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

 
  // Conversations API state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // Character API state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(true);
  const [charactersError, setCharactersError] = useState<string | null>(null);
  
  // Add state for favorite characters
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Fetch characters, favorites, and conversations in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's characters, favorites, and conversations in parallel
        const [charactersResponse, favoritesResponse, conversationsResponse] = await Promise.all([
          api.get(`/character/public`, { withCredentials: true }),
          api.get(`/user/favorites`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
          api.get(`/chatsession`, { withCredentials: true }).catch(() => ({ data: { chats: [] } }))
        ]);
        
        const fetchedCharacters = charactersResponse.data.characters || [];
        setCharacters(fetchedCharacters);
        
        // Extract favorite character IDs from response
        const favoritesData = favoritesResponse.data.data || [];
        const favoriteIds = favoritesData.map((fav: Favorite) => fav.characterId);
        setFavorites(favoriteIds);

        // Transform conversations data with actual last messages
        const fetchedConversations = conversationsResponse.data.chats || [];
        const transformedConversations = fetchedConversations.map((chat: ChatSession) => {
          let preview = 'Start your first conversation...';
          
          if (chat.messages && chat.messages.length > 0) {
            const lastMessage = chat.messages[0]; // API returns messages in desc order
            const isUserMessage = lastMessage.role === 'USER';
            const prefix = isUserMessage ? 'You: ' : `${chat.character?.name || 'AI'}: `;
            
            // Truncate long messages
            let content = lastMessage.content;
            if (content.length > 60) {
              content = content.substring(0, 60) + '...';
            }
            
            preview = prefix + content;
          }

          // Format relative time
          const formatRelativeTime = (dateString: string) => {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));

            if (diffMinutes <= 1) return 'Just now';
            if (diffMinutes < 60) return `${diffMinutes}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
            return `${Math.ceil(diffDays / 30)} months ago`;
          };
          
          return {
            id: chat.id,
            character: chat.character?.name || 'Unknown Character',
            preview: preview,
            date: formatRelativeTime(chat.updatedAt),
            image: chat.character?.avatar || "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=160&q=80",
            userpersona: chat.userpersona // Add persona data
          };
        });
        setConversations(transformedConversations);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCharactersError("Failed to load characters");
        setConversationsError("Failed to load conversations");
      } finally {
        setCharactersLoading(false);
        setConversationsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // We'll remove the unused public characters section since it's not being used
  // This fixes the unused variables warnings

  // Persona API state
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personasLoading, setPersonasLoading] = useState(true);
  const [personasError, setPersonasError] = useState<string | null>(null);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);

  useEffect(() => {
    // First fetch user details to get current persona
    const fetchUserAndPersonas = async () => {
      setPersonasLoading(true);
      setPersonasError(null);
      try {
        // Get user details first to find current persona
        const userResponse = await api.get<UserDetails>(
          `/user/user-details`,
          { withCredentials: true }
        );
        
        // Get current persona ID if available
        let currentId = null;
        if (userResponse.data.success && userResponse.data.data.userPersona) {
          currentId = userResponse.data.data.userPersona.id;
          setCurrentPersonaId(currentId);
        }
        
        // Then fetch all personas
        const personasResponse = await axios.get(`${BaseUrl}/persona`, { 
          withCredentials: true 
        });
        
        let fetchedPersonas = personasResponse.data.personas || [];
        
        // Move selected persona to the front if it exists
        if (currentId) {
          const idx = fetchedPersonas.findIndex((p: Persona) => p.id === currentId);
          if (idx > -1) {
            const [selected] = fetchedPersonas.splice(idx, 1);
            fetchedPersonas = [selected, ...fetchedPersonas];
          }
        }
        
        setPersonas(fetchedPersonas);
      } catch (err) {
        console.error("Error fetching personas:", err);
        setPersonasError("Failed to load personas");
      } finally {
        setPersonasLoading(false);
      }
    };
    
    fetchUserAndPersonas();
  }, []);

  // Handle persona selection with updated API integration
  const handlePersonaSelected = (id: string | null) => {
    // Update UI immediately for better user experience
    setCurrentPersonaId(id);
    
    // Reorder personas immediately with the new ID
    if (id) {
      setPersonas((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx > -1) {
          const newPersonas = [...prev];
          const [selected] = newPersonas.splice(idx, 1);
          return [selected, ...newPersonas];
        }
        return prev;
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className=" w-full px-0  pb-16 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden bg-gradient-to-b from-black to-gray-950 bg-background"
      style={{
        paddingLeft: "0px",
        paddingRight: "0px",
      }}
    >

      {/* Enhanced dynamic background elements with better colors */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {/* Main vibrant purple/pink orb */}
        <div className="absolute top-0 left-1/4 w-[45rem] h-[45rem] rounded-full blur-3xl opacity-50 animate-pulse-slow"
             style={{background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(192, 38, 211, 0.4) 40%, transparent 80%)", 
                    boxShadow: "0 0 120px 60px rgba(236, 72, 153, 0.1)"}}></div>
        
        {/* Bright blue/cyan floating orb */}
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-45 animate-float"
             style={{background: "radial-gradient(circle, rgba(6, 182, 212, 0.55) 0%, rgba(59, 130, 246, 0.35) 45%, transparent 85%)",
                    boxShadow: "0 0 100px 50px rgba(6, 182, 212, 0.08)"}}></div>
        
        {/* Vivid golden/orange corner accent */}
        <div className="absolute -top-28 -right-28 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-50"
             style={{background: "conic-gradient(from 0deg, rgba(251, 191, 36, 0.45), rgba(249, 115, 22, 0.35), rgba(244, 63, 94, 0.4), rgba(251, 191, 36, 0.45))",
                    boxShadow: "0 0 80px 40px rgba(251, 191, 36, 0.08)"}}></div>
        
        {/* Rich violet/magenta accent - replaced teal/emerald */}
        <div className="absolute -bottom-40 -left-20 w-[50rem] h-[50rem] rounded-full blur-3xl opacity-40 animate-float-delayed"
             style={{background: "radial-gradient(circle, rgba(167, 139, 250, 0.55) 0%, rgba(139, 92, 246, 0.35) 40%, transparent 80%)",
                    boxShadow: "0 0 100px 50px rgba(167, 139, 250, 0.08)"}}></div>
        
        {/* Bright amber/orange mid element */}
        <div className="absolute top-1/3 right-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-45 animate-pulse"
             style={{background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)",
                    boxShadow: "0 0 60px 30px rgba(251, 191, 36, 0.06)"}}></div>
        
        {/* Electric indigo accent */}
        <div className="absolute bottom-1/3 left-1/4 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-50 animate-float-slow"
             style={{background: "radial-gradient(circle, rgba(129, 140, 248, 0.45) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 85%)",
                    boxShadow: "0 0 70px 35px rgba(129, 140, 248, 0.07)"}}></div>
        
        {/* Vivid rose/red small accent */}
        <div className="absolute top-2/3 right-1/5 w-[18rem] h-[18rem] rounded-full blur-3xl opacity-45 animate-pulse-soft"
             style={{background: "radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, rgba(225, 29, 72, 0.3) 50%, transparent 80%)",
                    boxShadow: "0 0 50px 25px rgba(244, 63, 94, 0.08)"}}></div>
        
        {/* Deep purple accent */}
        <div className="absolute top-1/5 right-2/3 w-[22rem] h-[22rem] rounded-full blur-3xl opacity-40 animate-float"
             style={{background: "radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.25) 50%, transparent 85%)",
                    boxShadow: "0 0 60px 30px rgba(139, 92, 246, 0.07)"}}></div>
        
        {/* Enhanced light streaks */}
        <div className="absolute top-1/2 left-0 w-[40rem] h-[3rem] rotate-[20deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)"}}></div>
        
        <div className="absolute bottom-1/3 right-0 w-[35rem] h-[2.5rem] -rotate-[15deg] blur-2xl opacity-25"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)"}}></div>
             
        {/* Subtle cross-light */}
        <div className="absolute top-2/3 left-1/2 w-full h-[1.5rem] -rotate-[75deg] blur-2xl opacity-20"
             style={{background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)"}}></div>
      </div>

      <Carousel3/>


      {/* Characters you can talk to */}
      <div className="w-full mb-12 relative z-10 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pl-4 text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center">
            Characters
          </h2>
          <Link href="/characters">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              See All Characters <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        
        {/* Character container */}
        <div 
          ref={charactersRef}
          className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-px-2"
        >
          {charactersLoading ? (
            <div className="min-w-max mx-auto">
              {/* Show skeleton loaders while loading */}
              <div className="flex space-x-4 px-4 mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CharacterCardSkeleton key={index} isSmallScreen={isSmallScreen} />
                ))}
              </div>
              <div className="flex space-x-4 px-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CharacterCardSkeleton key={index + 4} isSmallScreen={isSmallScreen} />
                ))}
              </div>
            </div>
          ) : charactersError ? (
            <div className="text-center py-8 text-destructive">{charactersError}</div>
          ) : characters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No characters found. Create your first character!</div>
          ) : (
            <div className={`min-w-max ${characters.length <= 8 ? 'mx-auto' : ''}`}>
              {/* Split characters into two rows */}
              <div className="flex space-x-4 px-4 mb-4">
                {characters.slice(0, Math.ceil(characters.length / 2)).map(character => (
                  <CharacterCard 
                    key={character.id} 
                    character={character} 
                    isFavorite={favorites.includes(character.id)}
                  />
                ))}
              </div>
              
              {/* Only show second row if there are more characters */}
              {characters.length > 1 && (
                <div className="flex space-x-4 px-4">
                  {characters.slice(Math.ceil(characters.length / 2)).map(character => (
                    <CharacterCard 
                      key={character.id} 
                      character={character} 
                      isFavorite={favorites.includes(character.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Past conversations -> Renamed to Continue Talking */}
      <div className="w-full px-4 mb-12 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-50 flex items-center [text-shadow:0_0_12px_rgba(96,165,250,0.35)]">
            Recent Chats
          </h2>
          <Link href="/my-chats">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              See All Chats <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        
        {conversationsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ConversationSkeleton key={index} />
            ))}
          </div>
        ) : conversationsError ? (
          <div className="text-center py-8 text-destructive">{conversationsError}</div>
        ) : conversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {conversations.map(convo => (
              <Link href={`/chat/${convo.id}`} key={convo.id} className="block h-full">
                {/* Improved card */}
                <div className="h-full flex flex-col justify-between bg-gradient-to-r from-red-500 to-yellow-600 rounded-2xl p-4 shadow hover:shadow-lg transition-shadow transform hover:-translate-y-1 hover:scale-[1.02] duration-200">
                  
                  {/* avatar + title */}
                  <div className="flex items-center mb-3">
                    <div className="relative mr-3 flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden">
                        {convo.image ? (
                          <img
                            src={convo.image}
                            alt={convo.character}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      {convo.userpersona && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-gray-800 overflow-hidden">
                          {convo.userpersona.avatar ? (
                            <img
                              src={convo.userpersona.avatar}
                              alt={convo.userpersona.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {convo.character}
                      </h3>
                      {convo.userpersona && (
                        <p className="text-xs text-slate-300 truncate">
                          as {convo.userpersona.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* preview */}
                  <p className="flex-1 text-sm text-slate-800 line-clamp-3 mb-4 overflow-hidden">
                    {convo.preview}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs   flex items-center">
                      <Calendar className="mr-1 opacity-70" size={12} />{convo.date}
                    </p>
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
      <div className="w-full px-2 sm:px-4 mb-12 relative z-10">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center">
            Your Personas
          </h2>
          <Link href="/personas">
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950 hover:text-purple-200">
              See All Personas <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
        {personasLoading ? (
          <div className={`grid justify-center gap-2 ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,11rem)]'} sm:gap-4`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <PersonaCardSkeleton key={index} isSmallScreen={isSmallScreen} />
            ))}
          </div>
        ) : personasError ? (
          <div className="text-center text-destructive py-8">{personasError}</div>
        ) : personas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No personas found.</div>
        ) : (
          <div className={`grid justify-center sm:justify-start gap-2 ${isSmallScreen?'grid-cols-[repeat(auto-fill,9rem)]':'grid-cols-[repeat(auto-fill,11rem)]'} sm:gap-4`}>
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onPersonaSelected={handlePersonaSelected}
                isSelected={currentPersonaId === persona.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create your character */}
      <div className="w-full px-4 mt-8 relative z-5">
        <div className="relative overflow-hidden rounded-4xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/stars-bg.png')] opacity-20 mix-blend-overlay"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-pink-600/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 px-4 sm:px-5 md:px-8 py-6 sm:py-8 md:py-10 flex flex-wrap-reverse items-center justify-between gap-4 sm:gap-6">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                Breathe Life Into Your Imagination
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mb-4 leading-relaxed">
                Every character you create becomes a unique companion with their own personality, knowledge, and conversational style. What will you create next?
              </p>
              <Link href="/characters/create-character">
                <button className="relative group overflow-hidden rounded-xl bg-white text-purple-700 hover:text-purple-800 px-4 sm:px-5 py-2 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                Create New Character
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </Link>
            </div>
            
            <div className="hidden sm:block w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 relative mt-4 md:mt-0">
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-white/20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-4 rounded-full bg-white/20 animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-3xl sm:text-4xl md:text-5xl opacity-80">✨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}