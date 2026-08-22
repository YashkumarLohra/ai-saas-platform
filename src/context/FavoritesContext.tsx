"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "./ToastContext";

import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

/**
 * TODO (Authentication Readiness):
 * Favorites are currently stored globally in localStorage for demo purposes.
 * This is NOT secure production user storage.
 * When real authentication is introduced, this context should:
 * 1. Read/write to a backend database associated with the authenticated user ID.
 * 2. Clear favorites from memory upon logout.
 * 3. Not store user-specific data in localStorage.
 */
const LOCAL_STORAGE_KEY_BASE = "ai_saas_favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { showToast } = useToast();
  const { user } = useAuth();

  const getStorageKey = () => user ? `${LOCAL_STORAGE_KEY_BASE}_${user.id}` : LOCAL_STORAGE_KEY_BASE;

  // Load from localStorage on mount and when user changes
  useEffect(() => {
    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        // eslint-disable-next-line
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    }
  }, [user]);


  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const key = getStorageKey();
      if (e.key === key && e.newValue) {
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
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(newFavorites));
        
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
