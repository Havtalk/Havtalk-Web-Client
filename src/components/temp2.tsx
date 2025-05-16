"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Star } from "lucide-react";
import Image from "next/image";

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
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20 h-auto min-h-[90vh] flex items-center">
      {/* Background elements - enhanced and repositioned */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-primary/10 blur-2xl"></div>
      
      {/* Character images - repositioned for vertical layout */}
      <div className="absolute left-[5%] top-24 h-36 w-36 animate-float hidden lg:block z-20">
        <div className="h-full w-full relative overflow-hidden rounded-full shadow-lg neo-border">
          <Image 
            src="/spacecaptain.png" 
            alt="Space Captain" 
            fill 
            className="object-cover"
            style={{ transform: "scale(1.1)" }}
          />
        </div>
      </div>
      <div className="absolute right-[10%] top-[30%] h-44 w-44 animate-float hidden lg:block z-20" style={{ animationDelay: "1s" }}>
        <div className="h-full w-full relative overflow-hidden rounded-full shadow-lg neo-border">
          <Image 
            src="/knight.png" 
            alt="Knight" 
            fill 
            className="object-cover"
            style={{ transform: "scale(1.1)" }}
          />
        </div>
      </div>
      
      {/* Additional floating character for visual balance */}
      <div className="absolute left-[15%] bottom-[20%] h-28 w-28 animate-float hidden lg:block z-20" style={{ animationDelay: "1.8s" }}>
        <div className="h-full w-full relative overflow-hidden rounded-full shadow-lg neo-border">
          <Image 
            src="/spacecaptain.png" 
            alt="Space Captain" 
            fill 
            className="object-cover"
            style={{ transform: "scale(1.1)" }}
          />
        </div>
      </div>
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-center gap-10 md:gap-14">
          {/* Text content - enhanced with better spacing */}
          <div className="max-w-2xl text-center">
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Automate Your</span>
              <span className="mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Telegram Experience
              </span>
            </h1>
            <p className="mt-6 font-body text-lg md:text-xl text-foreground/80 max-w-xl mx-auto">
              HavTalk transforms how you use Telegram with powerful automation, 
              smart replies, and seamless integration. Build your perfect bot 
              without writing a single line of code.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Button 
                size="lg" 
                className="neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-base px-6 py-6"
                style={{
                  boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none text-base px-6 py-6"
              >
                View Demo
              </Button>
            </div>
            
            <div className="mt-8 flex flex-col items-center justify-center space-y-3">
              <p className="flex items-center text-base text-muted-foreground">
                <Star className="mr-2 h-5 w-5 text-secondary" fill="currentColor" />
                <span>Trusted by 10,000+ users worldwide</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center rounded-md neo-border bg-card px-4 py-2">
                  <Sparkles className="mr-2 h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center rounded-md neo-border bg-card px-4 py-2">
                  <MessageSquare className="mr-2 h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D mockup - enhanced with better sizing and positioning */}
          <div
            ref={mockupRef}
            className="hero-mockup relative w-full max-w-[320px] md:max-w-[360px] transition-all duration-300 ease-out mt-4 mb-8"
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
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-[#1c2a39] p-2">
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
                    <div className="flex">
                      <div className="mr-1 h-6 w-6 flex-shrink-0 rounded-full bg-primary"></div>
                      <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-[#2b5278] p-2 text-xs text-white">
                        👋 Hi there! I'm HavTalk. How can I help you today?
                      </div>
                    </div>
                    
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
            
            {/* Floating notification - enhanced with character image */}
            <div className="neo-border absolute -right-6 top-20 w-36 animate-float rounded-lg bg-white p-2 shadow-lg dark:bg-[#1c2a39] hidden md:block" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
              <div className="flex items-start">
                <div className="mr-2 h-8 w-8 flex-shrink-0 rounded-full bg-primary relative overflow-hidden">
                  <Image 
                    src="/spacecaptain.png" 
                    alt="Space Captain" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">HavTalk Bot</div>
                  <div className="text-xs text-foreground/70">Meeting reminder: Call with Team</div>
                </div>
              </div>
            </div>
            
            {/* Floating analytics card - enhanced with character image */}
            <div className="neo-border absolute -left-8 bottom-16 w-32 animate-float rounded-lg bg-white p-2 shadow-lg dark:bg-[#1c2a39] hidden md:block" style={{ animationDelay: "1.5s", transformStyle: "preserve-3d", transform: "translateZ(40px)" }}>
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 flex-shrink-0 rounded-full relative overflow-hidden">
                  <Image 
                    src="/knight.png" 
                    alt="Knight" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-xs font-medium text-foreground">Bot Analytics</div>
              </div>
              <div className="mt-2 flex items-center">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-3/4 rounded-full bg-primary"></div>
                </div>
                <span className="ml-1 text-xs font-medium">75%</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-foreground/70">
                <span>Rate</span>
                <span className="font-medium text-accent">↑12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
