import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const displayFont = Inter({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CampusRide - University Ride-Sharing",
  description: "Real-time, convenient, and safe ride-sharing for university campuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} font-body antialiased min-h-screen bg-background text-foreground`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
