"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserPreferences } from "@/types/index";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "./AuthContext";
import { preferencesRepository } from "@/services/storage";
import { apiClient } from "@/lib/api-client";

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoadingPreferences: boolean;
  savePreferences: (newPrefs: UserPreferences) => Promise<void>;
  clearPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredCategories: [],
  experienceLevel: undefined,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isMutatingPreferences, setIsMutatingPreferences] = useState(false);
  
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Load from backend on mount and when user changes
  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      if (!user) {
        // Guest mode: load from localStorage
        if (isMounted) {
          setPreferences(preferencesRepository.get(null));
          setIsLoadingPreferences(false);
        }
        return;
      }

      // Authenticated mode: load from backend
      try {
        setIsLoadingPreferences(true);
        const res = (await apiClient.get('/preferences')) as { success: boolean; data: UserPreferences };
        if (isMounted && res.success) {
          setPreferences(res.data || DEFAULT_PREFERENCES);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
        if (isMounted) {
          // If network fails, don't fallback to guest, maintain safe default to prevent data mixing
          setPreferences(DEFAULT_PREFERENCES);
          showToast("Failed to load your preferences.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPreferences(false);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, [user, showToast]);

  // Sync state changes across tabs ONLY for guests (authenticated uses server state)
  useEffect(() => {
    if (user) return; // Don't sync cross-tab local storage if logged in
    
    const handleStorageChange = (e: StorageEvent) => {
      const expectedKey = preferencesRepository.getKey(null);
      if (e.key === expectedKey) {
        setPreferences(preferencesRepository.get(null));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user]);

  const savePreferences = async (newPrefs: UserPreferences) => {
    if (isMutatingPreferences) return;
    setIsMutatingPreferences(true);

    const previousPrefs = { ...preferences };

    // Optimistic UI update
    setPreferences(newPrefs);

    if (!user) {
      // Guest mode
      try {
        preferencesRepository.set(null, newPrefs);
        showToast("Preferences saved successfully.");
      } catch (error) {
        console.error("Failed to save guest preferences:", error);
        setPreferences(previousPrefs);
        showToast("Failed to save preferences.");
      } finally {
        setIsMutatingPreferences(false);
      }
      return;
    }

    // Authenticated mode
    try {
      const res = (await apiClient.put('/preferences', newPrefs)) as { success: boolean; data: UserPreferences };
      if (res.success && res.data) {
        setPreferences(res.data);
        showToast("Preferences saved successfully.");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setPreferences(previousPrefs); // Rollback
      showToast("Failed to save preferences. Please try again.");
    } finally {
      setIsMutatingPreferences(false);
    }
  };

  const clearPreferences = async () => {
    if (isMutatingPreferences) return;
    setIsMutatingPreferences(true);

    const previousPrefs = { ...preferences };

    // Optimistic UI update
    setPreferences(DEFAULT_PREFERENCES);

    if (!user) {
      // Guest mode
      try {
        preferencesRepository.remove(null);
        showToast("Preferences cleared.");
      } catch (error) {
        console.error("Failed to clear guest preferences:", error);
        setPreferences(previousPrefs);
        showToast("Failed to clear preferences.");
      } finally {
        setIsMutatingPreferences(false);
      }
      return;
    }

    // Authenticated mode
    try {
      const res = (await apiClient.put('/preferences', DEFAULT_PREFERENCES)) as { success: boolean; data: UserPreferences };
      if (res.success && res.data) {
        setPreferences(res.data);
        showToast("Preferences cleared.");
      }
    } catch (error) {
      console.error("Failed to clear preferences:", error);
      setPreferences(previousPrefs); // Rollback
      showToast("Failed to clear preferences.");
    } finally {
      setIsMutatingPreferences(false);
    }
  };

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      isLoadingPreferences,
      savePreferences, 
      clearPreferences 
    }}>
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
