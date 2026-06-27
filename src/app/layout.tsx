import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlanProvider } from "@/context/PlanContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SkillPath AI — Personalized language learning paths",
  description:
    "AI-generated, week-by-week study plans for Spanish, English, French, Italian, Ancient Greek and Latin. Adapts to your feedback.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <PlanProvider>{children}</PlanProvider>
      </body>
    </html>
  );
}
