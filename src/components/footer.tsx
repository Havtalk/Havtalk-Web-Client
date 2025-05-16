"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Instagram, Linkedin, Mail, SendHorizontal, Twitter } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== "") {
      // In a real implementation, you would call an API here
      setIsSubscribed(true);
      setEmail("");
    }
  };
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Testimonials", href: "/#testimonials" },
        { label: "FAQ", href: "/#faq" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API Reference", href: "/api" },
        { label: "Guides", href: "/guides" },
        { label: "Templates", href: "/templates" },
        { label: "Community", href: "/community" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
        { label: "Security", href: "/security" },
      ],
    },
  ];
  
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="border-t border-border bg-card pb-8 pt-16">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Logo and about */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="font-display text-2xl font-black tracking-tight text-foreground">
                  HavTalk
                </span>
              </Link>
            </div>
            
            <p className="mt-4 max-w-md text-foreground/70">
              The most powerful Telegram bot platform. Create, manage, and scale your bots with ease. No coding required.
            </p>
            
            {/* Newsletter signup */}
            <div className="mt-6">
              <h4 className="font-display text-lg font-bold">Subscribe to our newsletter</h4>
              <p className="mt-1 text-sm text-foreground/70">
                Get product updates, company news, and more.
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="mt-3 flex max-w-md gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neo-border w-full"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="neo-border bg-primary transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Subscribe</span>
                  </Button>
                </form>
              ) : (
                <div className="mt-3 rounded-md bg-accent/10 p-3 text-accent">
                  <p className="text-sm font-medium">
                    Thanks for subscribing! Check your email for confirmation.
                  </p>
                </div>
              )}
            </div>
            
            {/* Social links */}
            <div className="mt-6">
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-white"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {footerLinks.map((group, index) => (
              <div key={index}>
                <h4 className="font-display text-base font-bold">{group.title}</h4>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/70 transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-center text-sm text-foreground/70 sm:text-left">
            © {new Date().getFullYear()} HavTalk. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-foreground/70">
            <a href="/terms" className="hover:text-primary">
              Terms
            </a>
            <a href="/privacy" className="hover:text-primary">
              Privacy
            </a>
            <a href="/cookies" className="hover:text-primary">
              Cookies
            </a>
            <a href="mailto:support@havtalk.com" className="flex items-center hover:text-primary">
              <Mail className="mr-1 h-4 w-4" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 