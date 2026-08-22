import { Project, UserPreferences } from "@/types/index";

/**
 * Generic Storage Repository Interface
 * 
 * Defines the contract for all data persistence operations in the application.
 * By using this interface, we decouple the application's React state and business
 * logic from the underlying storage mechanism (currently localStorage).
 * 
 * In the future, a BackendRepository implementing this same interface can be
 * created to interact with a REST API or database, requiring zero changes to the UI.
 */
export interface StorageRepository<T> {
  /**
   * Retrieves data for the specified user.
   * If userId is null, it retrieves guest data.
   */
  get(userId: string | null): T;
  
  /**
   * Persists data for the specified user.
   */
  set(userId: string | null, data: T): void;
  
  /**
   * Removes data for the specified user.
   */
  remove(userId: string | null): void;
  
  /**
   * Returns the underlying base key (useful for storage event listeners).
   */
  getBaseKey(): string;
  
  /**
   * Returns the fully namespaced key for a given user.
   */
  getKey(userId: string | null): string;
}

/**
 * LocalStorage Implementation of the StorageRepository
 * 
 * @param baseKey The foundational key (e.g. 'ai_saas_favorites')
 * @param defaultValue The default value to return if no data exists
 * @param validator Optional function to validate and clean the parsed data
 */
export function createLocalStorageRepository<T>(
  baseKey: string, 
  defaultValue: T,
  validator?: (data: any) => T
): StorageRepository<T> {
  const getKey = (userId: string | null) => userId ? `${baseKey}_${userId}` : baseKey;

  return {
    get: (userId: string | null): T => {
      try {
        const stored = localStorage.getItem(getKey(userId));
        if (!stored) return defaultValue;
        
        const parsed = JSON.parse(stored);
        return validator ? validator(parsed) : parsed;
      } catch (error) {
        console.error(`Failed to read ${baseKey} from storage:`, error);
        return defaultValue;
      }
    },
    
    set: (userId: string | null, data: T): void => {
      try {
        localStorage.setItem(getKey(userId), JSON.stringify(data));
      } catch (error) {
        console.error(`Failed to write ${baseKey} to storage:`, error);
        throw error;
      }
    },
    
    remove: (userId: string | null): void => {
      try {
        localStorage.removeItem(getKey(userId));
      } catch (error) {
        console.error(`Failed to remove ${baseKey} from storage:`, error);
      }
    },
    
    getBaseKey: () => baseKey,
    getKey
  };
}

// ============================================================================
// Repository Instances
// ============================================================================

export const favoritesRepository = createLocalStorageRepository<string[]>(
  "ai_saas_favorites",
  [],
  (data) => Array.isArray(data) ? data : []
);

export const projectsRepository = createLocalStorageRepository<Project[]>(
  "ai_saas_projects",
  [],
  (data) => Array.isArray(data) ? data : []
);

export const preferencesRepository = createLocalStorageRepository<UserPreferences>(
  "ai_saas_preferences",
  { preferredCategories: [], experienceLevel: undefined },
  (data) => ({
    preferredCategories: Array.isArray(data?.preferredCategories) ? data.preferredCategories : [],
    experienceLevel: ["beginner", "intermediate", "advanced"].includes(data?.experienceLevel) 
      ? data.experienceLevel 
      : undefined,
  })
);

export const recentlyViewedRepository = createLocalStorageRepository<string[]>(
  "ai_saas_recent_views",
  [],
  (data) => Array.isArray(data) ? data : []
);
