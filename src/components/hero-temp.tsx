"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight} from "lucide-react";
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
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20 h-auto min-h-[100vh] flex items-center">
      {/* Background elements - enhanced and repositioned */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-primary/10 blur-2xl"></div>
      
      
      
      <div className="container relative z-10" >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-14">
          <div className="flex flex-col items-center justify-center gap-10 md:gap-14 lg:w-1/2  mt-12 md:mt-0 lg:pb-32">
          <div className=" relative max-w-2xl text-center lg:text-left w-full">
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-5xl md:text-6xl relative">
                <span className="block">Immersive AI</span>
                <span className="mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                  Roleplay Experience
                </span>
                <div className="absolute -top-6 -right-6 text-4xl hidden lg:block">✨</div>
              </h1>
              <p className="mt-6 font-body text-xl text-foreground/80 leading-relaxed">
                Create meaningful connections with AI characters in rich, 
                dynamic conversations. Explore endless storylines and build 
                relationships with characters that <span className="text-primary font-semibold">feel real</span> and respond naturally.
              </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button 
                size="lg" 
                className="neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                style={{
                  boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
                }}
              >
                Start Chatting
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Meet Characters
              </Button>
            </div>
            
            {/* Trust indicators */}
            {/* <div className="mt-10 flex flex-col items-center justify-center space-y-4 lg:items-start">
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
            </div> */}
          </div>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <Image src="/mockup.png" alt="AI Roleplay Mockup" width={400} height={400} />
            {/* <Image src="/mockup.png" alt="HavTalk Mockup" width={300} height={300} /> */}

          </div>
          
          
          
        </div>
      </div>
    </section>
  );
} 