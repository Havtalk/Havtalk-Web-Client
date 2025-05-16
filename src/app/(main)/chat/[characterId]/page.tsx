"use client"

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Info, Sparkles, MessageCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  role: "user" | "character";
  timestamp: Date;
}

interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  personality?: string;
}

// Mock data for characters
const MOCK_CHARACTERS: Record<string, Character> = {
  "1": {
    id: "1",
    name: "Sherlock Holmes",
    description: "Consulting detective with exceptional analytical abilities",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    personality: "Analytical, observant, and sometimes arrogant"
  },
  "2": {
    id: "2",
    name: "Jane Austen",
    description: "English novelist known for her romantic fiction",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    personality: "Witty, insightful, and socially observant"
  },
  "3": {
    id: "3",
    name: "Albert Einstein",
    description: "Theoretical physicist who developed the theory of relativity",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    personality: "Curious, imaginative, and philosophical"
  }
};

// Mock responses based on character personality
const generateMockResponse = (character: Character, userMessage: string): string => {
  const lowercaseMessage = userMessage.toLowerCase();
  
  if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    return `Hello there! I'm ${character.name}. How may I assist you today?`;
  }
  
  if (lowercaseMessage.includes("how are you")) {
    return `I'm doing well, thank you for asking! As ${character.name}, I'm always ready for interesting conversations.`;
  }
  
  if (lowercaseMessage.includes("what do you do") || lowercaseMessage.includes("who are you")) {
    return `I am ${character.name}. ${character.description}.`;
  }
  
  if (character.id === "1") { // Sherlock Holmes
    return "Elementary, my dear friend. The answer requires careful observation and deduction. Let me analyze the facts presented.";
  } else if (character.id === "2") { // Jane Austen
    return "It is a truth universally acknowledged that a single question in possession of complexity must be in want of a thoughtful response.";
  } else if (character.id === "3") { // Albert Einstein
    return "The important thing is not to stop questioning. Curiosity has its own reason for existing. Let's explore this concept together.";
  }
  
  return `As ${character.name}, I find your question intriguing. Let me share my thoughts on this matter...`;
};

