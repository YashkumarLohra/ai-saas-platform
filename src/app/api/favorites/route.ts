import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Real authentication is required to access Favorites." },
      { status: 401 }
    );
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: user.id },
      include: { tool: true }
    });

    return NextResponse.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error("Database error in GET /api/favorites:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Real authentication is required to modify Favorites." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'slug' parameter." },
        { status: 400 }
      );
    }

    // 1. Verify the tool exists
    const tool = await prisma.tool.findUnique({
      where: { slug }
    });

    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found." },
        { status: 404 }
      );
    }

    // 2. Safely create or find existing Favorite (avoiding duplicates)
    // We can't use upsert here because Favorite doesn't have a single @unique field (it uses @@id)
    // We can use findUnique with the composite id.
    const existing = await prisma.favorite.findUnique({
      where: {
        user_id_tool_id: {
          user_id: user.id,
          tool_id: tool.id
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Tool is already favorited." },
        { status: 409 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: user.id,
        tool_id: tool.id
      }
    });

    return NextResponse.json({
      success: true,
      data: favorite
    });

  } catch (error) {
    console.error("Database error in POST /api/favorites:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
