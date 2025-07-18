// 'use client'
import RegisterForm from '@/components/auth/register-form';
import React from 'react'
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

function RegisterPage() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 md:pt-1 md:pb-2 h-auto min-h-[100vh] md:min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        
        
        {/* Floating particles (stars) */}
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 3 + 1; 
          return (
            <div 
              key={`particle-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  boxShadow: `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.8)`,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out alternate`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>)}
          )}

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-hero-primary/30 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-hero-secondary/30 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse-slow opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-hero-secondary/30 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>
      </div>
      
      {/* Left side image - hidden on small screens */}
      <Image
        src={'/download__22_-removebg-preview (3).png'}
        alt="Background Image"
        className='relative z-10 hidden md:block md:absolute md:left-5 lg:left-20 xl:left-32 md:opacity-100 hover:opacity-100 transition-opacity duration-300'
        height={350}
        width={350}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-4 py-6 mx-auto text-center text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400/70"></div>
          <Sparkles className="h-5 w-5 text-pink-300 animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-r from-purple-400/70 to-transparent"></div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
          Create Your Universe
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
          Join our cosmic community and begin crafting your personalized AI roleplay experience with unique characters.
        </p>
        
        <RegisterForm />
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-1 inset-x-0 h-px bg-gradient-to-r from-transparent via-hero-secondary/50 to-transparent"></div>
      </div> 

      {/* Right side image - hidden on small screens */}
      <Image
        src={'/image (50).png'}
        alt="Background Image"
        className='relative hidden md:block md:absolute md:right-5 lg:right-12 xl:right-16 md:opacity-100 hover:opacity-100 transition-opacity duration-300'
        height={500}
        width={500}
      />

    </section>           
  )
}

export default RegisterPage;
