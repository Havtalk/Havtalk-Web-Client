import LoginForm from '@/components/auth/login-form';
import React from 'react'
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

function LoginPage() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 md:pt-1 md:pb-2 h-auto min-h-[100vh] md:min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        {/* Stars */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-pulse-slow opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-secondary/30 rounded-full blur-3xl animate-pulse-slow opacity-30"></div>
      </div>
      
      {/* Left side image - hidden on small screens */}
      <Image
        src={'/download__19_-removebg-preview.png'}
        alt="Background Image"
        className='relative z-10 hidden md:block md:absolute md:left-5 lg:left-20 xl:left-32 md:opacity-100 hover:opacity-100 transition-opacity duration-300'
        height={350}
        width={350}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-4 py-6 mx-auto text-center text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/70"></div>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-r from-primary/70 to-transparent"></div>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-primary/80 to-white bg-clip-text text-transparent animate-gradient">
          Access Your Universe
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
          Enter your credentials to continue your journey with our immersive AI roleplay characters and storylines.
        </p>
        
        <LoginForm />
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-1 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
      </div> 

      {/* Right side image - hidden on small screens */}
      <Image
        src={'/download__14_-removebg-preview.png'}
        alt="Background Image"
        className='relative hidden md:block md:absolute md:right-5 lg:right-16 xl:right-32 md:opacity-100 hover:opacity-100 transition-opacity duration-300'
        height={350}
        width={350}
      />

    </section>           
  )
}

export default LoginPage;