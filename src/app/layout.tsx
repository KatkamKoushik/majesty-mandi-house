import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
      <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
        <body className="bg-[#0B0B0C] text-white min-h-screen overflow-x-hidden flex flex-col selection:bg-[#DFB15B] selection:text-[#0B0B0C]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
