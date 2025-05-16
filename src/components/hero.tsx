"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !charactersRef.current) return;
      if (window.innerWidth < 768) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      setMousePosition({
        x: (clientX / innerWidth) * 2 - 1,
        y: (clientY / innerHeight) * 2 - 1,
      });

      const characters = charactersRef.current.children;
      for (let i = 0; i < characters.length; i++) {
        const character = characters[i] as HTMLElement;
        const speed = parseFloat(character.dataset.speed || "0.15");
        const offsetX = mousePosition.x * speed * 20;
        const offsetY = mousePosition.y * speed * 20;
        character.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mousePosition]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-20 h-auto min-h-[100vh] md:min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black"
    >
      {/* Enhanced background elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-primary/10 blur-2xl"></div>

      {/* Parallax background */}
      {/* <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background.jpg')" }}></div> */}

      {/* Characters */}
      <div ref={charactersRef} className="absolute inset-0 pointer-events-none z-0">
        {/* Character 1 - Left Side - Now hidden on medium screens where content would overlap */}
        <div
          className="absolute hidden xl:block lg:top-1/2 lg:left-[10%] transition-transform duration-300 ease-out lg:-translate-y-1/2"
          data-speed="0.15"
        >
          <Image
            src="/download (8).png"
            alt="AI Character"
            width={300}
            height={300}
            className="drop-shadow-glow"
            priority
          />
          {/* Text Bubble */}
          {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-md shadow-black/50 max-w-xs">
            <p className="text-sm text-white font-medium">"Let's explore endless storylines together!"</p>
          </div> */}
          {/* Shadow beneath the character */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent blur-lg shadow-lg shadow-black/50"></div>
        </div>

        {/* Character 2 - Right Side - Now hidden on medium screens where content would overlap */}
        <div
          className="absolute hidden xl:block lg:top-1/2 lg:right-[10%] transition-transform duration-300 ease-out lg:-translate-y-1/2"
          data-speed="0.15"
        >
          <Image
            src="/download(1).png"
            alt="AI Character"
            width={300}
            height={300}
            className="drop-shadow-glow animate-float-delayed"
            priority
          />
          {/* Text Bubble */}
          {/* <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-md shadow-black/50 max-w-xs">
            <p className="text-sm text-white font-medium">"I'm here to build meaningful connections."</p>
          </div> */}
          {/* Shadow beneath the character */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent blur-lg shadow-lg shadow-black/50"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="container relative z-10 flex justify-center ">
        <div className="max-w-3xl text-center px-4">
          <h1 className=" font-display text-3xl font-black tracking-tight sm:text-5xl md:text-6xl relative inline-block">
            <span className="block ">Immersive AI</span>
            <span className=" bg-black/30 mt-2 block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Roleplay Experience
            </span>
            <div className="absolute -top-6 -right-6 text-4xl">✨</div>
          </h1>

          <p className=" mt-6 font-body text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto text-shadow-sm">
            Create meaningful connections with AI characters in rich, dynamic conversations. Explore endless storylines and build relationships with characters that{" "}
            <span className="text-primary font-semibold">feel real</span> and respond naturally.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <Button
              size="lg"
              className="w-full md:w-auto neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              style={{
                boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
              }}
            >
              Start Chatting
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Button>
            <Button variant="outline" size="lg" className="w-full md:w-auto neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Meet Characters
            </Button>
          </div>

          {/* Trust indicators */}
          {/* <div className="mt-8 md:mt-10 flex flex-col items-center justify-center space-y-4">
            <p className="flex items-center text-sm text-muted-foreground">
              <Star className="mr-2 h-4 w-4 text-secondary" fill="currentColor" />
              <span>Trusted by 10,000+ users worldwide</span>
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-center rounded-md neo-border bg-card px-3 py-1">
                <Sparkles className="mr-2 h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center justify-center rounded-md neo-border bg-card px-3 py-1">
                <MessageSquare className="mr-2 h-4 w-4 text-accent" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Improved Bottom Section */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-gray-900/80 to-transparent">
        {/* Improved Animated Waves */}
        <svg className="absolute bottom-0 w-full h-24 text-gray-900/50 opacity-70">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(64, 64, 64, 0.3)" />
              <stop offset="50%" stopColor="rgba(32, 32, 32, 0.5)" />
              <stop offset="100%" stopColor="rgba(64, 64, 64, 0.3)" />
            </linearGradient>
          </defs>
          <path
            d="M0 20 C200 40, 400 0, 600 20 C800 40, 1000 0, 1200 20 C1400 40, 1600 0, 1800 20 L1800 100 L0 100 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
          ></path>
          <path
            d="M0 40 C300 60, 600 20, 900 40 C1200 60, 1500 20, 1800 40 L1800 100 L0 100 Z"
            fill="url(#waveGradient)"
            opacity="0.6"
            className="animate-wave-slow"
          ></path>
        </svg>

        {/* Enhanced Character Cards */}
        <div className="absolute inset-x-0 bottom-0 h-48 flex justify-center items-end">
          <div className="container flex justify-between items-end px-4 pb-6 md:pb-8">
            {/* Left Character Card */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-md"></div>
              <Image
                src="/spacecaptain-3d.png"
                alt="Space Captain Character"
                width={200}
                height={200}
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-float"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            
            {/* Center Decoration */}
            <div className="hidden md:block absolute left-1/2 bottom-8 transform -translate-x-1/2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-md opacity-60 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="block md:hidden absolute left-1/2 bottom-8  -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 transform transition-all duration-300 hover:scale-105">
              {/* <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-md opacity-60 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div> */}
              <Image
                src="/ac2c7581-2a42-46b1-9d6d-6cb45ded1440_removalai_preview.png"
                alt="Detective Character"
                width={150}
                height={150}
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-float-delayed"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            
            {/* Right Character Card */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-secondary/20 to-transparent blur-md"></div>
              <Image
                src="/detective-3d.png"
                alt="Detective Character"
                width={200}
                height={200}
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-float-delayed"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Enhanced Light Trails */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary via-secondary to-accent opacity-60 animate-pulse"></div>
        <div className="absolute inset-x-0 bottom-1 h-px bg-gradient-to-r from-accent via-primary to-secondary opacity-40 animate-pulse-slow"></div>
      </div>
    </section>
  );
}