"use client";

import React, {useRef} from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  
  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-16 pb-32 md:pt-20 md:pb-20 h-auto min-h-[100vh] md:min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black"
    >
      {/* Enhanced background elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-hero-primary/20 blur-3xl"></div>
      <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-hero-secondary/20 blur-3xl"></div>
      <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-hero-accent/20 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 h-48 w-48 rounded-full bg-primary/10 blur-2xl"></div>
      {/* Characters */}
      <div ref={charactersRef} className="absolute inset-0  z-0">
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
          
          {/* Shadow beneath the character */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent blur-lg shadow-lg shadow-black/50"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="container relative z-10 flex justify-center mb-16 md:mb-0">
        <div className="max-w-3xl text-center px-4">
          <h1 className="font-display text-5xl font-black tracking-tight sm:text-5xl md:text-6xl relative inline-block">
            <span className="block">Talk to Legends.</span>
            <span className="bg-black/30 mt-2 block bg-gradient-to-r from-hero-primary via-hero-secondary to-hero-accent bg-clip-text text-transparent animate-gradient">
              Shape the Story.
            </span>
            <div className="absolute -top-6 -right-6 text-4xl">✨</div>
          </h1>

          <p className="mt-6 font-body text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto text-shadow-sm">
            Step into immersive, lifelike conversations with iconic AI characters. Build emotional connections, rewrite destinies, and experience stories that{" "}
            <span className="text-hero-primary font-semibold">respond and evolve</span> — with you at the heart.
          </p>


            <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
            <Link
              href="/auth/register"
              className="w-full md:w-auto"
            >
              <Button
              size="lg"
              className="w-full md:w-auto neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              style={{
                boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
              }}
              >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
            </Link>
            <Link
              href="/auth/login"
              className="w-full md:w-auto"
            >
              <Button size="lg" className="w-full md:w-auto bg-white/10 hover:bg-white/20 neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Login
              </Button>
            </Link>
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
        <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 flex justify-center items-end">
          <div className="container flex justify-between items-end px-4 pb-2 md:pb-8">
            {/* Left Character Card */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 transform transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-hero-primary/20 to-transparent blur-md"></div>
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-hero-primary via-hero-secondary to-hero-accent blur-md opacity-60 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="block md:hidden absolute left-1/2 bottom-8  -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 transform transition-all duration-300 hover:scale-105">
              {/* <div className="w-16 h-16 rounded-full bg-gradient-to-r from-hero-primary via-hero-secondary to-hero-accent blur-md opacity-60 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div> */}
              <Image
                src="/landing/middle-bottom2.png"
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-hero-secondary/20 to-transparent blur-md"></div>
              <Image
                src="/detective-3d.png"
                alt="Detective Character"
                width={200}
                height={200}
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-float"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Enhanced Light Trails */}
        {/* <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-hero-primary via-hero-secondary to-hero-accent opacity-60 animate-pulse"></div>
        <div className="absolute inset-x-0 bottom-1 h-px bg-gradient-to-r from-hero-accent via-hero-primary to-hero-secondary opacity-40 animate-pulse-slow"></div> */}
      </div>
    </section>
  );
}