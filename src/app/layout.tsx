import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
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
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ToolsProvider } from "@/context/ToolsContext";
import { toolService } from "@/services/toolService";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const tools = await toolService.getTools();
  
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToolsProvider initialTools={tools}>
          <ToastProvider>
            <AuthProvider>
            <PreferencesProvider>
              <ProjectsProvider>
                <FavoritesProvider>
                  <RecentlyViewedProvider>
                    <Navigation />
                    <div className="flex-1 flex flex-col">
                      {children}
                    </div>
                  </RecentlyViewedProvider>
                </FavoritesProvider>
              </ProjectsProvider>
            </PreferencesProvider>
          </AuthProvider>
        </ToastProvider>
      </ToolsProvider>
    </body>
  </html>
  );
}

