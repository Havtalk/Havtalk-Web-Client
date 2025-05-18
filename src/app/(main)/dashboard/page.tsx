"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Sparkles, Star, PlusCircle, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signUp } from "@/lib/auth";

export default function Dashboard() {
  const heroRef = useRef<HTMLDivElement>(null);
  const charactersRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const login=async(email:string,password:string)=>{
    const {data,error}=await signIn.email({
      email,
      password,
      // callbackURL: "/dashboard",
      rememberMe: false
    }, {
      //callbacks
    })

    if (error) {
      console.error("Login error:", error);
      return;
    }
    if (data) {
      console.log("Login successful:", data);
    }
    return data;
  }
  // useEffect(() => {
  //   const response=login("sohamhaldar25@gmail.com", "Soham@123*");
  //   console.log("Login response:", response);
  // }, []);
  

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

  // Sample characters data
  const characters = [
    { id: 1, name: "Einstein", image: "/characters/einstein.png", description: "The brilliant physicist" },
    { id: 2, name: "Marie Curie", image: "/characters/curie.png", description: "Pioneer in radioactivity" },
    { id: 3, name: "Shakespeare", image: "/characters/shakespeare.png", description: "The famous playwright" },
    { id: 4, name: "Cleopatra", image: "/characters/cleopatra.png", description: "Ancient Egyptian ruler" },
    { id: 5, name: "Leonardo da Vinci", image: "/characters/davinci.png", description: "Renaissance polymath" },
  ];

  // Sample conversations data
  const conversations = [
    { id: 101, character: "Einstein", preview: "We were discussing relativity...", date: "2 days ago", image: "/characters/einstein.png" },
    { id: 102, character: "Shakespeare", preview: "To be or not to be...", date: "1 week ago", image: "/characters/shakespeare.png" },
    { id: 103, character: "Marie Curie", preview: "Our conversation about radiation...", date: "2 weeks ago", image: "/characters/curie.png" },
  ];

  return (
    <section
      ref={heroRef}
      className="w-full pt-16 pb-16 md:pt-20 md:pb-20 h-auto min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-black to-gray-900"
    >
      {/* Characters you can talk to */}
      <div className="w-full px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Talk to Characters
        </h2>
        
        <div 
          ref={charactersRef}
          className="flex space-x-4 overflow-x-auto pb-4 snap-x px-4"
        >
          {characters.map(character => (
            <div 
              key={character.id}
              data-speed={0.15 + Math.random() * 0.1}
              className="flex-shrink-0 w-[200px] md:w-[250px] bg-gray-800 rounded-xl overflow-hidden snap-center border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="relative h-[150px] md:h-[180px] w-full">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  {/* Use default image fallback if character images aren't available */}
                  <Image 
                    src={character.image} 
                    alt={character.name}
                    width={200}
                    height={180}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{character.description}</p>
                <Link href={`/chat/${character.id}`}>
                  <Button className="w-full">
                    Start Talking <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past conversations */}
      <div className="w-full px-4 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center">
          <Clock className="mr-2" size={24} />
          Past Conversations
        </h2>
        
        {conversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.map(convo => (
              <Link href={`/chat/history/${convo.id}`} key={convo.id}>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={convo.image} 
                        alt={convo.character}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{convo.character}</h3>
                      <p className="text-xs text-gray-400">{convo.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">{convo.preview}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 text-center">
            <p className="text-gray-400">No conversations yet. Start talking with a character!</p>
          </div>
        )}
      </div>

      {/* Create your character */}
      <div className="w-full px-4">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white flex items-center">
              <Sparkles className="mr-2" size={24} />
              Create Your Own Character
            </h2>
            <p className="text-gray-300 max-w-lg">
              Design a custom character with unique personality traits, knowledge, and voice.
              Bring your imagination to life and have conversations with your creation.
            </p>
          </div>
          <Link href="/create-character">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              <PlusCircle className="mr-2" size={18} />
              Create Character
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}