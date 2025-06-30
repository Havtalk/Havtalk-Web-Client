import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Rubik, Jost } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/hooks/use-preferences";
import { AuthProvider } from "@/context/auth-context";
import SessionExpiredModal from "@/components/session-expired-modal";
import { Toaster } from "@/components/ui/sonner";
import LoaderProvider from "@/context/loader-provider";
import { Analytics } from "@vercel/analytics/next"


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
  title: {
    default: "HavTalk - AI Roleplay Platform | Chat with Legendary Characters",
    template: "%s | HavTalk"
  },
  description: "Immersive AI roleplay platform where you can chat with legendary characters, create unique personas, and experience dynamic storylines. Talk to historical figures, fictional characters, and more.",
  keywords: [
    "AI roleplay",
    "character chat",
    "AI conversation",
    "roleplay platform",
    "AI characters",
    "interactive storytelling",
    "AI chat bot",
    "virtual characters",
    "AI companions",
    "text-based roleplay"
  ],
  authors: [{ name: "Soham Haldar", url: "https://github.com/sohamhaldar" }],
  creator: "Soham Haldar",
  publisher: "HavTalk",
  category: "Entertainment",
  metadataBase: new URL('https://www.havtalk.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.havtalk.site',
    siteName: 'HavTalk',
    title: 'HavTalk - AI Roleplay Platform | Chat with Legendary Characters',
    description: 'Immersive AI roleplay platform where you can chat with legendary characters, create unique personas, and experience dynamic storylines.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HavTalk - AI Roleplay Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@havtalk',
    creator: '@sohamhaldar',
    title: 'HavTalk - AI Roleplay Platform | Chat with Legendary Characters',
    description: 'Immersive AI roleplay platform where you can chat with legendary characters, create unique personas, and experience dynamic storylines.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  other: {
    'theme-color': '#000000',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              [{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "HavTalk - AI Roleplay",
                "alternateName": "HavTalk",
                "url": "https://www.havtalk.site",
                "logo": "https://www.havtalk.site/logo.png",
                "image": "https://www.havtalk.site/og-image.png",
                "description": "AI roleplay platform where you can chat with legendary characters, create unique personas, and experience dynamic storylines.",
              },
              {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HavTalk",
              "description": "Immersive AI roleplay platform where you can chat with legendary characters, create unique personas, and experience dynamic storylines.",
              "url": "https://www.havtalk.site",
              "applicationCategory": "WebApplication",
              "logo": "https://www.havtalk.site/logo.png",
              "image": "https://www.havtalk.site/og-image.png",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Soham Haldar",
                "url": "https://github.com/sohamhaldar"
              },
              "featureList": [
                "AI-powered character conversations",
                "Custom persona creation",
                "Dynamic storytelling",
                "Character avatar generation",
                "Real-time chat sessions"
              ]
            }])
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NSTDJ77Q');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${jost.variable} min-h-screen bg-background font-sans antialiased scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-thumb-gray-800/60`} 
      >
        
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NSTDJ77Q"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}>
            </iframe>
          </noscript>
          <LoaderProvider>
          <AuthProvider>
            <PersonaProvider>
              {children}
              <Analytics />
              <SessionExpiredModal />
              <Toaster/>
            </PersonaProvider>
          </AuthProvider>
          </LoaderProvider>
      </body>
    </html>
  );
}
