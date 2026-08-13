export interface Recommendation {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  reasons: string[];
  bestFor: string;
  pricing: string;
  features: string[];
  pros: string[];
  cons: string[];
  websiteUrl?: string;
}
