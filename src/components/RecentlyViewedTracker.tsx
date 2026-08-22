"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/hooks/useRecentlyViewed";

import { useAuth } from "@/context/AuthContext";

export function RecentlyViewedTracker({ slug }: { slug: string }) {
  const { user } = useAuth();
  
  useEffect(() => {
    // Only track if slug exists
    if (slug) {
      // Slight timeout so it doesn't interrupt immediate rendering priority
      const timer = setTimeout(() => addRecentlyViewed(user?.id || null, slug), 500);
      return () => clearTimeout(timer);
    }
  }, [slug, user?.id]);

  return null; // This component renders nothing visually
}
