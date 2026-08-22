"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences } from "@/types/index";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "./AuthContext";

interface PreferencesContextType {
  preferences: UserPreferences;
  savePreferences: (newPrefs: UserPreferences) => void;
  clearPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

/**
 * TODO (Authentication Readiness):
 * Preferences are currently stored globally in localStorage for demo purposes.
 * This is NOT secure production user storage.
 * When real authentication is introduced, this context should:
 * 1. Read/write to a backend database associated with the authenticated user ID.
 * 2. Clear preferences from memory upon logout.
 * 3. Not store user-specific data in localStorage.
 */
const LOCAL_STORAGE_KEY_BASE = "ai_saas_preferences";

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredCategories: [],
  experienceLevel: undefined,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const getStorageKey = () => user ? `${LOCAL_STORAGE_KEY_BASE}_${user.id}` : LOCAL_STORAGE_KEY_BASE;

  useEffect(() => {
    try {
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic validation of stored structure
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreferences({
          preferredCategories: Array.isArray(parsed?.preferredCategories) ? parsed.preferredCategories : [],
          experienceLevel: ["beginner", "intermediate", "advanced"].includes(parsed?.experienceLevel) 
            ? parsed.experienceLevel 
            : undefined,
        });
      } else {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage:", error);
    }
  }, [user]);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const key = getStorageKey();
      if (e.key === key) {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            setPreferences({
              preferredCategories: Array.isArray(parsed?.preferredCategories) ? parsed.preferredCategories : [],
              experienceLevel: ["beginner", "intermediate", "advanced"].includes(parsed?.experienceLevel) 
                ? parsed.experienceLevel 
                : undefined,
            });
          } else {
            setPreferences(DEFAULT_PREFERENCES);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const savePreferences = (newPrefs: UserPreferences) => {
    try {
      setPreferences(newPrefs);
      const key = getStorageKey();
      localStorage.setItem(key, JSON.stringify(newPrefs));
      showToast("Preferences saved successfully.");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      showToast("Failed to save preferences. Please try again.");
    }
  };

  const clearPreferences = () => {
    try {
      setPreferences(DEFAULT_PREFERENCES);
      const key = getStorageKey();
      localStorage.removeItem(key);
      showToast("Preferences cleared.");
    } catch (error) {
      console.error("Failed to clear preferences:", error);
      showToast("Failed to clear preferences.");
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, savePreferences, clearPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
