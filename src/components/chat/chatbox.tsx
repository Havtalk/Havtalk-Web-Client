'use client';
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ChevronsRight, MessageSquare, Send } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { BaseUrl } from '@/lib/utils';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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


function ChatBox({character, messages: initialMessages, sessionId, accentColor, dominantColor, showCharacterDetails, setShowCharacterDetails}:{
    character: Character;
    messages?: Message[];
    sessionId: string;
    accentColor: string;
    dominantColor: string;
    showCharacterDetails: boolean;
    setShowCharacterDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [streamingContent, setStreamingContent] = useState<string>("");
    const [isStreaming, setIsStreaming] = useState(false);

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
            const response = await axios({
              method: 'post',
              url: `${BaseUrl}/chatsession/${sessionId}/message/stream`,
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
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`${BaseUrl}/chatsession/${sessionId}`, {
          withCredentials: true,
        });
        console.log('Chat session data:', response.data);
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
          let processedText = part;
          
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

  return (
    <div className="w-full md:w-[calc(100%-320px)] lg:w-[calc(100%-360px)] xl:w-[calc(100%-400px)] h-full flex flex-col backdrop-blur-sm transition-all duration-300 min-h-0">
        {/* Chat Header */}
        <div 
          className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b backdrop-blur-sm flex-shrink-0"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, 0.4)`,
            borderColor: accentColor 
          }}
        >
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
           
            
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10">
              <AvatarImage src={character.avatar || undefined} />
              <AvatarFallback 
                className="text-white text-[0.65rem] sm:text-xs md:text-sm"
                style={{ background: accentColor }}
              >
                {character.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex">
              <div>
                <h2 className="font-semibold text-white text-xs sm:text-sm md:text-base line-clamp-1 max-w-[150px] sm:max-w-[200px]">{character.name}</h2>
                <div className="text-[0.65rem] sm:text-xs md:text-sm text-green-400 flex items-center">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 md:mr-2"></div>
                  Online
                </div>
                
              </div>
              
            </div>
          </div>
          <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCharacterDetails(true)}
                className="md:hidden text-gray-400 hover:text-white w-8 h-8"
                aria-label="Open character details"
              >
                <ChevronsRight className="w-4 h-4" />
          </Button>
          <Badge 
            variant="outline" 
            className="text-gray-300 text-[0.65rem] sm:text-xs md:text-sm hidden lg:flex"
            style={{ borderColor: accentColor }}
          >
            <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            {messages.length} messages
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
            <div className="p-2 md:p-3 lg:p-4">
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

        {/* Message Input */}
        <div 
          className="p-2 sm:p-3 md:p-4 border-t backdrop-blur-sm flex-shrink-0"
          style={{ 
            backgroundColor: `rgba(0, 0, 0, 0.4)`,
            borderColor: accentColor 
          }}
        >
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 w-full">
            <div className="relative flex-1 min-w-0">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="border text-white placeholder-gray-400 h-9 sm:h-10 md:h-12 rounded-lg sm:rounded-xl focus:ring-2 text-xs sm:text-sm md:text-base backdrop-blur-sm w-full"
                disabled={sending}
                style={{ 
                  backgroundColor: `rgba(0, 0, 0, 0.3)`,
                  borderColor: dominantColor.replace('0.15', '0.3'),
                  '--tw-ring-color': accentColor
                } as React.CSSProperties}
              />
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
        </div>
      </div>
  )
}

export default ChatBox;