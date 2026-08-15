"use client";

import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "ai_saas_recent_views";
const MAX_RECENT_VIEWS = 5;

export function addRecentlyViewed(slug: string) {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let current: string[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    current = current.filter(s => s !== slug);
    // Add to front
    current.unshift(slug);
    // Limit to 5
    current = current.slice(0, MAX_RECENT_VIEWS);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));
    
    // Dispatch custom event since storage event only fires in OTHER tabs
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (error) {
    console.error("Failed to update recently viewed tools:", error);
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(new Event("recentlyViewedUpdated"));
  } catch (error) {
    console.error("Failed to clear recently viewed tools:", error);
  }
}

export function useRecentlyViewed() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line
        setRecentSlugs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recently viewed tools:", error);
    }
    setIsInitialized(true);
  }, [isInitialized]);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          setRecentSlugs(JSON.parse(stored));
        } else {
          setRecentSlugs([]);
        }
      } catch {
        // ignore
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        loadFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("recentlyViewedUpdated", loadFromStorage);
    
    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("recentlyViewedUpdated", loadFromStorage);
    };
  }, []);

  return recentSlugs;
}
