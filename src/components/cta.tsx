"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointerClick, Sparkles, Zap } from "lucide-react";

export function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !floatingElementsRef.current) return;
      
      const elements = floatingElementsRef.current.querySelectorAll('.floating-element');
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const moveX = (e.clientX - centerX) / 20;
      const moveY = (e.clientY - centerY) / 20;
      
      elements.forEach((el, i) => {
        const depth = parseFloat((el as HTMLElement).dataset.depth || "1");
        const element = el as HTMLElement;
        element.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-24">
      {/* Gradient background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
        }}
      />
      
      <div ref={containerRef} className="container relative z-10">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-lg neo-border bg-card py-16">
          {/* Floating Elements */}
          <div ref={floatingElementsRef} className="absolute inset-0 z-0 overflow-hidden">
            <div 
              className="floating-element absolute -right-10 -top-10 h-40 w-40 rounded-full border-8 border-dashed border-primary/20 opacity-60"
              data-depth="1.5"
            />
            <div 
              className="floating-element absolute -bottom-20 -left-20 h-40 w-40 rotate-12 rounded-lg border-8 border-primary/20 opacity-60"
              data-depth="2"
            />
            <div 
              className="floating-element absolute bottom-10 right-10 h-16 w-16 rotate-45 bg-secondary/20"
              data-depth="1.2"
            />
            <div 
              className="floating-element absolute left-1/4 top-1/4 h-12 w-12 rounded-full bg-accent/20"
              data-depth="2.5"
            />
            <div 
              className="floating-element absolute bottom-20 left-20 h-10 w-10 rotate-45 bg-primary/30"
              data-depth="1.8"
            />
            <div 
              className="floating-element absolute right-1/3 top-10 h-8 w-8 rounded-full border-4 border-accent/30"
              data-depth="3"
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 mx-auto px-6 text-center">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            
            <h2 className="mt-6 font-display text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Create Your Perfect{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Telegram Bot
              </span>{" "}
              Today
            </h2>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
              Get started with HavTalk in minutes, no credit card required. 
              Build, launch, and scale your Telegram bot with our powerful platform.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="neo-border group relative overflow-hidden bg-primary font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                style={{
                  boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="neo-border font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Schedule Demo
              </Button>
            </div>
            
            {/* Features list */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-center">
              {[
                { icon: <Zap className="h-5 w-5 text-primary" />, text: "Set up in 5 minutes" },
                { icon: <MousePointerClick className="h-5 w-5 text-secondary" />, text: "No coding required" },
                { icon: <Sparkles className="h-5 w-5 text-accent" />, text: "14-day free trial" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2">{feature.icon}</div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-foreground/70">Trusted by teams from</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
                <div className="h-full w-24 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 