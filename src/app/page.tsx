"use client";

import React from "react";
import { Header } from "@/components/landing-header";
import { Hero } from "@/components/hero";
import ComingSoon from "@/components/coming-soon";
import CharacterSection from "@/components/character-section";
import { LandingFooter } from "@/components/landing-footer";
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
