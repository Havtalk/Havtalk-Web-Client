"use client";

import React, {useEffect, useState } from "react";
import { FastAverageColor } from 'fast-average-color';
import ChatDescription from "@/components/chat/chat-description";
import ChatBox from "@/components/guest-chat/guest-chatbox";
import api from "@/lib/axiosInstance";
import ChatSkeleton from "@/components/skeletons/chat-skeleton";
import { useParams } from "next/navigation";
import { Header } from "@/components/landing-header";
import ChatNotFound from "@/components/chat-not-found";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'model';
  createdAt: string;
}

interface Character {
  id: string;
  name: string;
  personality: string;
  description: string;
  environment: string;
  avatar: string | null;
  additionalInfo: string;
  tags: string[];
  backstory: string;
  role: string;
  goals: string;
  quirks: string;
  tone: string;
  speechStyle: string;
  exampleDialogues: { user: string; character: string }[];
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// interface UserPersona {
//   id: string;
//   name: string;
//   description: string;
//   personality: string;
//   avatar: string | null;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
// }


export default function Chat() {
  // const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams<{ characterId: string }>();

  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [dominantColor, setDominantColor] = useState('rgba(59, 130, 246, 0.3)');
  const [accentColor, setAccentColor] = useState('rgba(59, 130, 246, 0.5)');

  const fetchCharacter = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/guest/character/${params.characterId}`,{
        withCredentials: true,
      });
      console.log('Chat session data:', response.data);
      
      setCharacter(response.data.character);
    }
    catch (error) {
      console.error('Error fetching chat session:', error);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const messages= localStorage.getItem(`guest-chat-${params.characterId}`);
    if (messages) {
        try {
            const parsedMessages = JSON.parse(messages) as Message[];
            setMessages(parsedMessages);
        } catch (error) {
            console.error('Error parsing messages from localStorage:', error);
        }
    }
  },[]);
  
  useEffect(() => {
    fetchCharacter();
  }, [params.characterId]);

  useEffect(() => {
    if (character?.avatar) {
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = character.avatar;
      
      img.onload = async () => {
        const fac = new FastAverageColor();
        try {
          const color = await fac.getColorAsync(img);
          const [r, g, b] = color.value;
          
          setDominantColor(`rgba(${r}, ${g}, ${b}, 0.6)`);
          setAccentColor(`rgba(${r}, ${g}, ${b}, 0.4)`);
        } catch (e) {
          console.error('Error getting color:', e);
          setDominantColor('rgba(59, 130, 246, 0.15)');
          setAccentColor('rgba(59, 130, 246, 0.4)');
        }
      };
      
      img.onerror = () => {
        setDominantColor('rgba(59, 130, 246, 0.15)');
        setAccentColor('rgba(59, 130, 246, 0.4)');
      };
    } else {
      // Default colors if no avatar
      setDominantColor('rgba(59, 130, 246, 0.15)');
      setAccentColor('rgba(59, 130, 246, 0.4)');
    }
  }, [character]);

  if (loading) {
    return (
      <ChatSkeleton/>
    );
  }

  if (!character) {
    return (
      <ChatNotFound/>
    );
  }

  return (
    <>
    <Header className="z-0 relative bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 "/>
    <section 
      className="relative overflow-hidden h-[calc(100vh-4.5rem)] flex transition-all duration-500 w-full px-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      style={{
        background: `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          ${dominantColor} 50%, 
          rgba(0, 0, 0, 0.9) 100%)`,
          paddingRight:'0px',
          paddingLeft:'0px'
      }}
    >
      <ChatDescription 
        accentColor={accentColor} 
        character={character} 
        dominantColor={dominantColor} 
        setShowCharacterDetails={setShowCharacterDetails} 
        showCharacterDetails={showCharacterDetails} 
        // currentPersona={chatSession?.userpersona}
        sessionId="guest"
        isGuest={true}
      />
      
      <ChatBox 
        accentColor={accentColor} 
        character={character} 
        dominantColor={dominantColor} 
        setShowCharacterDetails={setShowCharacterDetails} 
        showCharacterDetails={showCharacterDetails}
        messages={messages}
        // currentPersona={chatSession?.userpersona}
      />
    </section>
    </>
  );
}