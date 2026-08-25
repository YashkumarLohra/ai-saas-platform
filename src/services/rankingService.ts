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

      // If ambiguous, we still process user preferences but skip strict intent soft signals
      if (!intent.confidence.ambiguous) {
        // Output Type Match (+40 each)
        if (intent.requiredOutputTypes && intent.requiredOutputTypes.length > 0) {
          const matchedOutputs = intent.requiredOutputTypes.filter(out => 
            (candidate.outputTypes || []).includes(out)
          );
          if (matchedOutputs.length > 0) {
            score += matchedOutputs.length * 40;
            reasons.push(`Matches requested output type(s): ${matchedOutputs.join(", ")}`);
          }
        }

        // Input Type Match (+30 each)
        if (intent.requiredInputTypes && intent.requiredInputTypes.length > 0) {
          const matchedInputs = intent.requiredInputTypes.filter(inp => 
            (candidate.inputTypes || []).includes(inp)
          );
          if (matchedInputs.length > 0) {
            score += matchedInputs.length * 30;
            reasons.push(`Matches requested input type(s): ${matchedInputs.join(", ")}`);
          }
        }

        // Difficulty Match (+15)
        if (intent.preferredDifficulty && candidate.difficulty === intent.preferredDifficulty) {
          score += 15;
          reasons.push(`Matches preferred difficulty: ${intent.preferredDifficulty}`);
        }

        // Audience Match (+15 capped)
        if (intent.inferredAudiences && intent.inferredAudiences.length > 0 && candidate.targetAudience) {
          const audienceOverlap = intent.inferredAudiences.some(aud => 
            candidate.targetAudience.includes(aud)
          );
          if (audienceOverlap) {
            score += 15;
            reasons.push(`Tailored for your target audience`);
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
            reasons.push(`Matches inferred category`);
          }
        }

        // Semantic Capabilities (+20 each, max +40)
        if (intent.semanticCapabilities && intent.semanticCapabilities.length > 0) {
          const searchableText = normalize(
            [
              candidate.name,
              candidate.description,
              candidate.bestFor,
              ...(candidate.features || [])
            ].join(" ")
          );

          let semScore = 0;
          const matchedSems = [];
          for (const cap of intent.semanticCapabilities) {
            if (semScore >= 40) break;
            const normalizedCap = normalize(cap);
            if (!normalizedCap) continue;
            
            const escapedCap = escapeRegExp(normalizedCap);
            const regex = new RegExp(`\\b${escapedCap}\\b`, 'i');
            
            if (regex.test(searchableText)) {
              semScore += 20;
              matchedSems.push(cap);
            }
          }

          if (semScore > 0) {
            score += semScore;
            reasons.push(`Provides required capabilities: ${matchedSems.join(", ")}`);
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
          reasons.push(`Matches your saved category preferences`);
        }
      }

      return {
        tool: candidate,
        score,
        reasons
      };
    });

    // Sort: highest score -> lowest score, tie break: name asc
    ranked.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.tool.name.localeCompare(b.tool.name);
    });

    return ranked;
  }
};
