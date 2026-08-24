import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

const MAX_RECENT_VIEWS = 12;

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recentViews = await prisma.recentlyViewed.findMany({
      where: { user_id: user.id },
      orderBy: { viewedAt: 'desc' },
      take: MAX_RECENT_VIEWS,
      include: {
        tool: {
          select: { slug: true }
        }
      }
    });

    const slugs = recentViews.map(rv => rv.tool.slug);

    return NextResponse.json({ success: true, data: slugs });
  } catch (error) {
    console.error("GET /api/recent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const tool = await prisma.tool.findUnique({
      where: { slug }
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Upsert the recent view to bump the timestamp or create it
    await prisma.recentlyViewed.upsert({
      where: {
        user_id_tool_id: {
          user_id: user.id,
          tool_id: tool.id
        }
      },
      update: {
        viewedAt: new Date()
      },
      create: {
        user_id: user.id,
        tool_id: tool.id,
        viewedAt: new Date()
      }
    });

    // Enforce MAX_RECENT_VIEWS limit
    const excessViews = await prisma.recentlyViewed.findMany({
      where: { user_id: user.id },
      orderBy: { viewedAt: 'desc' },
      skip: MAX_RECENT_VIEWS,
      select: { tool_id: true }
    });

    if (excessViews.length > 0) {
      await prisma.recentlyViewed.deleteMany({
        where: {
          user_id: user.id,
          tool_id: {
            in: excessViews.map(v => v.tool_id)
          }
        }
      });
    }

    // Return the updated list to keep frontend in sync
    const recentViews = await prisma.recentlyViewed.findMany({
      where: { user_id: user.id },
      orderBy: { viewedAt: 'desc' },
      take: MAX_RECENT_VIEWS,
      include: {
        tool: {
          select: { slug: true }
        }
      }
    });

    const slugs = recentViews.map(rv => rv.tool.slug);

    return NextResponse.json({ success: true, data: slugs });
  } catch (error) {
    console.error("POST /api/recent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.recentlyViewed.deleteMany({
      where: { user_id: user.id }
    });

    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("DELETE /api/recent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
