import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Real authentication is required to modify Favorites." },
      { status: 401 }
    );
  }

  try {
    const { toolId } = await params;
    
    // In our context, toolId is currently expected to be the tool's slug
    // because the UI identifies tools by their slugs.
    const slug = toolId;

    // Verify the tool exists to get its internal DB ID
    const tool = await prisma.tool.findUnique({
      where: { slug }
    });

    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found." },
        { status: 404 }
      );
    }

    // Securely delete only if it belongs to the authenticated user
    await prisma.favorite.delete({
      where: {
        user_id_tool_id: {
          user_id: user.id,
          tool_id: tool.id
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Prisma code P2025: Record to delete does not exist.
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Favorite not found or already deleted." },
        { status: 404 }
      );
    }

    console.error(`Database error in DELETE /api/favorites/[toolId]:`, error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
