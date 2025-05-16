"use client";

import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BillingPeriod = "monthly" | "yearly";

interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  
  const plans: PricingPlan[] = [
    {
      name: "Basic",
      description: "Perfect for casual roleplayers",
      price: {
        monthly: 9,
        yearly: 90,
      },
      features: [
        "3 AI characters",
        "Up to 500 messages/month",
        "Basic character customization",
        "Standard response templates",
        "Email support",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enthusiast",
      description: "For dedicated roleplayers and storytellers",
      price: {
        monthly: 29,
        yearly: 290,
      },
      features: [
        "15 AI characters",
        "Up to 5,000 messages/month",
        "Advanced character customization",
        "Memory and context retention",
        "Character image generation",
        "Priority support",
        "Save and share conversations",
      ],
      highlighted: true,
      cta: "Become an Enthusiast",
    },
    {
      name: "Creator",
      description: "For professional content creators and communities",
      price: {
        monthly: 99,
        yearly: 990,
      },
      features: [
        "Unlimited AI characters",
        "Unlimited messages",
        "Full character creation suite",
        "Advanced storytelling tools",
        "API access for custom integrations",
        "Dedicated account manager",
        "Community management tools",
        "Character marketplace access",
      ],
      cta: "Contact Us",
    },
  ];
  
  // Calculate the yearly savings percentage
  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <section id="pricing" className="relative py-24">
      {/* Background gradients */}
      <div className="absolute -right-64 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-64 -left-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Pricing
          </div>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl md:text-5xl">
            Choose Your Adventure
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Simple pricing for unlimited roleplay possibilities.
            Create, customize, and converse with AI characters that feel real.
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span 
              className={cn(
                "cursor-pointer font-medium transition-colors", 
                billingPeriod === "monthly" 
                  ? "text-foreground" 
                  : "text-foreground/50 hover:text-foreground/70"
              )}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </span>
            
            <div 
              className="neo-border relative h-7 w-14 cursor-pointer rounded-full bg-muted transition-colors"
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            >
              <div 
                className={cn(
                  "absolute top-1 h-5 w-5 rounded-full bg-primary transition-all",
                  billingPeriod === "monthly" ? "left-1" : "left-8"
                )}
              ></div>
            </div>
            
            <div className="flex items-center space-x-1">
              <span 
                className={cn(
                  "cursor-pointer font-medium transition-colors",
                  billingPeriod === "yearly" 
                    ? "text-foreground" 
                    : "text-foreground/50 hover:text-foreground/70"
                )}
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly
              </span>
              <div className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                Save 20%
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "neo-border group relative overflow-hidden rounded-lg bg-card p-8 transition-all duration-300 hover:-translate-y-1",
                plan.highlighted && "border-primary bg-gradient-to-b from-card via-card to-primary/5"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -right-12 -top-12 h-24 w-24 rotate-12 bg-primary/20 blur-xl"></div>
              )}
              
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -right-8 top-6 flex h-8 w-32 rotate-45 items-center justify-center bg-primary text-xs font-bold text-white">
                  Popular
                </div>
              )}
              
              <div className="relative">
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 h-12 text-sm text-foreground/70">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$</span>
                    <span className="font-display text-5xl font-black">
                      {billingPeriod === "monthly" ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="ml-1 text-foreground/70">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  
                  {billingPeriod === "yearly" && (
                    <div className="mt-1 text-sm text-accent">
                      Save ${(plan.price.monthly * 12) - plan.price.yearly} yearly
                    </div>
                  )}
                </div>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={cn(
                    "neo-border mt-8 w-full font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
                    plan.highlighted
                      ? "bg-primary text-white"
                      : "bg-card hover:bg-card/90"
                  )}
                  style={{
                    boxShadow: "5px 5px 0px 0px rgba(0, 0, 0, 1)",
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Guarantee message */}
        <div className="neo-border mt-16 rounded-lg bg-card p-6">
          <div className="flex flex-col items-center sm:flex-row">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 sm:mb-0 sm:mr-6">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h4 className="text-center font-display text-lg font-bold sm:text-left">14-Day Money-Back Guarantee</h4>
              <p className="text-center text-sm text-foreground/70 sm:text-left">
                Try our AI roleplay platform risk-free. If you're not completely satisfied with your character interactions, we'll refund your payment within 14 days.
                No questions asked.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ quick link */}
        <div className="mt-12 text-center">
          <p className="text-foreground/70">
            Have questions about our pricing? Check our <a href="#faq" className="font-medium text-primary underline underline-offset-4">FAQ</a> or <a href="#" className="font-medium text-primary underline underline-offset-4">contact us</a>.
          </p>
        </div>
      </div>
    </section>
  );
} 