import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to modify Projects." },
      { status: 401 }
    );
  }

  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'slug' parameter." },
        { status: 400 }
      );
    }

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

    // Create the ProjectTool relationship safely
    try {
      const projectTool = await prisma.projectTool.create({
        data: {
          project_id: projectId,
          tool_id: tool.id
        }
      });
      return NextResponse.json({ success: true, data: projectTool });
    } catch (createError: any) {
      // Handle P2002 Unique Constraint violation gracefully (Duplicate add)
      if (createError.code === 'P2002') {
        return NextResponse.json({ success: true, message: "Tool is already in the project." });
      }
      throw createError; // Rethrow other errors to be caught by outer catch
    }

  } catch (error) {
    console.error("Database error in POST /api/projects/[id]/tools:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
