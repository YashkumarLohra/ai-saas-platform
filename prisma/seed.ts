import prisma from '../src/lib/prisma';
import { MOCK_RECOMMENDATIONS } from '../src/data/recommendations';

async function main() {
  console.log(`Starting production seed of Tool catalog...`);
  console.log(`Discovered ${MOCK_RECOMMENDATIONS.length} records in the static catalog.`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let invalid = 0;

  for (const tool of MOCK_RECOMMENDATIONS) {
    // 1. Data Validation
    if (!tool.slug || !tool.name || !tool.description) {
      console.warn(`[WARNING] Skipping tool with missing required fields (slug/name/description). Data: ${JSON.stringify(tool)}`);
      invalid++;
      continue;
    }

    try {
      // 2. Check if it already exists (to determine if insert vs update for logging)
      const existing = await prisma.tool.findUnique({
        where: { slug: tool.slug }
      });

      const dbToolData = {
        name: tool.name,
        description: tool.description,
        longDescription: tool.longDescription || null,
        category: tool.category,
        pricing: tool.pricing || null,
        websiteUrl: tool.websiteUrl || null,
        reasons: tool.reasons || [],
        bestFor: tool.bestFor || null,
        features: tool.features || [],
        pros: tool.pros || [],
        cons: tool.cons || [],
        isIntegrated: tool.isIntegrated || false,
        isPreferenceMatch: tool.isPreferenceMatch || false,
      };

      // 3. Upsert Strategy (Idempotent)
      await prisma.tool.upsert({
        where: { slug: tool.slug },
        update: dbToolData,
        create: {
          slug: tool.slug,
          ...dbToolData
        },
      });

      if (existing) {
        updated++;
        console.log(`[UPDATED] ${tool.slug}`);
      } else {
        inserted++;
        console.log(`[INSERTED] ${tool.slug}`);
      }

    } catch (error) {
      console.error(`[ERROR] Failed to upsert tool: ${tool.slug}`, error);
      skipped++;
    }
  }

  const finalCount = await prisma.tool.count();

  console.log(`\n==================================================`);
  console.log(`SEED COMPLETE`);
  console.log(`==================================================`);
  console.log(`Total Source Records: ${MOCK_RECOMMENDATIONS.length}`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (Errors): ${skipped}`);
  console.log(`Skipped (Invalid): ${invalid}`);
  console.log(`\nFinal Database Tool Count: ${finalCount}`);
  console.log(`==================================================\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
