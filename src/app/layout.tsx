import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5', // Indigo-600
};

export const metadata: Metadata = {
  title: "SmartFit AI - Vaša digitalna omara in stilist",
  description: "Organizirajte svojo omaro in si s pomočjo naprednega AI algoritma sestavite popoln outfit na podlagi vašega razpoloženja in modnega stila.",
  keywords: ["moda", "digitalna omara", "outfit", "AI stilist", "SmartFit", "PWA"],
  authors: [{ name: "SmartFit Team" }],
  creator: "SmartFit Team",
  openGraph: {
    title: "SmartFit AI - Vaša digitalna omara",
    description: "Sestavi popoln outfit z umetno inteligenco glede na svoje razpoloženje.",
    url: "https://smartfit-ai.si",
    siteName: "SmartFit AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SmartFit AI digitalna omara",
      },
    ],
    locale: "sl_SI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartFit AI - Vaša digitalna omara",
    description: "Sestavi popoln outfit z umetno inteligenco glede na svoje razpoloženje.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // JSON-LD structured data for the WebApp
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SmartFit AI",
    "url": "https://smartfit-ai.si",
    "description": "Digitalna omara in pametni AI stilist, ki generira outfite glede na vaše razpoloženje in teorijo barv.",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  };

  return (
    <html lang="sl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* We apply Inter font and global background color here. 
          The page.tsx handles the specific radial gradients for the background. */}
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
