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
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
      }
      return newFavorites;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  // Return a context provider, but to avoid hydration mismatch, 
  // you might conditionally render children if strict matching is required.
  // However, returning children is usually fine as long as components safely handle the empty state.
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
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
