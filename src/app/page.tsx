"use client";

import React from "react";
import { ChatDemo } from "@/components/chat-demo";
import { CTA } from "@/components/cta";
import { EasterEgg } from "@/components/easter-egg";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/landing-header";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
export default function Home() {
  
  return (
    <div>
      {/* Custom cursor */}
      {/* <CustomCursor /> */}
      
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
