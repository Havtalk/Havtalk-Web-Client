"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const faqItems: FAQItem[] = [
    {
      question: "What is HavTalk?",
      answer: "HavTalk is a powerful platform that helps you create, manage, and optimize Telegram bots without coding. Our platform provides tools for automating conversations, scheduling messages, collecting user data, and integrating with external services.",
      category: "general",
    },
    {
      question: "Do I need technical skills to use HavTalk?",
      answer: "Not at all! HavTalk was designed with non-technical users in mind. Our visual builder uses a drag-and-drop interface that makes it easy to create sophisticated bots without writing a single line of code.",
      category: "general",
    },
    {
      question: "How does the pricing work?",
      answer: "HavTalk offers several pricing tiers based on your needs. We have a free trial to get you started, and our paid plans start at $9/month for the Starter plan. All plans include our core features, with higher tiers offering more bots, messages, and advanced capabilities.",
      category: "pricing",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Absolutely! You can upgrade your plan at any time, and the changes will take effect immediately. If you need to downgrade, the changes will apply at the start of your next billing cycle.",
      category: "pricing",
    },
    {
      question: "Is there a limit to how many messages my bot can handle?",
      answer: "Each pricing tier includes a specific number of messages per month. The Starter plan includes 1,000 messages, Pro includes 10,000, and Enterprise offers unlimited messaging. If you exceed your limit, you can purchase additional message packs or upgrade your plan.",
      category: "usage",
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! We offer a 14-day free trial on all our plans. No credit card is required to start your trial, and you can upgrade to a paid plan at any time during or after your trial period.",
      category: "pricing",
    },
    {
      question: "How secure is my bot's data?",
      answer: "Security is our top priority. All data is encrypted both in transit and at rest. We use industry-standard security practices, regular security audits, and maintain strict access controls. Your bot's conversations and user data are private and protected.",
      category: "security",
    },
    {
      question: "Can I integrate my bot with other services?",
      answer: "Yes! HavTalk supports integrations with popular services like Google Calendar, Zapier, Slack, and more. You can also connect to any service with a REST API using our integration tools, all without coding.",
      category: "features",
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "Our platform offers comprehensive analytics including user engagement metrics, conversation flow analysis, response times, conversion rates, and custom event tracking. You can visualize this data in dashboards and export reports for further analysis.",
      category: "features",
    },
    {
      question: "How do I get help if I'm stuck?",
      answer: "We offer multiple support channels including detailed documentation, video tutorials, a community forum, and email support. Higher-tier plans also include priority support and dedicated account managers.",
      category: "support",
    },
  ];
  
  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "pricing", name: "Pricing" },
    { id: "features", name: "Features" },
    { id: "usage", name: "Usage" },
    { id: "security", name: "Security" },
    { id: "support", name: "Support" },
  ];
  
  const filteredFAQs = activeCategory === "all" 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <section id="faq" className="relative py-24">
      {/* Background Elements */}
      <div className="absolute left-0 top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
      <div className="absolute bottom-32 right-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"></div>
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
            FAQ
          </div>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Find answers to common questions about HavTalk's features, pricing, and capabilities.
          </p>
        </div>
        
        {/* Category filters */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "neo-border rounded-full px-4 py-2 font-medium transition-all duration-300",
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-card/90"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* FAQ Accordion */}
        <div className="mt-12">
          <Accordion type="single" collapsible className="space-y-6">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="neo-border overflow-hidden rounded-lg bg-card data-[state=open]:bg-card/95"
              >
                <AccordionTrigger className="group px-6 py-4 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold group-data-[state=open]:text-primary">
                      {faq.question}
                    </h3>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary transition-all duration-300 group-data-[state=open]:rotate-180">
                        <Plus className="h-4 w-4 group-data-[state=open]:hidden" />
                        <Minus className="hidden h-4 w-4 group-data-[state=open]:block" />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="animate-accordion-slide-down overflow-hidden px-6 pb-6 pt-0 text-foreground/80">
                  <div className="mt-2 border-l-2 border-primary pl-4">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        {/* Still have questions */}
        <div className="neo-border mt-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-background to-accent/10 p-8 text-center sm:p-12">
          <h3 className="font-display text-2xl font-black sm:text-3xl">
            Still Have Questions?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
            Our support team is ready to help you with any questions you might have about HavTalk.
            We typically respond within 24 hours on weekdays.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="neo-border bg-primary px-6 py-3 font-bold text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Contact Support
            </button>
            <button className="neo-border bg-card px-6 py-3 font-bold transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Read Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 