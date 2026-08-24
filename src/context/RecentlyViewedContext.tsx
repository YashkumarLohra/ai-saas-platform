"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { recentlyViewedRepository } from "@/services/storage";
import { apiClient } from "@/lib/api-client";

const MAX_RECENT_VIEWS = 12;

interface RecentlyViewedContextType {
  recentSlugs: string[];
  isLoadingRecent: boolean;
  addRecentlyViewed: (slug: string) => Promise<void>;
  clearRecentlyViewed: () => Promise<void>;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  
  const { user } = useAuth();
  
  // Load from backend on mount and when user changes
  useEffect(() => {
    let isMounted = true;

    async function loadRecentlyViewed() {
      if (!user) {
        // Guest mode: load from localStorage
        if (isMounted) {
          setRecentSlugs(recentlyViewedRepository.get(null));
          setIsLoadingRecent(false);
        }
        return;
      }

      // Authenticated mode: load from backend
      try {
        setIsLoadingRecent(true);
        const res = (await apiClient.get('/recent')) as { success: boolean; data: string[] };
        if (isMounted && res.success) {
          setRecentSlugs(res.data || []);
        }
      } catch (error) {
        console.error("Failed to load recently viewed:", error);
        if (isMounted) {
          setRecentSlugs([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecent(false);
        }
      }
    }

    loadRecentlyViewed();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Sync state changes across tabs ONLY for guests (authenticated uses server state)
  useEffect(() => {
    if (user) return; // Don't sync cross-tab local storage if logged in
    
    const handleStorageChange = (e: StorageEvent) => {
      const expectedKey = recentlyViewedRepository.getKey(null);
      if (e.key === expectedKey) {
        setRecentSlugs(recentlyViewedRepository.get(null));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const addRecentlyViewed = useCallback(async (slug: string) => {
    if (!slug) return;

    // Optimistic UI update
    const previousSlugs = [...recentSlugs];
    
    // Remove if already exists and add to front, limit to MAX
    const newSlugs = [slug, ...previousSlugs.filter(s => s !== slug)].slice(0, MAX_RECENT_VIEWS);
    setRecentSlugs(newSlugs);

    if (!user) {
      // Guest mode
      try {
        recentlyViewedRepository.set(null, newSlugs);
      } catch (error) {
        console.error("Failed to save guest recently viewed:", error);
        setRecentSlugs(previousSlugs);
      }
      return;
    }

    // Authenticated mode
    try {
      const res = (await apiClient.post('/recent', { slug })) as { success: boolean; data: string[] };
      if (res.success && res.data) {
        setRecentSlugs(res.data);
      }
    } catch (error) {
      console.error("Failed to save recently viewed:", error);
      setRecentSlugs(previousSlugs); // Rollback
    }
  }, [recentSlugs, user]);

  const clearRecentlyViewed = async () => {
    if (isMutating) return;
    setIsMutating(true);

    const previousSlugs = [...recentSlugs];

    // Optimistic UI update
    setRecentSlugs([]);

    if (!user) {
      // Guest mode
      try {
        recentlyViewedRepository.remove(null);
      } catch (error) {
        console.error("Failed to clear guest recently viewed:", error);
        setRecentSlugs(previousSlugs);
      } finally {
        setIsMutating(false);
      }
      return;
    }

    // Authenticated mode
    try {
      const res = (await apiClient.delete('/recent')) as { success: boolean };
      if (!res.success) {
        setRecentSlugs(previousSlugs); // Rollback if API says success: false
      }
    } catch (error) {
      console.error("Failed to clear recently viewed:", error);
      setRecentSlugs(previousSlugs); // Rollback
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <RecentlyViewedContext.Provider value={{ 
      recentSlugs, 
      isLoadingRecent,
      addRecentlyViewed, 
      clearRecentlyViewed 
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewedContext() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error("useRecentlyViewedContext must be used within a RecentlyViewedProvider");
  }
  return context;
}
