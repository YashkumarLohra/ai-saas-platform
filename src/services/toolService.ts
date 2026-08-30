import { apiClient } from "@/lib/api-client";
import { Recommendation } from "@/types/index";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";
import { RecommendRequest } from "@/lib/schemas/recommendation";

function mapApiToolToRecommendation(apiTool: any): Recommendation {
  return {
    id: apiTool.id,
    slug: apiTool.slug,
    name: apiTool.name,
    description: apiTool.description,
    longDescription: apiTool.longDescription || undefined,
    category: apiTool.category,
    reasons: apiTool.reasons || [],
    bestFor: apiTool.bestFor || "",
    pricing: apiTool.pricing || "",
    features: apiTool.features || [],
    pros: apiTool.pros || [],
    cons: apiTool.cons || [],
    websiteUrl: apiTool.websiteUrl || undefined,
    isIntegrated: apiTool.isIntegrated || false,
    inputTypes: apiTool.inputTypes || [],
    outputTypes: apiTool.outputTypes || [],
    difficulty: apiTool.difficulty || "INTERMEDIATE",
    targetAudience: apiTool.targetAudience || [],
  };
}

function mapRankedCandidateToRecommendation(candidate: any): Recommendation {
  const rec = mapApiToolToRecommendation(candidate.tool);
  const reasons: string[] = candidate.reasons || [];
  const preferenceMatchReason = "Matches your interests";
  
  if (reasons.includes(preferenceMatchReason)) {
    rec.isPreferenceMatch = true;
  }
  
  rec.reasons = reasons.filter((reason) => reason !== preferenceMatchReason);
  
  return rec;
}

export const toolService = {
  getTools: async (): Promise<Recommendation[]> => {
    try {
      // In a real app we'd likely use Next.js fetch caching
      // Here we rely on apiClient which defaults to standard fetch
      const res = await apiClient.get('/tools');
      
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(mapApiToolToRecommendation);
      }
      
      // Empty database or success: true but no data
      console.warn("API returned empty tools. Using local fallback.");
      return MOCK_RECOMMENDATIONS;
    } catch (error) {
      console.error("Failed to fetch tools from /api/tools:", error);
      // Fallback to local data on error to prevent UI crash
      return MOCK_RECOMMENDATIONS;
    }
  },
  
  recommendTools: async (request: RecommendRequest, signal?: AbortSignal): Promise<Recommendation[]> => {
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Recommendation API failed with status ${response.status}`);
      }

      const json = await response.json();
      
      if (!json.success || !Array.isArray(json.recommendations)) {
        throw new Error('Invalid recommendation API response format');
      }

      return json.recommendations.map(mapRankedCandidateToRecommendation);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      console.error("Failed to fetch recommendations from /api/recommend:", error);
      throw error;
    }
  }
};
