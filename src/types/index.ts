export interface Recommendation {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  reasons: string[];
  bestFor: string;
  pricing: string;
  features: string[];
  pros: string[];
  cons: string[];
  websiteUrl?: string;
  isIntegrated?: boolean;
  isPreferenceMatch?: boolean;
  inputTypes?: string[];
  outputTypes?: string[];
  difficulty?: string;
  targetAudience?: string[];
}

export interface TaskContext {
  query: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  toolIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface UserPreferences {
  preferredCategories: string[];
  experienceLevel?: ExperienceLevel;
}
