import { config } from 'dotenv';
config();

const queries = [
  "debug my React code",
  "review this code for security",
  "generate a realistic product image",
  "research scientific papers",
  "create a natural voiceover",
  "write a marketing article"
];

async function runRegression() {
  for (const q of queries) {
    try {
      const res = await fetch('http://localhost:3000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, userPreferences: { preferredCategories: [] } })
      });
      const data = await res.json();
      console.log(`\nQ: ${q}`);
      if (res.ok && data.recommendations && data.recommendations.length > 0) {
        console.log(`Top match: ${data.recommendations[0].tool.name}`);
      } else {
        console.log(`FAILED / NO TOOLS FOUND`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

runRegression();
