import { StructuredIntentParsed } from "@/lib/schemas/intent";
import type { Tool } from "@prisma/client";
import { UserPreferences } from "@/types";

export interface RankedCandidate {
  tool: Tool;
  score: number;
  reasons: string[];
}

function normalize(str: string | null | undefined): string {
  return (str || "").toLowerCase().trim();
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const rankingService = {
  rankCandidates(
    intent: StructuredIntentParsed,
    candidates: Tool[],
    preferences?: UserPreferences
  ): RankedCandidate[] {
    if (!candidates || candidates.length === 0) {
      return [];
    }

    const ranked: RankedCandidate[] = candidates.map((candidate) => {
      let score = 0;
      const reasons: string[] = [];

      // CAPABILITY RELEVANCE
      if (intent.semanticCapabilities && intent.semanticCapabilities.length > 0) {
        const intersection = candidate.capabilities.filter(c => intent.semanticCapabilities.includes(c));
        if (intersection.length > 0) {
          score += intersection.length * 2.0; // Specialist capabilities get huge boost
          reasons.push(`Provides required capabilities: ${intersection.join(", ")}.`);
        }
      }

      // DYNAMIC TIE-BREAKERS
      if (candidate.integration === "NATIVE" || candidate.integration === "API") score += 0.3;
      if (candidate.apiAccess === "PUBLIC_API" || candidate.apiAccess === "PAID_API") score += 0.2;
      if (candidate.pricingTier === "FREE" || candidate.pricingTier === "FREEMIUM") score += 0.1;
      if (candidate.capabilities && candidate.capabilities.length > 0) {
        // Reduced generalist bump: slight bump for generalists
        score += candidate.capabilities.length * 0.005;
      }

      // METADATA-BASED REASONS
      // Primary Reason
      if (candidate.bestFor) {
        reasons.push(`Best for: ${candidate.bestFor}`);
      } else if (candidate.features && candidate.features.length > 0) {
        reasons.push(`Key feature: ${candidate.features[0]}`);
      } else {
        reasons.push(`Top-rated in ${candidate.category.toLowerCase()}`);
      }

      // If ambiguous, we still process user preferences but skip strict intent soft signals
      if (!intent.confidence.ambiguous) {
        // Output Type Match (+40 each)
        if (intent.requiredOutputTypes && intent.requiredOutputTypes.length > 0) {
          const matchedOutputs = intent.requiredOutputTypes.filter(out => 
            (candidate.outputTypes || []).includes(out)
          );
          if (matchedOutputs.length > 0) {
            score += matchedOutputs.length * 40;
            reasons.push(`Specializes in generating ${matchedOutputs.join(' and ').toLowerCase()}`);
          }
        }

        // Input Type Match (+30 each)
        if (intent.requiredInputTypes && intent.requiredInputTypes.length > 0) {
          const matchedInputs = intent.requiredInputTypes.filter(inp => 
            (candidate.inputTypes || []).includes(inp)
          );
          if (matchedInputs.length > 0) {
            score += matchedInputs.length * 30;
            // Optionally could add reason here, but to avoid spam we focus on output first
          }
        }

        // Difficulty Match (+15)
        if (intent.preferredDifficulty && candidate.difficulty === intent.preferredDifficulty) {
          score += 15;
        }

        // Audience Match (+15 capped)
        if (intent.inferredAudiences && intent.inferredAudiences.length > 0 && candidate.targetAudience) {
          const audienceOverlap = intent.inferredAudiences.some(aud => 
            candidate.targetAudience.includes(aud)
          );
          if (audienceOverlap) {
            score += 15;
          }
        }

        // Category Match (+10)
        if (intent.inferredCategories && intent.inferredCategories.length > 0 && candidate.category) {
          const normalizedCandidateCat = normalize(candidate.category);
          const hasOverlap = intent.inferredCategories.some(cat => 
            normalizedCandidateCat.includes(normalize(cat)) || normalize(cat).includes(normalizedCandidateCat)
          );
          if (hasOverlap) {
            score += 10;
          }
        }


      }

      // User Preferences Match (+10 max)
      if (preferences && preferences.preferredCategories && preferences.preferredCategories.length > 0 && candidate.category) {
        const normalizedCandidateCat = normalize(candidate.category);
        const hasPrefOverlap = preferences.preferredCategories.some(cat => 
          normalizedCandidateCat.includes(normalize(cat)) || normalize(cat).includes(normalizedCandidateCat)
        );
        if (hasPrefOverlap) {
          score += 10;
        }
      }

      return {
        tool: candidate,
        score,
        reasons: Array.from(new Set(reasons)) // Deduplicate just in case
      };
    });

    // Sort: highest score -> lowest score, tie break: name asc
    // Due to fractional scores, ties should be extremely rare now
    ranked.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.tool.name.localeCompare(b.tool.name);
    });

    return ranked;
  }
};
