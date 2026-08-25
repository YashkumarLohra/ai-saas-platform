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

export type ExtractionConfidence = "HIGH" | "MEDIUM" | "LOW";

export type ToolPricing = "FREE" | "PAID";
export type ToolMediaType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "CODE" | "DOCUMENT" | "PRESENTATION";
export type ToolDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type ToolAudience = "STUDENTS" | "PROFESSIONALS" | "CREATORS" | "MARKETERS" | "DEVELOPERS" | "DESIGNERS" | "BUSINESS";

export interface StructuredIntent {
  // Original context
  originalQuery: string;
  
  // Hard Constraints (Must Match or NULL)
  requiredPricing: ToolPricing | null;
  requiredInputTypes: ToolMediaType[];
  requiredOutputTypes: ToolMediaType[];
  
  // Soft Ranking Signals (Preferences)
  preferredDifficulty: ToolDifficulty | null;
  inferredAudiences: ToolAudience[];
  inferredCategories: string[];   
  
  // Semantic Search Payload
  semanticCapabilities: string[];
  
  // Confidence metadata
  confidence: {
    overall: ExtractionConfidence;
    ambiguous: boolean;
  };
}
