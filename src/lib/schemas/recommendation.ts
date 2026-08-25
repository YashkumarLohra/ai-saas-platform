import { z } from "zod";

export const RecommendRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  preferredCategories: z.array(z.string()).optional(),
});

export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
