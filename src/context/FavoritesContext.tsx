"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";
import { apiClient } from "@/lib/api-client";

interface FavoritesContextType {
  favorites: string[];
  isLoadingFavorites: boolean;
  toggleFavorite: (slug: string) => Promise<void>;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      if (!user) {
        if (isMounted) {
          setFavorites([]);
          setIsLoadingFavorites(false);
        }
        return;
      }

      setIsLoadingFavorites(true);
      try {
        const response = await apiClient.get('/favorites');
        if (response && response.success && Array.isArray(response.data)) {
          if (isMounted) {
            setFavorites(response.data.map((fav: any) => fav.tool.slug));
          }
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
        if (isMounted) {
          setFavorites([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingFavorites(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleFavorite = async (slug: string) => {
    if (!user) {
      showToast("Please log in to save favorites.");
      return;
    }

    const isSaved = favorites.includes(slug);
    
    // Optimistic UI update
    setFavorites((prev) => 
      isSaved ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

    try {
      if (isSaved) {
        await apiClient.delete(`/favorites/${slug}`);
        showToast("Removed from Favorites");
      } else {
        await apiClient.post('/favorites', { slug });
        showToast("Saved to Favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert optimistic update on failure
      setFavorites((prev) => 
        isSaved ? [...prev, slug] : prev.filter((s) => s !== slug)
      );
      showToast("Failed to update favorites. Please try again.");
    }
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return (
    <FavoritesContext.Provider value={{ favorites, isLoadingFavorites, toggleFavorite, isFavorite }}>
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
