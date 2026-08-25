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
      where.pricing = {
        contains: "Free",
        mode: "insensitive",
      };
    }
    // Note: If requiredPricing is "PAID", we do not apply a hard filter
    // because freemium tools are often still applicable.

    if (intent.requiredInputTypes && intent.requiredInputTypes.length > 0) {
      where.inputTypes = {
        hasSome: intent.requiredInputTypes,
      };
    }

    if (intent.requiredOutputTypes && intent.requiredOutputTypes.length > 0) {
      where.outputTypes = {
        hasSome: intent.requiredOutputTypes,
      };
    }

    let candidates = await prisma.tool.findMany({
      where,
      take: 20,
      orderBy: { name: "asc" },
    });

    // Zero-candidate fallback: if the strict query found nothing, relax the
    // input/output capability filters, but maintain the pricing requirement.
    if (candidates.length === 0) {
      const fallbackWhere: Prisma.ToolWhereInput = {};

      if (intent.requiredPricing === "FREE") {
        fallbackWhere.pricing = {
          contains: "Free",
          mode: "insensitive",
        };
      }

      candidates = await prisma.tool.findMany({
        where: fallbackWhere,
        take: 20,
        orderBy: { name: "asc" },
      });
    }

    return candidates;
  }
};
