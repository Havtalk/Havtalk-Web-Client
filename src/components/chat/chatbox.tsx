'use client';
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ChevronsRight, MessageSquare, Send, AlertCircle, RotateCcw, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import api from '@/lib/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

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

interface UserPersona {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string | null;
  userId: string;
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
  userpersona: UserPersona | null;
}

interface ApiResponse {
  message: string;
  chat: ChatSession;
}


function ChatBox({character, messages: initialMessages, sessionId, accentColor, dominantColor, setShowCharacterDetails, currentPersona}:{
    character: Character;
    messages?: Message[];
    sessionId: string;
    accentColor: string;
    dominantColor: string;
    showCharacterDetails: boolean;
    setShowCharacterDetails: React.Dispatch<React.SetStateAction<boolean>>;
    currentPersona?: UserPersona | null;
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    // const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [streamingContent, setStreamingContent] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState(false);
    // const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);

    // Improved scrollToBottom function that works with radix ScrollArea
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          // Force immediate scroll to bottom
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
      
      // Also try using the messagesEndRef as a fallback
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    };
    
    // Ensure we scroll when messages or streaming content changes
    useEffect(() => {
      // First immediate scroll attempt
      scrollToBottom();
      
      // Then try again after a small delay to ensure content has rendered
      const scrollTimer = setTimeout(() => {
        scrollToBottom();
      }, 50);
      
      // And one more time after a longer delay (for images or slow rendering)
      const finalScrollTimer = setTimeout(() => {
        scrollToBottom();
      }, 300);
      
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(finalScrollTimer);
      };
    }, [messages, streamingContent]);
    
    // Add a MutationObserver to detect DOM changes and scroll accordingly
    useEffect(() => {
      if (scrollAreaRef.current) {
        const observer = new MutationObserver(() => {
          scrollToBottom();
        });
        
        observer.observe(scrollAreaRef.current, {
          childList: true,
          subtree: true,
          characterData: true
        });
        
        return () => observer.disconnect();
      }
    }, []);

    const sendMessage = async () => {
        if (message.trim()) {
          const userMessage: Message = {
            id: Date.now().toString(), // temporary id
            sessionId: sessionId,
            content: message,
            role: 'USER',
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, userMessage]);
          setSending(true);
          setIsStreaming(true);
          setStreamingContent("");
          
          try {
            // Use axios with responseType 'text' for streaming
            await api({
              method: 'post',
              url: `/chatsession/${sessionId}/message/stream`,
              data: {
                message: message,
                role: 'USER'
              },
              responseType: 'text',
              withCredentials: true,
              onDownloadProgress: (progressEvent) => {
                const responseText = progressEvent.event.target.responseText;
                if (!responseText) return;
                
                // Process the SSE text manually
                const lines = responseText.split('\n\n');
                let fullContent = "";
                let isComplete = false;
                let completeData = null;
                
                // First pass: collect all chunks to ensure proper order
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.substring(6));
                      
                      if (data.type === 'chunk') {
                        // Concatenate all chunks in order
                        fullContent += data.content;
                      } else if (data.type === 'complete') {
                        // Mark as complete and save full response
                        isComplete = true;
                        completeData = data;
                      }
                    } catch (e) {
                      console.error('Error parsing event data:', e);
                    }
                  }
                }
                
                // Update the streaming content with the full concatenated content
                setStreamingContent(fullContent);
                setTimeout(scrollToBottom, 0);
                
                // If we have a complete event, add it to messages
                if (isComplete && completeData) {
                  const aiMessage: Message = {
                    id: Date.now().toString(),
                    sessionId: sessionId,
                    content: completeData.fullResponse,
                    role: 'AI',
                    createdAt: completeData.timestamp
                  };
                  
                  setMessages(prev => [...prev, aiMessage]);
                  setIsStreaming(false);
                }
              }
            });
            
          } catch (error) {
            console.error('Error sending message:', error);
            setIsStreaming(false);
            // Attempt to get messages even if streaming failed
            fetchChatSession();
          } finally {
            setSending(false);
            setMessage("");
          }
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
    
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
    
    const fetchChatSession = async () => {
      // setLoading(true);
      try {
        const response = await api.get<ApiResponse>(`/chatsession/${sessionId}`, {
          withCredentials: true,
        });
        console.log('Chat session data:', response.data);
        setMessages(response.data.chat.messages);
        // setCurrentSession(response.data.chat);
      }
      catch (error) {
        console.error('Error fetching chat session:', error);
      }
      finally {
        // setLoading(false);
      }
    }
    
    useEffect(() => {
      if (initialMessages && initialMessages.length > 0) {
        setMessages(initialMessages);
      } else {
        fetchChatSession();
      }
    }, [sessionId, initialMessages]);


  // Enhanced message formatting function with better styling and support for various text elements
  const formatMessageContent = (content: string) => {
    if (!content) return null;

    // Handle paragraphs first by splitting on double newlines
    const paragraphs = content.split(/\n\n+/g);
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Process each paragraph for formatting elements
    const formattedParts: React.ReactNode[] = [];
      
      // Split the paragraph by asterisks (*) to identify narration sections
      const parts = paragraph.split(/(\*[^*]+\*)/g);
      
      // Process each part
      parts.forEach((part, partIndex) => {
        if (!part) return;
        
        // Check if the part is narration (wrapped in asterisks)
        if (part.startsWith('*') && part.endsWith('*')) {
          // Remove the asterisks and style as narration
          const narration = part.slice(1, -1);
          formattedParts.push(
            <span key={`${paragraphIndex}-${partIndex}`} className="text-gray-400 italic">
              {narration}
            </span>
          );
        } else {
          // For dialogue parts, further process to handle emphasis and quotes
          const processedText = part;
          
          // Split by newlines to maintain line breaks
          const lines = processedText.split(/\n/g);
          
          lines.forEach((line, lineIndex) => {
            // Add a special style if the line seems to be a question
            const isQuestion = line.trim().endsWith('?');
            
            formattedParts.push(
              <span 
                key={`${paragraphIndex}-${partIndex}-${lineIndex}`} 
                className={`${isQuestion ? 'text-gray-100' : 'text-gray-100 font-medium'} ${lineIndex > 0 ? 'block mt-1' : ''}`}
              >
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            );
          });
        }
      });
      
      // Return the formatted paragraph with spacing between paragraphs
      return (
        <p key={paragraphIndex} className={`${paragraphIndex > 0 ? 'mt-3' : ''}`}>
          {formattedParts}
        </p>
      );
    });
  };
  // Helper function to generate random conversation starter prompts
  const getRandomPrompt=(character: Character): string=> {
    const prompts = [
      `Hi ${character.name}, nice to meet you!`,
      `Hello there! I'd love to chat with you.`,
      `Hey ${character.name}! How are you today?`,
      `I've been looking forward to talking with you!`,
      `What's on your mind today?`
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  const resetChat = async () => {
    setIsResetting(true);
    try {
      const response = await api.post(`/chatsession/${sessionId}/reset`, {}, {
        withCredentials: true,
      });
      
      if (response.status === 200 || response.status === 201) {
        // Clear the messages in the UI
        setMessages([]);
        toast.success("Chat has been reset successfully");
        
        // Fetch the session again to get the new initial message if any
        fetchChatSession();
      }
    } catch (error) {
      console.error('Error resetting chat:', error);
      toast.error("Failed to reset chat. Please try again.");
    } finally {
      setIsResetting(false);
      setShowResetConfirmation(false);
    }
  };

  return (
    <div className="w-full md:w-[calc(100%-320px)] lg:w-[calc(100%-360px)] xl:w-[calc(100%-400px)] h-full flex flex-col backdrop-blur-sm transition-all duration-300 min-h-0">
        {/* Chat Header */}
        <div 
          className="flex flex-col p-2 sm:p-3 md:p-4 border-b backdrop-blur-sm flex-shrink-0"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, 0.4)`,
            borderColor: accentColor 
          }}
        >
          {/* Main header with character info and details button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10">
                <AvatarImage src={character.avatar || undefined} />
                <AvatarFallback 
                  className="text-white text-[0.65rem] sm:text-xs md:text-sm"
                  style={{ background: accentColor }}
                >
                  {character.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="font-semibold text-white text-xs sm:text-sm md:text-base line-clamp-1 max-w-[150px] sm:max-w-[200px]">{character.name}</h2>
                <div className="text-[0.65rem] sm:text-xs md:text-sm text-green-400 flex items-center">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 md:mr-2"></div>
                  Online
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge 
                variant="outline" 
                className="text-gray-300 text-[0.65rem] sm:text-xs md:text-sm hidden lg:flex mr-2"
                style={{ borderColor: accentColor }}
              >
                <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                {messages.length} messages
              </Badge>
              
              {/* Reset Chat Button - Updated with Trash2 icon */}
              <Button
                variant="ghost"
                size="icon"
                disabled={isResetting || messages.length === 0}
                onClick={() => setShowResetConfirmation(true)}
                className="text-gray-400 hover:text-white w-8 h-8 mr-1"
                aria-label="Reset chat"
                title="Reset chat"
              >
                <Trash2 className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCharacterDetails(true)}
                className="md:hidden text-gray-400 hover:text-white w-8 h-8"
                aria-label="Open character details"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Persona display as a separate section - only visible on mobile/small screens */}
          {currentPersona && (
            <div className="md:hidden mt-2 px-1">
              <div 
                className="flex items-center justify-between w-full px-3 py-1.5 rounded-md border"
                style={{ 
                  backgroundColor: `rgba(99, 102, 241, 0.15)`,
                  borderColor: `rgba(99, 102, 241, 0.4)`,
                  boxShadow: '0 1px 3px rgba(99, 102, 241, 0.2)'
                }}
              >
                <div className="flex items-center">
                  <Avatar className="h-5 w-5 mr-2 ring-1 ring-indigo-400/40">
                    <AvatarImage src={currentPersona.avatar || undefined} />
                    <AvatarFallback className="bg-indigo-600 text-[0.55rem] font-medium">
                      {currentPersona.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="text-[0.7rem] text-white font-medium mr-1.5">Your Persona:</span>
                      <span className="text-[0.7rem] text-indigo-300">{currentPersona.name}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="text-indigo-300 text-[0.6rem] border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0"
                >
                  Active
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-2 md:p-3 lg:p-4">
              {messages.length === 0 && !isStreaming && !sending && (
                <motion.div 
                  className="flex flex-col items-center justify-center text-center py-8 px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div 
                    className="p-3 rounded-full mb-4"
                    style={{ background: `linear-gradient(135deg, ${accentColor}40, ${dominantColor.replace('0.15', '0.3')})` }}
                  >
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Start a conversation</h3>
                  <p className="text-gray-300 mb-4 max-w-md">
                    Send your first message to begin chatting with {character.name}
                  </p>
                  <div 
                    className="px-4 py-3 rounded-lg border text-white text-sm"
                    style={{ 
                      background: `rgba(0, 0, 0, 0.4)`,
                      borderColor: dominantColor.replace('0.15', '0.3')
                    }}
                  >
                    <p>Try saying: <span className="italic text-gray-300">"{getRandomPrompt(character)}"</span></p>
                  </div>
                </motion.div>
              )}
              <div className="space-y-3 sm:space-y-3 md:space-y-4 min-h-full">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 sm:space-x-1.5 md:space-x-2 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] ${msg.role === 'USER' ? 'flex-row-reverse space-x-reverse sm:space-x-reverse md:space-x-reverse' : ''}`}>
                      {msg.role === 'AI' && (
                        <Avatar className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 flex-shrink-0">
                          <AvatarImage src={character.avatar || undefined} />
                          <AvatarFallback 
                            className="text-white text-[0.6rem] sm:text-xs"
                            style={{ background: accentColor }}
                          >
                            {character.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl sm:rounded-2xl break-words ${
                          msg.role === 'USER'
                            ? 'text-white'
                            : 'text-gray-100 border backdrop-blur-sm'
                        }`}
                        style={{
                          background: msg.role === 'USER' 
                            ? `linear-gradient(135deg, ${accentColor}, ${dominantColor.replace('0.15', '0.6')})` 
                            : `rgba(0, 0, 0, 0.4)`,
                          borderColor: msg.role === 'AI' ? dominantColor.replace('0.15', '0.3') : 'transparent',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        <p className="text-sm xs:text-base sm:text-sm md:text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.role === 'AI' ? formatMessageContent(msg.content) : msg.content}
                        </p>
                        <p className={`text-xs xs:text-xs sm:text-xs mt-1 ${msg.role === 'USER' ? 'text-white/80' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Streaming response - updated with Framer Motion animations */}
                {isStreaming && streamingContent && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-end space-x-2 sm:space-x-1.5 md:space-x-2 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%]">
                      <Avatar className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 flex-shrink-0">
                        <AvatarImage src={character.avatar || undefined} />
                        <AvatarFallback 
                          className="text-white text-[0.6rem] sm:text-xs"
                          style={{ background: accentColor }}
                        >
                          {character.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl sm:rounded-2xl break-words text-gray-100 border backdrop-blur-sm"
                        style={{
                          background: `rgba(0, 0, 0, 0.4)`,
                          borderColor: dominantColor.replace('0.15', '0.3'),
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-sm xs:text-base sm:text-sm md:text-sm leading-relaxed whitespace-pre-wrap">
                          {formatMessageContent(streamingContent)}
                        </p>
                        <p className="text-xs xs:text-xs sm:text-xs mt-1 text-gray-400">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {/* Typing indicator - also enhanced with Framer Motion */}
                <AnimatePresence>
                  {sending && !isStreaming && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-end space-x-2">
                        <Avatar className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 flex-shrink-0">
                          <AvatarImage src={character.avatar || undefined} />
                          <AvatarFallback 
                            className="text-white text-[0.6rem] sm:text-xs"
                            style={{ background: accentColor }}
                          >
                            {character.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className="px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 rounded-xl sm:rounded-2xl text-gray-100 border backdrop-blur-sm"
                          style={{
                            background: `rgba(0, 0, 0, 0.4)`,
                            borderColor: dominantColor.replace('0.15', '0.3')
                          }}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex space-x-1">
                            <motion.div 
                              className="w-2 h-2 bg-gray-300 rounded-full"
                              animate={{ scale: [0.8, 1.2, 0.8] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.2,
                                ease: "easeInOut" 
                              }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-300 rounded-full"
                              animate={{ scale: [0.8, 1.2, 0.8] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.2,
                                ease: "easeInOut",
                                delay: 0.4
                              }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-300 rounded-full"
                              animate={{ scale: [0.8, 1.2, 0.8] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.2,
                                ease: "easeInOut",
                                delay: 0.8
                              }}
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Updated with Textarea */}
        <div 
          className="p-2 sm:p-3 md:p-4 border-t backdrop-blur-sm flex-shrink-0"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, 0.4)`,
            borderColor: accentColor 
          }}
        >
          <div className="flex items-end space-x-1.5 sm:space-x-2 md:space-x-3 w-full relative py-1 md:py-0">
            <div className="relative flex-1 min-w-0">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message ${character.name}...`}
                className="resize-none rounded-lg sm:rounded-xl bg-black/30 border text-white placeholder-gray-400 
                  min-h-[40px] sm:min-h-[44px] md:min-h-[50px] max-h-32 pr-12 
                  focus:ring-2 text-xs sm:text-sm md:text-base backdrop-blur-sm w-full pt-3"
                style={{ 
                  borderColor: dominantColor.replace('0.15', '0.3'),
                  '--tw-ring-color': accentColor
                } as React.CSSProperties}
                rows={1}
                disabled={sending}
              />
              <div className="absolute right-3 bottom-2 text-xs text-gray-400 pointer-events-none">
                {message.length > 0 && sending && (
                  <div className="animate-pulse">Sending...</div>
                )}
              </div>
            </div>
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={sending || message.trim() === ''}
              className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-white flex-shrink-0 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${dominantColor.replace('0.15', '0.6')})`
              }}
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center hidden sm:block">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>

        {/* Reset Confirmation AlertDialog - Updated from Dialog to AlertDialog */}
        <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
          <AlertDialogContent className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Reset Conversation
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will delete all current messages in this chat. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel 
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={() => setShowResetConfirmation(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={resetChat} 
                disabled={isResetting}
                className="bg-gradient-to-br from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 hover:shadow-lg text-white focus:ring-red-500 transition-all duration-200"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Chat"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}

export default ChatBox;