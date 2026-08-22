"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { favoritesRepository } from "@/services/storage";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * TODO (Authentication Readiness):
 * Favorites are currently managed via the favoritesRepository (backed by localStorage).
 * When real authentication is introduced, simply swap the favoritesRepository implementation
 * in `src/services/storage.ts` to use a backend API.
 */

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Load from storage on mount and when user changes
  useEffect(() => {
    setFavorites(favoritesRepository.get(user?.id || null));
  }, [user]);


  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const expectedKey = favoritesRepository.getKey(user?.id || null);
      if (e.key === expectedKey && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const isSaved = prev.includes(slug);
      const newFavorites = isSaved 
        ? prev.filter((s) => s !== slug) 
        : [...prev, slug];
      
      try {
        favoritesRepository.set(user?.id || null, newFavorites);
        
        // Show toast notification
        if (isSaved) {
          showToast("Removed from Favorites");
        } else {
          showToast("Saved to Favorites");
        }
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
        showToast("Something went wrong. Please try again.");
      }
      return newFavorites;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

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
