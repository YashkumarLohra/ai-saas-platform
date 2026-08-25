import { z } from "zod";

// Mapping exactly to the types in src/types/index.ts

export const ToolPricingSchema = z.enum(["FREE", "PAID"]);

export const ToolMediaTypeSchema = z.enum([
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "CODE",
  "DOCUMENT",
  "PRESENTATION"
]);

export const ToolDifficultySchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED"
]);

export const ToolAudienceSchema = z.enum([
  "STUDENTS",
  "PROFESSIONALS",
  "CREATORS",
  "MARKETERS",
  "DEVELOPERS",
  "DESIGNERS",
  "BUSINESS"
]);

export const ExtractionConfidenceSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const StructuredIntentSchema = z.object({
  originalQuery: z.string().min(1, "Original query must be a non-empty string"),
  
  requiredPricing: ToolPricingSchema.nullable(),
  requiredInputTypes: z.array(ToolMediaTypeSchema),
  requiredOutputTypes: z.array(ToolMediaTypeSchema),
  
  preferredDifficulty: ToolDifficultySchema.nullable(),
  inferredAudiences: z.array(ToolAudienceSchema),
  inferredCategories: z.array(z.string()),
  
  semanticCapabilities: z.array(z.string()),
  
  confidence: z.object({
    overall: ExtractionConfidenceSchema,
    ambiguous: z.boolean(),
  }),
});

export type StructuredIntentParsed = z.infer<typeof StructuredIntentSchema>;
