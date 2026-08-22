"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences } from "@/types/index";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "./AuthContext";
import { preferencesRepository } from "@/services/storage";

interface PreferencesContextType {
  preferences: UserPreferences;
  savePreferences: (newPrefs: UserPreferences) => void;
  clearPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

/**
 * TODO (Authentication Readiness):
 * Preferences are currently managed via the preferencesRepository (backed by localStorage).
 * When real authentication is introduced, simply swap the preferencesRepository implementation
 * in `src/services/storage.ts` to use a backend API.
 */

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredCategories: [],
  experienceLevel: undefined,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const { showToast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    setPreferences(preferencesRepository.get(user?.id || null));
  }, [user]);

  // Sync state changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const expectedKey = preferencesRepository.getKey(user?.id || null);
      if (e.key === expectedKey) {
        setPreferences(preferencesRepository.get(user?.id || null));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const savePreferences = (newPrefs: UserPreferences) => {
    try {
      setPreferences(newPrefs);
      preferencesRepository.set(user?.id || null, newPrefs);
      showToast("Preferences saved successfully.");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      showToast("Failed to save preferences. Please try again.");
    }
  };

  const clearPreferences = () => {
    try {
      setPreferences(DEFAULT_PREFERENCES);
      preferencesRepository.remove(user?.id || null);
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
