"use client";

import React from "react";
import { FaTelegramPlane, FaDiscord, FaMobileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ComingSoon() {
  const iconVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      color: "oklch(var(--primary))",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <motion.section
      className="relative overflow-hidden border-b border-border/20 bg-gradient-to-b from-background to-white/10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />

      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer-fast" />
      <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-[#B7FF58] to-transparent" />

      <div className="container mx-auto px-6 py-10">
        <div className="relative z-10 flex flex-col items-center justify-center gap-y-4 text-center">
          {/* Icons */}
          <div className="flex items-center gap-8 mb-2">
            <motion.div variants={iconVariants} whileHover="hover">
              <FaMobileAlt className="h-7 w-7 text-muted-foreground transition-colors" />
            </motion.div>
            <motion.div variants={iconVariants} whileHover="hover">
              <FaTelegramPlane className="h-7 w-7 text-muted-foreground transition-colors" />
            </motion.div>
            <motion.div variants={iconVariants} whileHover="hover">
              <FaDiscord className="h-7 w-7 text-muted-foreground transition-colors" />
            </motion.div>
          </div>

          {/* Text Content */}
          <div>
            <h3 className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
              A New Multi-Platform Experience is Coming Soon
            </h3>
            <p className="text-md text-muted-foreground mt-1">
              But why wait to create? Your next story awaits on the web.
            </p>
          </div>

          {/* CTA Button */}
          {/* <div className="mt-4">
            <motion.a
              href="#"
              className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating Now
            </motion.a>
          </div> */}
        </div>
      </div>
    </motion.section>
  );
}