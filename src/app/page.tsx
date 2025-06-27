import React from "react";
import { Header } from "@/components/landing-header";
import { Hero } from "@/components/hero";
import ComingSoon from "@/components/coming-soon";
import CharacterSection from "@/components/character-section";
import { LandingFooter } from "@/components/landing-footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HavTalk - AI Roleplay Platform | Chat with Legendary Characters",
  description:
    "Experience immersive AI roleplay with legendary characters. Create unique personas, engage in dynamic conversations, and shape your own interactive stories with our advanced AI platform.",
  keywords: [
    "AI roleplay platform",
    "character chat AI",
    "interactive storytelling",
    "AI conversation",
    "virtual characters",
    "roleplay bot",
    "AI companions",
    "text-based roleplay",
    "character creation",
    "AI chatbot",
  ],
  openGraph: {
    title: "HavTalk - AI Roleplay Platform | Chat with Legendary Characters",
    description:
      "Experience immersive AI roleplay with legendary characters. Create unique personas, engage in dynamic conversations, and shape your own interactive stories.",
    url: "https://www.havtalk.site",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HavTalk AI Roleplay Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HavTalk - AI Roleplay Platform | Chat with Legendary Characters",
    description:
      "Experience immersive AI roleplay with legendary characters. Create unique personas, engage in dynamic conversations, and shape your own interactive stories.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.havtalk.site",
  },
};

export default function Home() {
  
  return (
    <div>
      <Header />
      <main >
        <Hero />
        <ComingSoon />
        <CharacterSection />
      </main>
      <LandingFooter />
    </div>
  );
}
