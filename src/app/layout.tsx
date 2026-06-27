import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlanProvider } from "@/context/PlanContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SkillPath AI — Personalized vocational learning paths",
  description:
    "AI-generated, week-by-week learning plans for trades and hands-on skills. Adapts to your feedback.",
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
