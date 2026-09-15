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

  isPreferenceMatch?: boolean;
  inputTypes?: string[];
  outputTypes?: string[];
  capabilities?: string[];
  limitations?: string[];
  difficulty?: string;
  targetAudience?: string[];
  
  pricingTier?: PricingTier;
  apiAccess?: ApiAccessLevel;
  integration?: IntegrationType;
  

  affiliateUrl?: string;
  lastVerifiedAt?: string;
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

export type PricingTier = "FREE" | "FREEMIUM" | "PAID" | "ENTERPRISE" | "UNKNOWN";
export type ApiAccessLevel = "NO_API" | "PUBLIC_API" | "PAID_API" | "ENTERPRISE_API" | "RESTRICTED_API" | "UNKNOWN";
export type IntegrationType = "EXTERNAL" | "API" | "NATIVE" | "EMBED" | "UNKNOWN";

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
