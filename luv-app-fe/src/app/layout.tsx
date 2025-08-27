import type { Metadata } from "next";
import { Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AnimatedBackground } from "@/components/ui";
import { ThemeProvider } from "@/lib/contexts/theme-context";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luv Live Stream Application",
  description: "Professional live streaming platform",
  keywords: "live stream, video, streaming",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AnimatedBackground />
          <Header />
          <main style={{ paddingTop: "var(--header-height)" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
