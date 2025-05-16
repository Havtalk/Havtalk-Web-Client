"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export function EasterEgg() {
  const [isActive, setIsActive] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // The secret code is "havtalk" (h+a+v+t+a+l+k)
  const secretCode = ["h", "a", "v", "t", "a", "l", "k"];
  const secretCodeString = secretCode.join("");
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Update keys pressed
      setKeysPressed(prev => ({ ...prev, [key]: true }));
      
      // Check if all keys in the secret code are currently pressed
      let currentInput = "";
      for (const k of Object.keys(keysPressed).concat(key)) {
        if (keysPressed[k] || k === key) {
          currentInput += k;
        }
      }
      
      // Check if the current input contains our secret code
      if (currentInput.includes(secretCodeString)) {
        triggerEasterEgg();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => ({ ...prev, [key]: false }));
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keysPressed]);
  
  const triggerEasterEgg = () => {
    if (isActive) return; // Don't restart if already active
    
    setIsActive(true);
    initializeParticles();
    
    // Hide the easter egg after animation completes
    setTimeout(() => {
      setIsActive(false);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }, 8000);
  };
  
  const initializeParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      gravity: number;
      text?: string;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
    }
    
    const particles: Particle[] = [];
    const texts = [
      "HavTalk!",
      "🎉",
      "🚀",
      "👏",
      "You found it!",
      "Easter Egg!",
      "Secret!",
      "😎",
      "Bot Power!",
      "Neo-Brutalism!",
    ];
    
    const colors = [
      "#FF5757", // primary
      "#FFE147", // secondary
      "#47A8FF", // accent
      "#FF8947", // chart-4
      "#9747FF", // chart-5
    ];
    
    // Create explosion particles
    for (let i = 0; i < 150; i++) {
      const size = Math.random() * 20 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;
      
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size,
        color,
        speedX,
        speedY,
        gravity: 0.1,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    
    // Create text particles
    for (let i = 0; i < 20; i++) {
      const text = texts[Math.floor(Math.random() * texts.length)];
      const size = Math.random() * 30 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      const speedX = Math.cos(angle) * speed;
      const speedY = Math.sin(angle) * speed;
      
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size,
        color,
        speedX,
        speedY,
        gravity: 0.05,
        text,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.rotation += p.rotationSpeed;
        
        // Fade out gradually
        p.opacity -= 0.005;
        
        // Remove particles that are no longer visible
        if (p.opacity <= 0) {
          particles.splice(index, 1);
          return;
        }
        
        // Draw the particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        
        if (p.text) {
          // Text particle
          ctx.font = `${p.size}px var(--font-rubik), sans-serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.text, 0, 0);
        } else {
          // Regular particle
          ctx.fillStyle = p.color;
          ctx.beginPath();
          
          if (Math.random() > 0.5) {
            // Draw circle
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          } else {
            // Draw square
            ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          
          ctx.fill();
        }
        
        ctx.restore();
      });
      
      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsActive(false);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-50 transition-opacity duration-500",
        isActive ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    />
  );
} 