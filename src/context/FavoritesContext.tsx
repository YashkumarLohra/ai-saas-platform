"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "ai_saas_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const isSaved = prev.includes(slug);
      const newFavorites = isSaved 
        ? prev.filter((s) => s !== slug) 
        : [...prev, slug];
      
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newFavorites));
        
        // Show toast notification
        if (isSaved) {
          showToast("Removed from Favorites");
        } else {
          showToast("Saved to Favorites");
        }
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
      }
      return newFavorites;
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
      {/* Lightweight Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl rounded-full px-6 py-3 flex items-center gap-3 border border-gray-800 dark:border-gray-200">
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold text-sm whitespace-nowrap">{toastMessage}</span>
          </div>
        </div>
      )}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
