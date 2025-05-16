"use client";

import React, { useState, useEffect } from "react";
import { ChatDemo } from "@/components/chat-demo";
import { CTA } from "@/components/cta";
import { EasterEgg } from "@/components/easter-egg";
import { FAQ } from "@/components/faq";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { CustomCursor } from "@/components/custom-cursor";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if on mobile/touch device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return (
    <div className={!isMobile ? "custom-cursor" : ""}>
      {/* Custom cursor */}
      <CustomCursor />
      
      {/* Header */}
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* Pricing Section */}
        <Pricing />
        
        {/* Testimonials Section */}
        {/* <Testimonials /> */}
        
        {/* FAQ Section */}
        {/* <FAQ /> */}
        
        {/* Call to Action Section */}
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Demo Widget */}
      <ChatDemo />
      
      {/* Easter Egg (type "havtalk" to trigger) */}
      <EasterEgg />
    </div>
  );
}
