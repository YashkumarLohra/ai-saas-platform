import { NextResponse } from 'next/server';
import { RecommendRequestSchema } from '@/lib/schemas/recommendation';
import { intentService } from '@/services/intentService';
import { candidateService } from '@/services/candidateService';
import { rankingService } from '@/services/rankingService';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request using Zod schema
    const validationResult = RecommendRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request payload", 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Call service layer for intent extraction
    const intent = await intentService.extractIntent(validData);

    // Call candidate service to retrieve bounded candidate pool
    const candidates = await candidateService.getCandidates(intent);

    // Call ranking service to order candidates deterministically
    // NOTE: preferences could be fetched and passed here in a future update
    const recommendations = rankingService.rankCandidates(intent, candidates)
      .filter(rec => rec.score > 0)
      .slice(0, 20);

    // Map recommendations for public API boundary
    const publicRecommendations = recommendations.map(rec => ({
      tool: rec.tool,
      reasons: rec.reasons
    }));

    return NextResponse.json({
      success: true,
      recommendations: publicRecommendations
    });

  } catch (error: unknown) {
    console.error("Error in /api/recommend:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
