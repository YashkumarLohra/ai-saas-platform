import { RecommendRequest } from "@/lib/schemas/recommendation";
import { StructuredIntentParsed, StructuredIntentSchema } from "@/lib/schemas/intent";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Service for extracting Structured Intent from a user query using Google Gemini.
 */
export const intentService = {
  async extractIntent(request: RecommendRequest): Promise<StructuredIntentParsed> {
    try {
      // Provide the user context and explicit requirements to the model
      let prompt = `User Query: "${request.query}"\n`;
      if (request.experienceLevel) {
        prompt += `User Experience Level Context: ${request.experienceLevel}\n`;
      }
      if (request.preferredCategories && request.preferredCategories.length > 0) {
        prompt += `User Preferred Categories Context: ${request.preferredCategories.join(", ")}\n`;
      }

      const { object } = await generateObject({
        model: google("gemini-3.6-flash"),
        schema: StructuredIntentSchema,
        system: `You are an AI tool intent extraction engine.
Convert the user's natural-language request into the provided StructuredIntent schema.
Extract explicit requirements accurately.
Do not hallucinate missing constraints.
Use hard constraints only for explicit requirements.
Use soft signals for preferences and inferred context.
Return only structured data matching the schema.

Allowed values for ToolPricing: "FREE" | "PAID"
Allowed values for ToolMediaType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "CODE" | "DOCUMENT" | "PRESENTATION"
Allowed values for ToolDifficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
Allowed values for ToolAudience: "STUDENTS" | "PROFESSIONALS" | "CREATORS" | "MARKETERS" | "DEVELOPERS" | "DESIGNERS" | "BUSINESS"

Rules:
- If a constraint is not explicitly stated, return null (for scalars) or [] (for arrays).
- Never invent constraints.
- requiredPricing is a hard constraint (e.g. if the user says "free").
- apiRequirement is a hard constraint. Set to "NONE" by default. Set to "ANY" if they just ask for an API. Set to "ENTERPRISE" if they explicitly need an enterprise API. Set to "PUBLIC_OR_PAID" if they explicitly want a public/paid API.
- requiredInputTypes / requiredOutputTypes are soft constraints for older integrations (do not rely on them heavily).
- preferredDifficulty is a soft signal. Treat "professional" as ADVANCED, "no experience" as BEGINNER, etc.
- inferredAudiences are soft signals (e.g. "for college" = STUDENTS).
- semanticCapabilities must be chosen from the following exact vocabulary:
  TEXT: text_generation, text_analysis, summarization, translation, grammar_checking, presentation_generation
  CODE: code_generation, code_analysis, debugging, security_review, codebase_chat
  IMAGE: image_generation, image_editing, image_upscaling, concept_art, 3d_generation
  AUDIO: text_to_speech, voice_cloning, audio_generation, transcription
  RESEARCH: web_search, academic_search, document_analysis, data_analysis, video_analysis
- If the query is vague (e.g., "Help me work faster"), set confidence.ambiguous = true and return empty arrays/nulls.`,
        prompt: prompt,
      });

      return object;
    } catch (error) {
      console.error("Gemini Intent Extraction Error:", error);
      throw new Error("Failed to extract intent from query");
    }
  }
};
