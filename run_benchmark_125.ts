import { candidateService } from './src/services/candidateService';
import { rankingService } from './src/services/rankingService';

const MOCK_INTENTS = [
  // WRITING
  { query: "Write a professional email to a client.", inferredCategories: ["Writing & Text", "Business"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Write a long-form SEO article.", inferredCategories: ["Writing & Text", "Marketing & SEO"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Rewrite this paragraph professionally.", inferredCategories: ["Writing & Text"], semanticCapabilities: ["text_analysis", "grammar_checking"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Check grammar in this document.", inferredCategories: ["Writing & Text", "Education"], semanticCapabilities: ["grammar_checking", "text_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create persuasive marketing copy.", inferredCategories: ["Writing & Text", "Marketing & SEO"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },

  { query: "Generate a realistic product photograph.", inferredCategories: ["Image Generation", "Marketing & SEO"], semanticCapabilities: ["image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create an artistic concept illustration.", inferredCategories: ["Image Generation", "Design"], semanticCapabilities: ["image_generation", "concept_art"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Generate a minimalist logo.", inferredCategories: ["Image Generation", "Design"], semanticCapabilities: ["image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create an Instagram image.", inferredCategories: ["Image Generation", "Social Media"], semanticCapabilities: ["image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Generate a realistic portrait.", inferredCategories: ["Image Generation", "Photography"], semanticCapabilities: ["image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },

  { query: "Find peer-reviewed research about microplastics.", inferredCategories: ["Research & Analysis", "Education"], semanticCapabilities: ["academic_search", "document_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Research quantum computing.", inferredCategories: ["Research & Analysis"], semanticCapabilities: ["web_search", "academic_search"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Find evidence for a research paper.", inferredCategories: ["Research & Analysis", "Education"], semanticCapabilities: ["academic_search", "document_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Compare scientific studies.", inferredCategories: ["Research & Analysis"], semanticCapabilities: ["document_analysis", "data_analysis", "academic_search"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Analyze a large research document.", inferredCategories: ["Research & Analysis", "Productivity"], semanticCapabilities: ["document_analysis", "summarization"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },

  { query: "Debug my React application.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["debugging", "code_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Review my smart contract for vulnerabilities.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["security_review", "code_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Explain this large codebase.", inferredCategories: ["Coding & Development", "Education"], semanticCapabilities: ["code_analysis", "codebase_chat"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Optimize this SQL query.", inferredCategories: ["Coding & Development", "Data & Databases"], semanticCapabilities: ["code_analysis", "data_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Build a Python web scraper.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["code_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },

  { query: "Create a realistic voiceover.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["text_to_speech", "voice_cloning"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Clone my voice.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["voice_cloning"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Generate natural AI speech.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["text_to_speech", "audio_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Transcribe an interview.", inferredCategories: ["Voice / Audio", "Productivity"], semanticCapabilities: ["transcription"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create an audiobook narration.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["text_to_speech"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },

  { query: "Summarize this YouTube video.", inferredCategories: ["Video Generation", "Productivity"], semanticCapabilities: ["summarization", "video_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Turn this outline into a presentation.", inferredCategories: ["Presentations", "Productivity"], semanticCapabilities: ["text_generation", "presentation_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Remove the background from this image.", inferredCategories: ["Image Generation", "Design"], semanticCapabilities: ["image_editing"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Create a 3D model from this description.", inferredCategories: ["3D Generation", "Design"], semanticCapabilities: ["3d_generation", "image_generation"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  { query: "Research competitors for my startup.", inferredCategories: ["Research & Analysis", "Business"], semanticCapabilities: ["web_search", "data_analysis"], apiRequirement: "NONE", requiredPricing: null, confidence: {} },
  
  // EXTRA HARD CONSTRAINTS TEST (from prompt)
  { query: "I need an AI coding tool with an API.", inferredCategories: ["Coding & Development"], semanticCapabilities: ["code_generation"], apiRequirement: "ANY", requiredPricing: null, confidence: {} },
  { query: "I need an image generation tool with an API.", inferredCategories: ["Image Generation"], semanticCapabilities: ["image_generation"], apiRequirement: "ANY", requiredPricing: null, confidence: {} },
  { query: "I need an enterprise API for transcription.", inferredCategories: ["Voice / Audio"], semanticCapabilities: ["transcription"], apiRequirement: "ENTERPRISE", requiredPricing: null, confidence: {} },
  { query: "I need a free text generator.", inferredCategories: ["Writing & Text"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: "FREE", confidence: {} },
  { query: "I need a freemium text generator.", inferredCategories: ["Writing & Text"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: "FREE", confidence: {} },
  { query: "I need a paid text generator.", inferredCategories: ["Writing & Text"], semanticCapabilities: ["text_generation"], apiRequirement: "NONE", requiredPricing: "PAID", confidence: {} }
];

async function runBenchmark() {
  let noToolCount = 0;
  let totalQueries = MOCK_INTENTS.length;
  let candidateRetrievedTimes: number[] = [];
  let rankingTimes: number[] = [];

  for (const intent of MOCK_INTENTS) {
    try {
      const startCandidate = performance.now();
      const candidates = await candidateService.getCandidates(intent as any);
      const endCandidate = performance.now();
      candidateRetrievedTimes.push(endCandidate - startCandidate);

      const startRanking = performance.now();
      const ranked = rankingService.rankCandidates(intent as any, candidates, { preferredCategories: [] });
      const endRanking = performance.now();
      rankingTimes.push(endRanking - startRanking);

      console.log(`\n========================================================`);
      console.log(`Q: ${intent.query}`);
      console.log(`Intent capabilities: ${intent.semanticCapabilities?.join(", ") || "none"}`);
      console.log(`Intent apiRequirement: ${intent.apiRequirement}`);
      console.log(`Intent requiredPricing: ${intent.requiredPricing}`);
      console.log(`Candidates retrieved: ${candidates.length}`);

      if (ranked && ranked.length > 0) {
        ranked.slice(0, 3).forEach((r, i) => {
          console.log(`${i+1}. ${r.tool.name} (Score: ${r.score.toFixed(3)})`);
          console.log(`   Reasons: ${r.reasons.join(" | ")}`);
        });
      } else {
        console.log(`FAILED / NO TOOLS FOUND`);
        noToolCount++;
      }
    } catch (e) {
      console.error(e);
      noToolCount++;
    }
  }

  const avgCandidateTime = candidateRetrievedTimes.reduce((a, b) => a + b, 0) / candidateRetrievedTimes.length;
  const avgRankingTime = rankingTimes.reduce((a, b) => a + b, 0) / rankingTimes.length;

  console.log(`\n\n=== BENCHMARK METRICS ===`);
  console.log(`Total queries: ${totalQueries}`);
  console.log(`No-tool count: ${noToolCount}`);
  console.log(`Avg Candidate Retrieval Latency: ${avgCandidateTime.toFixed(2)} ms`);
  console.log(`Avg Ranking Latency: ${avgRankingTime.toFixed(2)} ms`);
}

runBenchmark();