export default function ChatPage() {
  const params = useParams();
  const characterId = params.characterId as string;
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load mock character data instead of fetching from API
  useEffect(() => {
    const mockCharacter = MOCK_CHARACTERS[characterId] || {
      id: characterId,
      name: "Unknown Character",
      description: "Character details not available",
      imageUrl: "https://randomuser.me/api/portraits/lego/1.jpg"
    };
    
    setCharacter(mockCharacter);
    
    // Initialize with a greeting message
    setMessages([
      {
        id: "welcome",
        content: `Hello! I'm ${mockCharacter.name}. How can I help you today?`,
        role: "character",
        timestamp: new Date()
      }
    ]);
  }, [characterId]);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !character) return;
    
    const userMessageContent = inputMessage;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userMessageContent,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Use mock response generator instead of API
    setTimeout(() => {
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMockResponse(character, userMessageContent),
        role: "character",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, characterResponse]);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Character theme colors - simplified for better consistency
  const getCharacterTheme = (id: string) => {
    switch(id) {
      case "1": // Sherlock Holmes
        return {
          primary: "from-blue-600 to-blue-800",
          accent: "ring-blue-500",
          color: "blue",
          background: "bg-gradient-to-br from-gray-900 via-blue-950/20 to-gray-950",
          glow: "shadow-blue-500/20"
        };
      case "2": // Jane Austen
        return {
          primary: "from-rose-500 to-rose-800",
          accent: "ring-rose-500",
          color: "rose",
          background: "bg-gradient-to-br from-gray-900 via-rose-950/10 to-gray-950",
          glow: "shadow-rose-500/20"
        };
      case "3": // Albert Einstein
        return {
          primary: "from-emerald-500 to-emerald-800",
          accent: "ring-emerald-500",
          color: "emerald",
          background: "bg-gradient-to-br from-gray-900 via-emerald-950/10 to-gray-950",
          glow: "shadow-emerald-500/20"
        };
      default:
        return {
          primary: "from-violet-500 to-violet-800",
          accent: "ring-violet-500",
          color: "violet",
          background: "bg-gradient-to-br from-gray-900 via-violet-950/10 to-gray-950",
          glow: "shadow-violet-500/20"
        };
    }
  };

  const theme = character ? getCharacterTheme(character.id) : getCharacterTheme("default");

  if (!character) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 mb-4"></div>
          <div className="text-lg font-medium text-white">Loading character...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] overflow-hidden ${theme.background}`}>
      {/* Character header */}
      <div className="p-4 border-b border-gray-800/80 backdrop-blur-sm bg-black/40 z-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.primary} blur-md opacity-30`}></div>
            <Avatar className={`h-14 w-14 ${theme.accent} ring-2 ring-offset-2 ring-offset-black relative z-10`}>
              <AvatarImage src={character.imageUrl} alt={character.name} />
              <AvatarFallback className={`bg-gradient-to-br ${theme.primary}`}>
                {character.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{character.name}</h2>
              <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-500/40">
                <Sparkles size={12} className="mr-1" />
                AI Character
              </Badge>
            </div>
            <p className="text-sm text-gray-300 line-clamp-1">{character.description}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-gray-800/80"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={20} className="text-gray-400" />
        </Button>
      </div>

      {/* Character Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/40 backdrop-blur-md border-b border-gray-800/80 overflow-hidden shrink-0"
          >
            <div className="p-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
                <h3 className="font-semibold text-lg text-white">About {character.name}</h3>
                <div className={`h-1 flex-1 rounded-full bg-gray-800/60`}></div>
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">{character.description}</p>
              
              {character.personality && (
                <div className="mb-4 p-4 rounded-lg bg-gray-800/40 border border-gray-700/80">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
                    <span className="text-sm font-medium text-white">Personality Traits</span>
                  </div>
                  <span className="text-gray-300">{character.personality}</span>
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Badge variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300">
                  <Sparkles size={12} className="mr-1" />
                  AI Character
                </Badge>
                <Badge variant="secondary" className={`bg-${theme.color}-500/10 hover:bg-${theme.color}-500/20 text-${theme.color}-300`}>
                  <MessageCircle size={12} className="mr-1" />
                  Interactive
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:px-6 lg:px-8"
        style={{
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-3xl w-full mx-auto space-y-4 pb-2">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                {message.role === "character" && (
                  <div className="relative mr-2 mt-2 hidden sm:block">
                    <Avatar className={`h-8 w-8 ${theme.accent} ring-1 ring-offset-1 ring-offset-black`}>
                      <AvatarImage src={character.imageUrl} alt={character.name} />
                      <AvatarFallback className={`bg-gradient-to-br ${theme.primary}`}>
                        {character.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border border-gray-900"></span>
                    </span>
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[70%]`}>
                  <Card
                    className={`p-4 ${
                      message.role === "user" 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl rounded-tr-none border-0" 
                        : `bg-gray-800/70 text-gray-100 rounded-2xl rounded-tl-none border border-gray-700/50 ${theme.glow}`
                    }`}
                  >
                    {message.content}
                  </Card>
                  <div className={`text-xs text-gray-500 mt-1 px-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                
                {message.role === "user" && (
                  <div className="relative ml-2 mt-2 hidden sm:block">
                    <Avatar className="h-8 w-8 ring-1 ring-blue-400 ring-offset-1 ring-offset-black">
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600">
                        <User size={14} />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-gray-900"></span>
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="relative mr-2 mt-1 hidden sm:block">
                <Avatar className={`h-8 w-8 ${theme.accent} ring-1 ring-offset-1 ring-offset-black`}>
                  <AvatarImage src={character.imageUrl} alt={character.name} />
                </Avatar>
              </div>
              <Card className="p-3 px-5 bg-gray-800/70 text-gray-100 rounded-2xl rounded-tl-none border border-gray-700/50">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-800/80 backdrop-blur-sm bg-black/50 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 relative">
            <div className={`absolute -top-7 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none`}></div>
            <div className="relative flex-1">
              <Textarea
                className="flex-1 resize-none rounded-xl bg-gray-800/70 border-gray-700/50 hover:border-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 pr-12 min-h-[60px] max-h-32 text-white placeholder:text-gray-400 shadow-lg"
                placeholder={`Message ${character.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()} 
                className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors shadow-md disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={14} className="text-white" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
