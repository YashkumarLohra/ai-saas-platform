import 'dotenv/config';
import { candidateService } from './src/services/candidateService';
import { rankingService } from './src/services/rankingService';

const MOCK_INTENTS = [
  { query: "I need an AI tool with an API.", inferredCategories: [], semanticCapabilities: [], apiRequirement: "ANY", requiredPricing: null, confidence: {} },
  { query: "I need an enterprise API for transcription.", inferredCategories: [], semanticCapabilities: ["transcription"], apiRequirement: "ENTERPRISE", requiredPricing: null, confidence: {} },
  { query: "Help me debug a React application.", inferredCategories: [], semanticCapabilities: ["debugging"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Find peer-reviewed research about microplastics.", inferredCategories: [], semanticCapabilities: ["academic_search", "document_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create a product photograph.", inferredCategories: [], semanticCapabilities: ["image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create a realistic voiceover.", inferredCategories: [], semanticCapabilities: ["voice_cloning"], apiRequirement: "NONE", requiredPricing: null, confidence: {} }
];

async function run() {
  // Override DATABASE_URL with DIRECT_URL to bypass pooler issues on local scripts if necessary
  process.env.DATABASE_URL = process.env.DIRECT_URL;
  
  for (const intent of MOCK_INTENTS) {
    console.log(`\n==================================================`);
    console.log(`QUERY: "${intent.query}"`);
    
    console.log(`INTENT:`, JSON.stringify(intent, null, 2));
    
    // 2. Fetch candidates using the structured intent
    const candidates = await candidateService.getCandidates(intent as any);
    
    // 3. Rank the candidates
    const ranked = rankingService.rankCandidates(intent as any, candidates);
    
    console.log(`CANDIDATE COUNT: ${ranked.length}`);
    
    console.log(`TOP 3:`);
    ranked.slice(0, 3).forEach((r, i) => {
      console.log(`  ${i+1}. ${r.tool.name} (Score: ${r.score})`);
      if (i === 0) {
        console.log(`     API: ${r.tool.apiAccess}, Capabilities: ${r.tool.capabilities?.join(",")}`);
      }
    });
    
    console.log(`STATUS: ${ranked.length > 0 ? "PASS" : "FAIL"}`);
  }
}

run().catch(console.error);
