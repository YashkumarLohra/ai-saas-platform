"use client";

import { useEffect } from "react";
import { useRecentlyViewedContext } from "@/context/RecentlyViewedContext";

export function RecentlyViewedTracker({ slug }: { slug: string }) {
  const { addRecentlyViewed } = useRecentlyViewedContext();
  
  useEffect(() => {
    // Only track if slug exists
    if (slug) {
      // Slight timeout so it doesn't interrupt immediate rendering priority
      const timer = setTimeout(() => addRecentlyViewed(slug), 500);
      return () => clearTimeout(timer);
    }
  }, [slug, addRecentlyViewed]);

  return null; // This component renders nothing visually
}
