"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  content: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  imageSrc: string;
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      content: "This AI roleplay platform has completely transformed my creative writing experience. The characters are incredibly responsive and the conversations feel so natural. I've created stories I never thought possible!",
      name: "Sarah Johnson",
      title: "Fiction Writer",
      company: "Creative Minds",
      rating: 5,
      imageSrc: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      content: "Creating my own AI character was surprisingly easy. The character builder is intuitive, and I was roleplaying within minutes. The AI responses are thoughtful and maintain character consistency beautifully.",
      name: "Michael Chen",
      title: "Game Designer",
      company: "Immersive Worlds",
      rating: 5,
      imageSrc: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 3,
      content: "As someone who struggles with social anxiety, this platform has been a safe space to practice conversations and storytelling. The AI characters are supportive and help me express myself creatively.",
      name: "Alex Rivera",
      title: "Student",
      company: "University of Creative Arts",
      rating: 4,
      imageSrc: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 4,
      content: "The depth of character personalities and memory on this platform is incredible. My AI companions remember our conversations and evolve over time, creating truly immersive storytelling experiences.",
      name: "David Okafor",
      title: "Narrative Designer",
      company: "StoryForge Studios",
      rating: 5,
      imageSrc: "https://randomuser.me/api/portraits/men/22.jpg",
    },
  ];
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  // Confetti animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Trigger confetti when section comes into view
  useEffect(() => {
    if (isInView && !showConfetti) {
      setShowConfetti(true);
      
      const canvas = confettiCanvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Confetti pieces
      const particles: any[] = [];
      
      // Colors
      const colors = [
        "#FF5757", // primary
        "#FFE147", // secondary
        "#47A8FF", // accent
        "#FF8947", // accent alt
        "#9747FF", // purple
      ];
      
      // Create particles
      const particleCount = 200;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 2 + 1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
          shape: Math.random() > 0.5 ? "circle" : "square",
        });
      }
      
      // Animation loop
      let animationFrame: number;
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speed;
          p.rotation += p.rotationSpeed;
          
          // Draw particle based on shape
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          
          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          
          ctx.restore();
          
          // Reset particles that go off screen
          if (p.y > canvas.height) {
            particles[i].y = -p.size;
            particles[i].x = Math.random() * canvas.width;
          }
        }
        
        // Continue animation if particles are still visible
        if (particles.some((p) => p.y < canvas.height)) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      
      // Clean up animation on unmount
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [isInView, showConfetti]);
  
  return (
    <section id="testimonials" className="relative overflow-hidden py-24" ref={sectionRef}>
      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{ display: showConfetti ? "block" : "none" }}
      />
      
      {/* Background Elements */}
      <div className="absolute left-0 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Testimonials
          </div>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl md:text-5xl">
            What Our Roleplayers Say
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Don't just take our word for it. Here's what people are saying about our AI roleplay platform.
          </p>
        </div>
        
        {/* Testimonial Carousel */}
        <div className="neo-border mt-16 rounded-lg bg-card">
          <div className="relative">
            {/* Large quote icon background */}
            <div className="absolute left-8 top-8 text-primary/10">
              <Quote className="h-40 w-40" />
            </div>
            
            {/* Testimonial slider */}
            <div className="relative overflow-hidden p-8">
              <div 
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                <div className="flex">
                  {testimonials.map((testimonial) => (
                    <div 
                      key={testimonial.id} 
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className="flex flex-col items-center md:flex-row">
                        <div className="neo-border mb-6 w-full overflow-hidden rounded-lg md:mb-0 md:mr-8 md:w-1/3">
                          <div className="aspect-square overflow-hidden">
                            <Image
                              src={testimonial.imageSrc}
                              alt={testimonial.name}
                              width={300}
                              height={300}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-4 flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-5 w-5",
                                  i < testimonial.rating ? "fill-secondary text-secondary" : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          
                          <p className="mb-6 text-lg font-medium italic">"{testimonial.content}"</p>
                          
                          <div>
                            <h4 className="font-display text-xl font-bold">{testimonial.name}</h4>
                            <p className="text-foreground/70">
                              {testimonial.title} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation controls */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrev}
                  className="neo-border flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        index === activeIndex ? "bg-primary" : "bg-muted"
                      )}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={handleNext}
                  className="neo-border flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating statistics */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { number: "50,000+", label: "Active Roleplayers" },
            { number: "10,000+", label: "AI Characters" },
            { number: "100M+", label: "Messages Exchanged" },
            { number: "99.9%", label: "Uptime" },
          ].map((stat, index) => (
            <div
              key={index}
              className="neo-border flex flex-col items-center justify-center rounded-lg bg-card p-6 text-center transition-transform hover:-translate-y-1"
            >
              <span className="font-display text-3xl font-black">{stat.number}</span>
              <span className="text-foreground/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 