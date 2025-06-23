"use client";

import React from "react";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Facebook, Github, Instagram, Linkedin, Mail, SendHorizontal, Twitter } from "lucide-react";

export function LandingFooter() {

  return (
    <footer className="border-t border-border bg-card/60 pb-6 relative">
      <div className="container">
        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-6 sm:flex-row">
          <p className="text-center text-base font-body text-foreground/70 sm:text-left">
            © {new Date().getFullYear()} HavTalk. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 text-base font-body text-foreground/70">
            <Link href="/legal/#terms-and-conditions" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/legal/#privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            {/* <a href="/cookies" className="hover:text-primary">
              Cookies
            </a>
            <a href="mailto:support@havtalk.com" className="flex items-center hover:text-primary">
              <Mail className="mr-1 h-4 w-4" />
              Contact
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
} 