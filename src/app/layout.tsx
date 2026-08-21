import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { ToastProvider } from "@/context/ToastContext";
import { Navigation } from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Platform",
  description: "Discover the right AI solution for your tasks.",
};

import { PreferencesProvider } from "@/context/PreferencesContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <PreferencesProvider>
            <ProjectsProvider>
              <FavoritesProvider>
                <Navigation />
                <div className="flex-1 flex flex-col">
                  {children}
                </div>
              </FavoritesProvider>
            </ProjectsProvider>
          </PreferencesProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

