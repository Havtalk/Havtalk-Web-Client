import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rubik, Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Neo-Brutalist style fonts
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "HavTalk - Telegram Bot",
  description: "A modern, powerful Telegram bot solution",
  keywords: ["telegram", "bot", "messaging", "automation", "chat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${jost.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
