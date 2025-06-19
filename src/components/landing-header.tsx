"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Logo animation
  const logoLetter = ["H", "a", "v", "T", "a", "l", "k"];
  
  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "neo-border border-b-2 backdrop-blur-md bg-background/60 py-1"
          : "bg-transparent py-1",
        className
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group relative flex items-center transition-all duration-300">
        <Image
          src="/logo-webp.webp"
          alt="HavTalk Logo"
          width={40}
          height={40}
          className="h-16 w-16 transition-transform duration-300 hover:scale-110"
        />
          <span className="flex space-x-[2px] font-display text-2xl font-black tracking-tight text-foreground">
            {logoLetter.map((letter, index) => (
              <span
                key={index}
                className="inline-block transition-all duration-300 hover:scale-110 hover:text-primary"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "wiggle 1s ease-in-out infinite",
                  animationPlayState: "paused",
                }}
                onMouseEnter={(e) => 
                  (e.target as HTMLElement).style.animationPlayState = "running"
                }
                onMouseLeave={(e) => 
                  (e.target as HTMLElement).style.animationPlayState = "paused"
                }
              >
                {letter}
              </span>
            ))}
          </span>
        </Link>
        

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {/* <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/#features" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-foreground transition-all duration-200 hover:font-bold hover:text-primary"
                    )}
                  >
                    Features
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/#pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-foreground transition-all duration-200 hover:font-bold hover:text-primary"
                    )}
                  >
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/#testimonials" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-foreground transition-all duration-200 hover:font-bold hover:text-primary"
                    )}
                  >
                    Testimonials
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/#faq" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "font-medium text-foreground transition-all duration-200 hover:font-bold hover:text-primary"
                    )}
                  >
                    FAQ
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> */}

          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <Button
              className="neo-border relative overflow-hidden bg-primary text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none"
              style={{
                boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
              }}
            >
              Get Started
              <span className="absolute inset-0 bg-white mix-blend-difference"></span>
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          
          <Button
            variant="outline"
            size="icon"
            className="neo-border"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[calc(var(--header-height,4rem))] z-30 h-[calc(100vh-var(--header-height,4rem))] overflow-auto bg-background pb-6 pt-4 md:hidden">
          <div className="container">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/#features"
                className="font-display text-2xl font-bold transition-all duration-200 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="font-display text-2xl font-bold transition-all duration-200 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#testimonials"
                className="font-display text-2xl font-bold transition-all duration-200 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#faq"
                className="font-display text-2xl font-bold transition-all duration-200 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Button
                className="neo-border mt-4 bg-primary text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                style={{
                  boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 