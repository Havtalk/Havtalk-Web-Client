"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const characters = [
  {
    id: "c1fac260-9dfd-476e-8702-c4f344ec84c1",
    name: "Darth Vader",
    tags: ["Dark", "Powerful", "Ruthless"],
    quote: "You feel a disturbance in the Force as he enters. Will you join the Empire, or resist its shadow?",
    image: "/landing/darth_vader2.webp",
    bgGradient: "bg-gradient-to-t from-red-900/50 via-red-900/10 to-transparent",
  },
  {
    id: "6a574323-1e24-459d-ab01-ac7718a0a716",
    name: "Cleopatra",
    tags: ["Mysterious", "Wise", "Strategic"],
    quote: "The last Pharaoh, ruler of Egypt — cunning, captivating, and ready to share secrets of power, love, and legacy.",
    image: "/landing/cleopatra.png", // Make sure this image exists!
    bgGradient: "bg-gradient-to-t from-purple-900/50 via-purple-900/10 to-transparent",
  },
  {
    id: "22f414ca-60be-4ea6-a1ff-5430dde40d45",
    name: "Wonder Woman",
    tags: ["Noble", "Fierce", "Just"],
    quote: "A warrior of truth and protector of peace. Ask her about heroism, justice — or the burdens of strength.",
    image: "/landing/wonder_woman.png",
    bgGradient: "bg-gradient-to-t from-yellow-700/30 via-yellow-700/5 to-transparent",
  },
  {
    id: "2e75b9ba-d1d0-4b84-bc2d-603274537344",
    name: "Lara Croft",
    tags: ["Adventurous", "Clever", "Fearless"],
    quote: "Whether it's lost tombs or snarky banter, she’s always ready. Start a conversation if you dare keep up.",
    image: "/landing/lara_croft.png",
    bgGradient: "bg-gradient-to-t from-orange-800/30 via-orange-800/5 to-transparent",
  },
  {
    id: "1c7d69da-c4ba-467c-b4d0-eedcec77b1d4",
    name: "Elsa",
    tags: ["Empathetic", "Magical", "Resolute"],
    quote: "A queen with powers beyond control. Chat with her about family, freedom — or learning to let go.",
    image: "/landing/elsa.png",
    bgGradient: "bg-gradient-to-t from-blue-700/50 via-blue-700/10 to-transparent",
  },
  
];

const CharacterSection = () => {
  return (
    <section className="w-full bg-background relative overflow-hidden"
        id="characters"
        style={{
            paddingLeft:"0px",
            paddingRight:"0px",
        }}
    >
        <div className="absolute -right-5 -top-10 h-64 w-64 rounded-full bg-hero-secondary/20 blur-3xl"></div>
      
      
        {/* Section Heading */}
        <div className="text-center py-16 md:py-24 px-6 relative">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
            
            <motion.h2
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-extrabold mb-4 text-white font-display"
            >
                Step Into Their World
            </motion.h2>
            <motion.p
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body"
            >
                Iconic personalities from across time, space, and imagination are waiting for your first words.
            </motion.p>
        </div>
      {characters.map((char) => (
        <motion.div
          key={char.id}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
          className="relative h-[calc(100vh-4rem)] flex items-center md:items-end md:pb-10 justify-center overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={char.image}
              alt={char.name}
              fill
              sizes="100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute inset-0 ${char.bgGradient}`}></div>
          </div>

          {/* Content Layer */}
            <div className="relative z-10 w-full max-w-4xl px-8 md:px-16 text-white text-center">
            <motion.h3
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 60 }}
              className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight font-display"
            >
              {char.name}
            </motion.h3>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 60 }}
              className="flex flex-wrap justify-center gap-3 mb-6"
            >
              {char.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-1 rounded-full text-sm md:text-base font-medium border border-white/40 backdrop-blur-sm bg-black/30"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", stiffness: 60 }}
              className="text-lg md:text-xl italic mb-10 max-w-2xl mx-auto font-display"
            >
              &quot;{char.quote}&quot;
            </motion.p>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 60 }}
            >
              <Link href={`/guest-chat/${char.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-display px-8 py-4 text-lg font-semibold rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-lg"
                >
                  Chat Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Final Call to Action */}
      <div className="py-16 bg-gradient-to-b from-background to-white/10 text-center">
        <motion.h3
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-4 font-display"
        >
          Want More Characters?
        </motion.h3>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-6 max-w-md mx-auto font-body text-lg"
        >
          Meet more legends, heroes, villains, and icons waiting to chat.
        </motion.p>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/characters">
            <button className="font-display px-6 py-3 rounded-full border border-input bg-background hover:bg-accent transition-colors">
              View All Characters
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CharacterSection;