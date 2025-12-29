import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed from local font to Google Font
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { BetaBanner } from "@/components/ui/BetaBanner";

// Force dynamic rendering for all pages to avoid static prerender errors
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StoryScorer - Instant AI feedback on your writing",
  description:
    "Analyze and score your stories based on quality, engagement, and style. The ultimate AI writing companion for storytellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <BetaBanner />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
