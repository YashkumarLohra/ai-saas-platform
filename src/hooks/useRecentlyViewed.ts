"use client";

import { useEffect, useState } from "react";
import { recentlyViewedRepository } from "@/services/storage";
import { useAuth } from "@/context/AuthContext";

const MAX_RECENT_VIEWS = 12;

export function addRecentlyViewed(userId: string | null, slug: string) {
  try {
    let current = recentlyViewedRepository.get(userId);

    // Remove if already exists
    current = current.filter(s => s !== slug);
    // Add to front
    current.unshift(slug);
    // Limit to 12
    current = current.slice(0, MAX_RECENT_VIEWS);

    recentlyViewedRepository.set(userId, current);
    
    // Dispatch custom event since storage event only fires in OTHER tabs
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (error) {
    console.error("Failed to update recently viewed tools:", error);
  }
}

export function clearRecentlyViewed(userId: string | null) {
  try {
    recentlyViewedRepository.remove(userId);
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (error) {
    console.error("Failed to clear recently viewed tools:", error);
  }
}

export function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    setRecentSlugs(recentlyViewedRepository.get(user?.id || null));
  }, [user]);

  useEffect(() => {
    const loadFromStorage = () => {
      setRecentSlugs(recentlyViewedRepository.get(user?.id || null));
    };

    const handleStorageEvent = (e: StorageEvent) => {
      const expectedKey = recentlyViewedRepository.getKey(user?.id || null);
      if (e.key === expectedKey) {
        loadFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("recentlyViewedUpdated", loadFromStorage);
    
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("recentlyViewedUpdated", loadFromStorage);
    };
  }, [user]);

  return recentSlugs;
}
