import { candidateService } from './src/services/candidateService';
import { rankingService } from './src/services/rankingService';

const MOCK_INTENTS = [
  { query: "Review my smart contract code for security vulnerabilities.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["security_review", "code_analysis", "debugging"], requiresApi: false, confidence: {} },
  { query: "Debug my React application.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["debugging", "code_analysis"], requiresApi: false, confidence: {} },
  { query: "Generate a realistic product image.", inferredCategories: ["Image Generation"], semanticCapabilities: ["image_generation"], requiresApi: false, confidence: {} },
  { query: "Create a realistic voiceover for my video.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["text_to_speech", "voice_cloning"], requiresApi: false, confidence: {} },
  { query: "Find peer-reviewed research about microplastics.", inferredCategories: ["Research & Analysis"], semanticCapabilities: ["academic_search", "document_analysis"], requiresApi: false, confidence: {} },
  { query: "I need an AI coding tool with an API.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["code_generation"], requiresApi: true, confidence: {} },
];

async function runMockRegression() {
  for (const intent of MOCK_INTENTS) {
    try {
      const candidates = await candidateService.getCandidates(intent as any);
      const ranked = rankingService.rankCandidates(intent as any, candidates, { preferredCategories: [] });
      console.log(`\n========================================================`);
      console.log(`Q: ${intent.query}`);
      console.log(`Intent capabilities: ${intent.semanticCapabilities.join(", ")}`);
      console.log(`Intent requiresApi: ${intent.requiresApi}`);
      if (ranked && ranked.length > 0) {
        ranked.slice(0, 3).forEach((r, i) => {
          console.log(`${i+1}. ${r.tool.name} (Score: ${r.score.toFixed(3)})`);
          console.log(`   Reasons: ${r.reasons.join(" | ")}`);
        });
      } else {
        console.log(`FAILED / NO TOOLS FOUND`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

runMockRegression();
