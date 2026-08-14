"use client";

import { useFavorites } from "@/context/FavoritesContext";

interface SaveToolButtonProps {
  slug: string;
  toolName: string;
}

export function SaveToolButton({ slug, toolName }: SaveToolButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(slug);

  return (
    <button 
      onClick={() => toggleFavorite(slug)}
      aria-label={saved ? `Remove ${toolName} from saved tools` : `Save ${toolName}`}
      className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
        saved 
          ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800" 
          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 shadow-sm"
      }`}
    >
      <svg 
        className="w-5 h-5" 
        fill={saved ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={saved ? 0 : 2} 
          d={saved 
              ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              : "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"} 
        />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
