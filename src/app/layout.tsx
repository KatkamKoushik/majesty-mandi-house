import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Playfair_Display, Montserrat, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Majesty Mandi House | Premium Authentic Arabian Dining",
  description: "Experience the Legacy of Authentic Arabian Dining in Hanamkonda. Jaw-dropping ambience and the finest Mandi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${montserrat.variable} ${cinzel.variable} scroll-smooth`}>
        <body suppressHydrationWarning className="bg-[#0B0B0C] text-white min-h-screen overflow-x-hidden flex flex-col selection:bg-[#DFB15B] selection:text-[#0B0B0C]">
          <div className="w-full py-6 px-4 flex flex-col items-center justify-center text-center relative z-[100] overflow-hidden">
            {/* HTML5 Video Background */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/ambiance/gold-particles.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 z-0 pointer-events-none" />
            
            <p className="font-montserrat text-[11px] md:text-[13px] font-semibold uppercase text-white tracking-[0.3em] mb-2 relative z-10">
              CURRENTLY AVAILABLE FOR SHOWCASE PURPOSES.
            </p>
            <p 
              className="font-cinzel text-sm md:text-base text-white uppercase tracking-[0.3em] relative z-10"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 0 15px rgba(255, 255, 255, 0.3)" }}
            >
              A CUSTOM WEB EXPERIENCE BUILT BY KOUSHIK &amp; VYSHNAVI.
            </p>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
