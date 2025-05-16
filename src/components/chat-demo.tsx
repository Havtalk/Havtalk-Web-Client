"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Maximize, Minimize, Bot, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hi there! I'm HavTalk Bot. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample responses for demo purposes
  const botResponses: Record<string, string[]> = {
    default: [
      "I'm not sure I understand. Could you rephrase that?",
      "That's interesting! Tell me more about what you're looking for.",
      "I'm here to help with your Telegram automation needs.",
    ],
    greeting: [
      "Hello! How can I assist you today?",
      "Hi there! Looking for help with Telegram bots?",
      "Hey! I'm your HavTalk assistant. What can I do for you?",
    ],
    help: [
      "I can help you schedule messages, set up automations, answer customer queries, and more. What are you interested in?",
      "Need help with HavTalk? I can assist with bot creation, automation, or scheduling. Just let me know!",
      "I'm here to help! Would you like to know about our features, pricing, or how to get started?",
    ],
    features: [
      "HavTalk offers Smart Replies, Scheduling, Chatbot Builder, Data Integration, Analytics, Automation, Multi-Platform support, and extensive Customization. Which feature would you like to learn more about?",
      "Our top features include AI-powered responses, visual bot builder, and detailed analytics. Would you like me to explain any of these in detail?",
    ],
    pricing: [
      "We offer three plans: Starter ($9/mo), Pro ($29/mo), and Enterprise ($99/mo). Each offers different message limits and features. Would you like me to break down what's included in each?",
      "Our pricing starts at $9/month for the Starter plan, with Pro at $29/mo and Enterprise at $99/mo. All plans come with a 14-day free trial!",
    ],
  };
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Process user message and generate bot response
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Determine response category based on message content
    const lowercaseMsg = message.toLowerCase();
    let responseCategory = "default";
    
    if (lowercaseMsg.match(/hi|hello|hey|greetings/)) {
      responseCategory = "greeting";
    } else if (lowercaseMsg.match(/help|assist|support/)) {
      responseCategory = "help";
    } else if (lowercaseMsg.match(/features|capabilities|what can you do|functions/)) {
      responseCategory = "features";
    } else if (lowercaseMsg.match(/pricing|cost|price|how much|plan/)) {
      responseCategory = "pricing";
    }
    
    // Get random response from the appropriate category
    const responses = botResponses[responseCategory];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Simulate delayed response
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div
      className={cn(
        "neo-border fixed right-4 z-50 w-80 overflow-hidden rounded-lg bg-card shadow-xl transition-all duration-300 sm:w-96",
        isMinimized ? "bottom-4 h-14" : "bottom-4 h-[500px] max-h-[80vh]"
      )}
    >
      {/* Chat header */}
      <div className="flex h-14 items-center justify-between bg-primary px-4 text-white">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">HavTalk Bot</h3>
            <p className="text-xs opacity-80">Demo Chat</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 transition-colors hover:text-white"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 transition-colors hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages container */}
          <div className="flex h-[calc(100%-112px)] flex-col overflow-y-auto p-4">
            <div className="flex-1 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[80%]",
                    msg.sender === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {msg.sender === "bot" && (
                    <div className="mr-2 h-8 w-8 flex-shrink-0 rounded-full bg-primary"></div>
                  )}
                  
                  <div>
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        msg.sender === "user"
                          ? "neo-border bg-accent/10 text-right"
                          : "neo-border bg-muted/30"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className="mt-1 text-xs text-foreground/50">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  
                  {msg.sender === "user" && (
                    <div className="ml-2 h-8 w-8 flex-shrink-0 rounded-full bg-accent"></div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex max-w-[80%]">
                  <div className="mr-2 h-8 w-8 flex-shrink-0 rounded-full bg-primary"></div>
                  <div className="neo-border rounded-lg bg-muted/30 p-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "0ms" }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "150ms" }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Message input */}
          <div className="absolute bottom-0 left-0 w-full bg-card p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="neo-border flex-1"
              />
              <Button 
                type="submit" 
                size="icon"
                className="neo-border h-10 w-10 flex-shrink-0 bg-primary text-white hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
} 