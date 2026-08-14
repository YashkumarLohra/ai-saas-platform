"use client";

import { useEffect } from "react";
import { addRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Only track if slug exists
    if (slug) {
      // Slight timeout so it doesn't interrupt immediate rendering priority
      const timer = setTimeout(() => addRecentlyViewed(slug), 500);
      return () => clearTimeout(timer);
    }
  }, [slug]);

  return null; // This component renders nothing visually
}
