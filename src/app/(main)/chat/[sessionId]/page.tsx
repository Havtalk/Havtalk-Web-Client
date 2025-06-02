"use client";

import React, { useEffect, useState } from "react";
import { FastAverageColor } from 'fast-average-color';
import ChatDescription from "@/components/chat/chat-description";
import ChatBox from "@/components/chat/chatbox";
import axios from "axios";
import { BaseUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Define types for our API response
interface Message {
  id: string;
  sessionId: string;
  content: string;
  role: 'USER' | 'AI';
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

interface ChatSession {
  id: string;
  userId: string;
  characterId: string;
  environment: string | null;
  userpersonaId: string | null;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  title: string | null;
  messages: Message[];
  character: Character;
  userpersona: any | null;
}

interface ApiResponse {
  message: string;
  chat: ChatSession;
}

export default function Chat({ params }: { params: { sessionId: string }}) {
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [dominantColor, setDominantColor] = useState('rgba(59, 130, 246, 0.3)'); // Default blue
  const [accentColor, setAccentColor] = useState('rgba(59, 130, 246, 0.5)');

  const fetchChatSession = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`${BaseUrl}/chatsession/${params.sessionId}`,{
        withCredentials: true,
      });
      console.log('Chat session data:', response.data);
      
      setChatSession(response.data.chat);
      setCharacter(response.data.chat.character);
      setMessages(response.data.chat.messages);
    }
    catch (error) {
      console.error('Error fetching chat session:', error);
    }
    finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchChatSession();
  }, [params.sessionId]);

  // Extract dominant color from character avatar
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
          
          // Create different opacity versions for various elements
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
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-48 rounded-md" />
          <Skeleton className="h-64 w-96 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-slate-900">
        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Chat not found</h2>
          <p className="text-gray-300">The requested chat session could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <section 
      className="relative overflow-hidden h-[calc(100vh-4rem)] flex transition-all duration-500 w-full px-0"
      style={{
        background: `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          ${dominantColor} 50%, 
          rgba(0, 0, 0, 0.9) 100%)`,
          paddingRight:'0px',
          paddingLeft:'0px'
      }}
    >
      {/* Character Details - Left Side - Position it absolutely on mobile so it doesn't affect layout */}
      <ChatDescription 
        accentColor={accentColor} 
        character={character} 
        dominantColor={dominantColor} 
        setShowCharacterDetails={setShowCharacterDetails} 
        showCharacterDetails={showCharacterDetails} 
      />
      
      {/* Chat Interface - Right Side - Force it to take full width on mobile */}
      <ChatBox 
        accentColor={accentColor} 
        character={character} 
        dominantColor={dominantColor} 
        setShowCharacterDetails={setShowCharacterDetails} 
        showCharacterDetails={showCharacterDetails}
        messages={messages}
        sessionId={params.sessionId}
      />
    </section>
  );
}