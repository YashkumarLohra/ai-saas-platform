import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string, slug: string }> }
) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to modify Projects." },
      { status: 401 }
    );
  }

  try {
    const { id: projectId, slug } = await params;

    // Verify ownership and existence of the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to project." }, { status: 401 });
    }

    // Resolve slug to Tool ID
    const tool = await prisma.tool.findUnique({
      where: { slug }
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found." }, { status: 404 });
    }

    // Delete the ProjectTool relationship
    await prisma.projectTool.delete({
      where: {
        project_id_tool_id: {
          project_id: projectId,
          tool_id: tool.id
        }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    // Gracefully handle P2025: Record to delete does not exist
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Tool is not in the project or already removed." },
        { status: 404 }
      );
    }

    console.error("Database error in DELETE /api/projects/[id]/tools/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
