"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Star } from "lucide-react";

export function Hero() {
  const mockupRef = useRef<HTMLDivElement>(null);
  
  // Add 3D rotation effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mockupRef.current) return;
      
      // Only apply effects on larger screens
      if (window.innerWidth < 768) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate rotation based on mouse position
      const rotateX = (clientY / innerHeight - 0.5) * 10; // -5 to 5 degrees
      const rotateY = (clientX / innerWidth - 0.5) * -10; // -5 to 5 degrees
      
      mockupRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      {/* Background elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
      
      {/* Geometric shapes - hidden on mobile */}
      <div className="absolute left-[10%] top-24 h-16 w-16 animate-float hidden sm:block">
        <div className="h-full w-full rotate-45 bg-primary neo-border"></div>
      </div>
      <div className="absolute right-[15%] top-40 h-20 w-20 rounded-full animate-float hidden sm:block" style={{ animationDelay: "1s" }}>
        <div className="h-full w-full rounded-full bg-secondary neo-border"></div>
      </div>
      <div className="absolute bottom-32 left-[20%] h-12 w-12 animate-float hidden sm:block" style={{ animationDelay: "2s" }}>
        <div className="h-0 w-0 border-l-[24px] border-r-[24px] border-t-[40px] border-l-transparent border-r-transparent border-t-accent"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Text content */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Automate Your</span>
              <span className="mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Telegram Experience
              </span>
            </h1>
            <p className="mt-6 font-body text-xl text-foreground/80">
              HavTalk transforms how you use Telegram with powerful automation, 
              smart replies, and seamless integration. Build your perfect bot 
              without writing a single line of code.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button 
                size="lg" 
                className="neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                style={{
                  boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                View Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-10 flex flex-col items-center justify-center space-y-4 lg:items-start">
              <p className="flex items-center text-sm text-muted-foreground">
                <Star className="mr-2 h-4 w-4 text-secondary" fill="currentColor" />
                <span>Trusted by 10,000+ users worldwide</span>
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center rounded-md neo-border bg-card px-3 py-1">
                  <Sparkles className="mr-2 h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center rounded-md neo-border bg-card px-3 py-1">
                  <MessageSquare className="mr-2 h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D mockup */}
          <div
            ref={mockupRef}
            className="hero-mockup relative w-full max-w-md transition-all duration-300 ease-out lg:max-w-lg"
            style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
          >
            {/* Main phone mockup */}
            <div className="neo-border relative overflow-hidden rounded-[36px] bg-[#242424] shadow-xl transition-all">
              {/* Phone content */}
              <div className="aspect-[9/19] overflow-hidden">
                {/* Phone top notch */}
                <div className="absolute left-1/2 top-3 z-10 h-6 w-32 -translate-x-1/2 rounded-full bg-black"></div>
                
                {/* Telegram interface */}
                <div className="h-full w-full bg-[#17212b] p-3">
                  {/* Status bar */}
                  <div className="mb-3 flex items-center justify-between px-2 pt-2 text-xs text-white/80">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-white/80"></div>
                      <div className="h-2 w-2 rounded-full bg-white/80"></div>
                      <div className="h-2 w-2 rounded-full bg-white/80"></div>
                      <div className="h-2 w-2 rounded-full bg-white/80"></div>
                    </div>
                  </div>
                  
                  {/* Telegram header */}
                  <div className="mb-2 flex items-center justify-between rounded-lg bg-[#1c2a39] p-2">
                    <div className="flex items-center">
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <span className="text-sm font-bold text-white">HT</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">HavTalk Bot</div>
                        <div className="text-xs text-white/60">online</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-white/80">
                      <div className="h-4 w-4 rounded-full border border-white/80"></div>
                      <div className="h-1 w-1 rounded-full bg-white/80"></div>
                      <div className="h-1 w-1 rounded-full bg-white/80"></div>
                      <div className="h-1 w-1 rounded-full bg-white/80"></div>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="space-y-3">
                    {/* Bot messages */}
                    <div className="flex">
                      <div className="mr-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary"></div>
                      <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-[#2b5278] p-2 text-xs text-white">
                        👋 Hi there! I'm HavTalk. How can I help you today?
                      </div>
                    </div>
                    
                    {/* User messages */}
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-[#8774e1] p-2 text-xs text-white">
                        I need to schedule a meeting for tomorrow
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary"></div>
                      <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-[#2b5278] p-2 text-xs text-white">
                        Sure! What time works best for you? 🕒
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-[#8774e1] p-2 text-xs text-white">
                        2pm please
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary"></div>
                      <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-[#2b5278] p-2 text-xs text-white">
                        <p>✅ Meeting scheduled for tomorrow at 2:00 PM</p>
                        <p className="mt-1">I've added it to your calendar and will remind you 30 minutes before.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary"></div>
                      <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-[#2b5278] p-2 text-xs text-white">
                        Would you like me to set up any other reminders? 🔔
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat input */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center rounded-full bg-[#1c2a39] p-2">
                      <div className="mx-1 h-5 w-5 rounded-full bg-white/20"></div>
                      <div className="flex-1 px-2 text-xs text-white/60">Message</div>
                      <div className="mx-1 h-5 w-5 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating notification - hidden on small screens */}
            <div className="neo-border absolute -right-8 top-24 w-64 animate-float rounded-lg bg-white p-3 shadow-lg dark:bg-[#1c2a39] hidden md:block" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
              <div className="flex items-start">
                <div className="mr-2 h-10 w-10 flex-shrink-0 rounded-full bg-primary"></div>
                <div>
                  <div className="font-medium text-foreground">HavTalk Bot</div>
                  <div className="text-sm text-foreground/70">Meeting reminder: Call with Team in 30 minutes</div>
                </div>
              </div>
            </div>
            
            {/* Floating analytics card - hidden on small screens */}
            <div className="neo-border absolute -left-16 bottom-20 w-56 animate-float rounded-lg bg-white p-3 shadow-lg dark:bg-[#1c2a39] hidden md:block" style={{ animationDelay: "1.5s", transformStyle: "preserve-3d", transform: "translateZ(40px)" }}>
              <div className="text-sm font-medium text-foreground">Bot Analytics</div>
              <div className="mt-2 flex items-center">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-3/4 rounded-full bg-primary"></div>
                </div>
                <span className="ml-2 text-xs font-medium">75%</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-foreground/70">
                <span>Response Rate</span>
                <span className="font-medium text-accent">↑ 12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 