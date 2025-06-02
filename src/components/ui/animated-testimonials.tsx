"use client";

import { IconArrowLeft, IconArrowRight, IconMessageCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link

type Testimonial = {
  id: string; // Added for Chat Now button
  quote: string; // This is used as the main description
  name: string;
  designation: string; // This is used for personality
  src: string;
  tags: string[]; // Added tags
  ownerUsername: string; // Added owner username
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      const interval = setInterval(handleNext, 7000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length, handleNext]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        No testimonials to display.
      </div>
    );
  }

  const activeTestimonial = testimonials[active]; // Get current testimonial

  return (
    <div className="relative mx-auto w-full h-full font-sans antialiased overflow-hidden">
      {/* Background image with blur and opacity */}
      <div 
        className="absolute inset-0 -z-10 opacity-20 blur-xl" 
        style={{
          backgroundImage: `url(${activeTestimonial.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Content overlay with slight darkening for better readability */}
      <div className="absolute inset-0 -z-5 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center z-10">
        {/* Text Content Section - Enhanced for "Character Profile" feel */}
        <div className="flex flex-col justify-center py-4 md:order-1 order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={active} // Keyed by active index, triggers re-animation
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative"
            >
              {/* Character Name */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-1">
                {activeTestimonial.name}
              </h3>
              {/* Owner Info */}
              <p className="text-xs text-slate-400 mb-3">
                by @{activeTestimonial.ownerUsername}
              </p>
              
              {/* Personality/Designation */}
              <div className="mb-3">
                <p className="text-sm font-medium text-purple-300/90">
                  {activeTestimonial.designation}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {activeTestimonial.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-slate-700/80 text-slate-300 rounded-full shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Main Description (Quote) */}
              <motion.p className="text-md md:text-lg text-slate-300/90 leading-relaxed min-h-[100px] md:min-h-[140px] mb-8"> {/* Increased min-height slightly */}
                {activeTestimonial.quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.03 * index, 
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>

              {/* Chat Now Button */}
              <Link href={`/chat/${activeTestimonial.id}`} passHref>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconMessageCircle size={20} className="mr-2" />
                  Chat Now
                </motion.button>
              </Link>
            </motion.div>
          </AnimatePresence>
          {testimonials.length > 1 && (
            <div className="flex gap-4 pt-8 md:pt-10">
              <button
                onClick={handlePrev}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 hover:bg-purple-500/30 transition-colors duration-300"
                aria-label="Previous Character"
              >
                <IconArrowLeft className="h-6 w-6 text-slate-300 group-hover:text-purple-300 transition-colors duration-300" />
              </button>
              <button
                onClick={handleNext}
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 hover:bg-purple-500/30 transition-colors duration-300"
                aria-label="Next Character"
              >
                <IconArrowRight className="h-6 w-6 text-slate-300 group-hover:text-purple-300 transition-colors duration-300" />
              </button>
            </div>
          )}
        </div>

        {/* Image Section */}
        <div className="md:order-2 order-1">
          {/* Changed: Constrained width to w-11/12 and centered with mx-auto */}
          <div className="relative w-11/12 mx-auto aspect-square">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.src || active} // Key changes with active testimonial
                initial={{ opacity: 0, scale: 0.95, x: 30 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: -30,
                  transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] },
                }}
                className="absolute inset-0"
              >
                <img
                  src={activeTestimonial.src}
                  alt={activeTestimonial.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover shadow-2xl border-2 border-slate-700/50"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
