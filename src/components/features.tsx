"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Bot, 
  Calendar, 
  Database, 
  Layers, 
  MessageSquare, 
  Settings, 
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  colorDark: string;
  details: string[];
}

function FeatureCard({ icon, title, description, color, colorDark, details }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={cn(
        "neo-border group relative h-full overflow-hidden rounded-lg bg-card transition-all duration-300",
        "hover:-translate-y-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderColor: "var(--border)",
        boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
      }}
    >
      {/* Background Gradient Effect */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20" 
        style={{ 
          background: `radial-gradient(circle at top left, ${color}, transparent 70%)`,
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Icon Background */}
        <div 
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-md"
          style={{ 
            backgroundColor: `${color}20`, 
            color: color 
          }}
        >
          {icon}
        </div>
        
        <h3 className="mb-2 font-display text-xl font-bold">{title}</h3>
        <p className="text-foreground/70">{description}</p>
        
        {/* Details on hover */}
        <div 
          className={cn(
            "mt-6 overflow-hidden transition-all duration-300",
            isHovered ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <ul className="space-y-2 text-sm">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span 
                  className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Bottom accent bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 w-full transition-all duration-500 group-hover:h-2"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}

export function Features() {
  const features: FeatureCardProps[] = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Lifelike Conversations",
      description: "Chat with AI characters that respond naturally and remember your interactions",
      color: "#FF5757", // primary
      colorDark: "#FF5757",
      details: [
        "Advanced natural language processing for realistic dialogue",
        "Contextual memory that recalls past conversations",
        "Emotional responses that match the conversation tone",
        "Support for multiple languages and communication styles"
      ]
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Diverse Characters",
      description: "Explore a wide range of AI personalities to match your interests",
      color: "#FFE147", // secondary
      colorDark: "#FFE147",
      details: [
        "Characters from various genres and backgrounds",
        "Unique personalities with distinct conversation styles",
        "Characters with specialized knowledge and interests",
        "Regular additions to our character library"
      ]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Ongoing Storylines",
      description: "Engage in continuous narratives that evolve with each conversation",
      color: "#47A8FF", // accent
      colorDark: "#47A8FF",
      details: [
        "Persistent storylines that continue across sessions",
        "Character relationships that develop over time",
        "Branching narratives based on your choices",
        "Ability to reset or modify storylines as desired"
      ]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Personalized Experience",
      description: "AI adapts to your preferences and conversation style",
      color: "#FF8947", // chart-4
      colorDark: "#FF8947",
      details: [
        "Characters learn from your interaction patterns",
        "Customizable conversation topics and boundaries",
        "Adjustable personality traits for each character",
        "Privacy-focused design with user control over data"
      ]
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Voice Conversations",
      description: "Speak naturally with your AI companions using advanced voice technology",
      color: "#9747FF", // chart-5
      colorDark: "#9747FF",
      details: [
        "High-quality text-to-speech for immersive experience",
        "Voice input for hands-free interaction",
        "Multiple voice options for each character",
        "Voice emotion detection for responsive interactions"
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Response Time",
      description: "Enjoy quick, thoughtful replies without long waiting periods",
      color: "#FF5757", // primary
      colorDark: "#FF5757",
      details: [
        "Optimized AI processing for minimal latency",
        "Smart caching for frequently discussed topics",
        "Balanced response length for natural conversation flow",
        "Consistent performance even during peak usage times"
      ]
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Cross-Platform Access",
      description: "Chat with your AI companions wherever you are",
      color: "#FFE147", // secondary
      colorDark: "#FFE147",
      details: [
        "Seamless experience across web and mobile devices",
        "Synchronized conversations between platforms",
        "Offline mode for continued conversations anywhere",
        "Desktop notifications for new messages"
      ]
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "User Control",
      description: "Customize your experience with extensive personalization options",
      color: "#47A8FF", // accent
      colorDark: "#47A8FF",
      details: [
        "Content filtering and safety settings",
        "Conversation history management",
        "Interface customization and accessibility options",
        "Subscription tiers with additional features"
      ]
    },
  ];

  return (
    <section id="features" className="relative py-24">
      {/* Background Elements */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Features
          </div>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl md:text-5xl">
            Your AI Roleplay Companions
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Immerse yourself in meaningful conversations with AI characters that feel real,
            respond naturally, and remember your shared experiences.
          </p>
        </div>
        
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              colorDark={feature.colorDark}
              details={feature.details}
            />
          ))}
        </div>
        
        {/* Extended Feature Highlight */}
        <div className="neo-border mt-24 overflow-hidden rounded-lg bg-card p-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-black sm:text-3xl">
                Immersive AI Conversations, <br />Just Like Talking to a Friend
              </h3>
              <p className="mt-4 text-foreground/70">
                Our AI characters provide engaging, meaningful conversations that feel natural and responsive.
                Whether you're looking for companionship, roleplay, or just interesting discussions, our AI is here for you.
              </p>
              
              <ul className="mt-8 space-y-4">
                {[
                  "Characters remember your conversations and preferences",
                  "Natural dialogue with emotional understanding",
                  "Engaging storylines that adapt to your interests",
                  "Safe, private environment for all types of roleplay"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1 h-5 w-5 flex-shrink-0 rounded-full bg-primary"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Chat Interface Mockup */}
            <div className="neo-border relative min-h-[300px] overflow-hidden rounded-lg bg-black/90 p-4">
              {/* Mockup of a chat interface */}
              <div className="h-full w-full rounded bg-black p-2">
                <div className="mb-4 border-b border-gray-800 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-6 w-6 rounded-full bg-accent"></div>
                      <div className="text-sm font-medium text-white">Aria - Sci-Fi Explorer</div>
                    </div>
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex">
                    <div className="mr-2 h-6 w-6 rounded-full bg-accent"></div>
                    <div className="max-w-[70%] rounded-lg rounded-tl-none bg-gray-800 p-2 text-xs text-white">
                      Welcome back! I've been thinking about our last adventure. Ready to continue exploring the abandoned space station?
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="max-w-[70%] rounded-lg rounded-tr-none bg-primary/30 p-2 text-xs text-white">
                      Yes! I'm curious about what's behind that locked door we found.
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-2 h-6 w-6 rounded-full bg-accent"></div>
                    <div className="max-w-[70%] rounded-lg rounded-tl-none bg-gray-800 p-2 text-xs text-white">
                      I've been analyzing the security panel. I think we can bypass it using the access codes we found in the captain's quarters. Let me try...
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center rounded-full bg-gray-900 p-2">
                    <input type="text" className="flex-1 bg-transparent text-xs text-white outline-none" placeholder="Type your message..." />
                    <div className="ml-2 h-5 w-5 rounded-full bg-primary"></div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/30 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-accent/30 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 