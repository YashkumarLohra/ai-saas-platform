import { apiClient } from "@/lib/api-client";
import { Recommendation } from "@/types/index";
import { MOCK_RECOMMENDATIONS } from "@/data/recommendations";

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
    isPreferenceMatch: apiTool.isPreferenceMatch || false,
  };
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
  }
};
