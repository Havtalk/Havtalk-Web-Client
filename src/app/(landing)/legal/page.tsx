import React from "react";
import { Header } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function LegalPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-zinc-950/95 ">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute bottom-1/3 -left-32 h-96 w-96 rounded-full bg-primary/10 opacity-80 blur-3xl"></div>
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 opacity-80 blur-3xl"></div>
            <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-secondary/50 opacity-80 blur-3xl"></div>
            <div className="absolute bottom-32 -right-24 h-96 w-96 rounded-full bg-hero-accent/10 opacity-75 blur-3xl"></div>
        </div>
                
        <Header/>
        <main className="relative max-w-4xl mx-auto px-4 py-20 pt-32 text-foreground z-10" id="privacy-policy">
        <h1 className="text-4xl font-bold mb-8 px-2 md:px-0 font-display" >Privacy Policy</h1>
        <p className=" text-muted-foreground mb-6 px-2 md:px-0 font-display">
            <strong>Effective Date:</strong> June 23, 2025
        </p>

        <Section title="1. Information We Collect" content={[
            "Account Information: When you sign up, we collect your email and password (secured with encryption).",
            "Guest Usage Data: For non-logged-in users, we may generate a temporary session token to track basic activity.",
            "Chat Interactions: All chats are stored to support chat history and improve user experience. You can delete your history at any time.",
            "Cookies: We use cookies to maintain session state and enable essential site functions."
        ]} />

        <Section title="2. How We Use Your Information" content={[
            "To deliver and improve our AI roleplay experience",
            "To personalize your experience and remember your interactions",
            "For analytics to understand usage trends (aggregated, not personal)"
        ]} />

        <Section title="3. Data Protection" content={[
            "Passwords are securely hashed and never stored in plain text.",
            "Access to user data is limited and audited.",
            "Tokens are signed and verified securely."
        ]} />
        

        <Section title="4. Third-Party Services" content={[
            "We use third-party AI services such as Google Gemini to power character responses.",
            "We may also use tools like Google Analytics or cloud storage providers. These services are GDPR-compliant and do not receive your private chats."
        ]} />

        <Section title="5. Your Rights" content={[
            "You can delete your account and data at any time.",
            // "You can request a copy of your data through the app settings."
        ]} />
        
        <div id="terms-and-conditions"></div>
        <Section title="6. Updates" content={[
            "We may update this policy occasionally. You will be notified of significant changes via in-app notification."
        ]}  />
        
        <hr className="my-12" />
        
        <h1 className="text-4xl font-bold mb-8 px-2 md:px-0 font-display"
            
        >Terms & Conditions</h1>
        <p className=" text-muted-foreground mb-6 md:px-0 px-2 font-body">
            <strong>Effective Date:</strong> June 23, 2025
        </p>

        <Section title="1. Usage" content={[
            "HavTalk is for personal, non-commercial use only.",
            "You must be 13 years or older to use the service."
        ]} />

        <Section title="2. Account Responsibility" content={[
            "You are responsible for maintaining the confidentiality of your login credentials.",
            "You agree not to impersonate others or use offensive content in usernames or conversations."
        ]} />

        <Section title="3. Content & Behavior" content={[
            "You may not use HavTalk to generate or share illegal, abusive, or harmful content.",
            "We reserve the right to suspend accounts that violate our guidelines."
        ]} />

        <Section title="4. Intellectual Property" content={[
            "All AI characters and assets are either original, licensed, or parodies.",
            "User-generated content remains your property, but by using our platform you grant HavTalk a license to store and process it."
        ]} />

        <Section title="5. Availability" content={[
            "We may modify, suspend, or discontinue any part of the service at any time without prior notice."
        ]} />

        <Section title="6. Disclaimer" content={[
            "HavTalk is a fictional, entertainment-based platform.",
            "The characters are AI-generated and do not represent real individuals."
        ]} />

        <Section title="7. Limitation of Liability" content={[
            "We are not liable for indirect, incidental, or consequential damages arising from use of the service."
        ]} />

        <Section title="8. Contact" content={[
            "Currently, we do not provide a public support email.",
            "If you have questions, please reach out to us through our contact form (coming soon) or via our official social media channels."
        ]} />
        
        </main>
          
        <LandingFooter/>
    </div>
  );
}

type SectionProps = {
  title: string;
  content: string[];
};

function Section({ title, content }: SectionProps) {
  return (
    <section className="mb-10 relative">
      <h2 className="text-xl font-semibold mb-2 font-display relative">{title}</h2>
      <ul className="font-body list-disc list-inside space-y-1 text-muted-foreground text-base pl-2 relative">
        {content.map((line, idx) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
