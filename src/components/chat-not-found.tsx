'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BackgroundDesign from "@/components/background-design";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import Image from "next/image";

export default function ChatNotFound() {
  const router = useRouter();

  return (
    <>
      <BackgroundDesign />
      <div className="h-screen w-full flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md w-full mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-6">
            <motion.div 
              className="absolute inset-0 rounded-full blur-xl opacity-30 bg-gradient-to-r from-blue-500 to-purple-600"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3] 
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="relative z-10 flex justify-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 relative">
                <Image
                  src="/chat-not-found.png"
                  alt="404 Not Found"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 112px, (max-width: 768px) 160px, 192px"
                  priority
                  quality={90}
                  unoptimized
                />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Chat not found</h1>
          
          <p className="text-gray-400 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => router.push('/characters')}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Characters
              </Button>
            </div>
          </div>

          <div className="mt-10 text-gray-500 text-sm">
            <p>Error 404 | Page Not Found</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
