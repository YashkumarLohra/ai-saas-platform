"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences } from "@/types/index";
import { useToast } from "@/context/ToastContext";

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
const LOCAL_STORAGE_KEY = "ai_saas_preferences";

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredCategories: [],
  experienceLevel: undefined,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isInitialized) return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Basic validation of stored structure
        setPreferences({
          preferredCategories: Array.isArray(parsed?.preferredCategories) ? parsed.preferredCategories : [],
          experienceLevel: ["beginner", "intermediate", "advanced"].includes(parsed?.experienceLevel) 
            ? parsed.experienceLevel 
            : undefined,
        });
      }
    } catch (error) {
      console.error("Failed to load preferences from localStorage:", error);
    }
    setIsInitialized(true);
  }, [isInitialized]);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
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
  }, []);

  const savePreferences = (newPrefs: UserPreferences) => {
    try {
      setPreferences(newPrefs);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPrefs));
      showToast("Preferences saved successfully.");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      showToast("Failed to save preferences. Please try again.");
    }
  };

  const clearPreferences = () => {
    try {
      setPreferences(DEFAULT_PREFERENCES);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
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
