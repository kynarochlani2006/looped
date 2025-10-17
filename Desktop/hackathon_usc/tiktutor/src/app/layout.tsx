import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { BackgroundFX } from "@/components/BackgroundFX";
import { PageTransition } from "@/components/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Looped — AI Study Reels",
  description: "Transform textbooks into vertical micro lessons, complete with quizzes and cinematic overlays.",
  openGraph: {
    title: "Looped — AI Study Reels",
    description: "Upload textbooks, auto-generate TikTok-style study clips, and keep learners engaged.",
    url: "https://looped.app",
    siteName: "Looped",
  },
  twitter: {
    card: "summary_large_image",
    title: "Looped — AI Study Reels",
    description: "AI pipeline that builds cinematic study reels from any PDF.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <header className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#0A0A0A]/70 border-b border-white/10">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-sm text-white">
            <Link href="/" className="font-semibold tracking-tight text-[#FF6B00] drop-shadow-[0_0_20px_rgba(255,107,0,0.6)]">Looped</Link>
            <div className="flex items-center gap-4">
              <Link href="/feed" className="opacity-80 hover:opacity-100">Feed</Link>
              <Link href="/explore" className="opacity-80 hover:opacity-100">Explore</Link>
              <Link href="/upload" className="opacity-80 hover:opacity-100">Upload</Link>
              <Link href="/profile" className="opacity-80 hover:opacity-100">Profile</Link>
            </div>
          </nav>
        </header>
        <div className="mx-auto max-w-5xl w-full">
          <BackgroundFX />
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
