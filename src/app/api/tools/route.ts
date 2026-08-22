import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Read Tool records from Supabase PostgreSQL via Prisma
    const tools = await prisma.tool.findMany();

    return NextResponse.json({
      success: true,
      data: tools,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Database error in /api/tools:", errMessage);
    
    // Return a safe error message without exposing credentials or SQL details
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while fetching tools.",
      },
      { status: 500 }
    );
  }
}
