import prisma from "@/lib/prisma";
import { StructuredIntentParsed } from "@/lib/schemas/intent";
import { Prisma } from "@prisma/client";

export const candidateService = {
  async getCandidates(intent: StructuredIntentParsed) {
    // If the query is entirely ambiguous, ignore all hard filters
    // and retrieve up to 20 deterministic results.
    if (intent.confidence.ambiguous) {
      return prisma.tool.findMany({
        take: 20,
        orderBy: { name: "asc" },
      });
    }

    // Define strict hard constraints
    const where: Prisma.ToolWhereInput = {};

    if (intent.requiredPricing === "FREE") {
      where.pricingTier = {
        in: ["FREE", "FREEMIUM"]
      };
    }
    // Note: If requiredPricing is "PAID", we do not apply a hard filter
    // because freemium tools are often still applicable.

    if (intent.apiRequirement && intent.apiRequirement !== "NONE") {
      if (intent.apiRequirement === "ANY") {
        where.apiAccess = { in: ["PUBLIC_API", "PAID_API", "ENTERPRISE_API", "RESTRICTED_API"] };
      } else if (intent.apiRequirement === "ENTERPRISE") {
        where.apiAccess = { in: ["ENTERPRISE_API"] };
      } else if (intent.apiRequirement === "PUBLIC_OR_PAID") {
        where.apiAccess = { in: ["PUBLIC_API", "PAID_API"] };
      }
    }

    const OR: Prisma.ToolWhereInput[] = [];

    if (intent.inferredCategories && intent.inferredCategories.length > 0) {
      OR.push({ category: { in: intent.inferredCategories } });
    }

    if (intent.semanticCapabilities && intent.semanticCapabilities.length > 0) {
      OR.push({ capabilities: { hasSome: intent.semanticCapabilities } });
    }

    if (OR.length > 0) {
      where.OR = OR;
    }

    const candidates = await prisma.tool.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return candidates;
  }
};
