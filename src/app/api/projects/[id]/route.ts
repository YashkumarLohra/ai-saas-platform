import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to access Projects." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { 
        tools: {
          include: {
            tool: {
              select: { slug: true }
            }
          }
        } 
      }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to project." }, { status: 403 });
    }

    const formattedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      toolIds: project.tools.map(t => t.tool.slug),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: formattedProject
    });
  } catch (error) {
    console.error("Database error in GET /api/projects/[id]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: "Missing or invalid 'name' parameter." },
        { status: 400 }
      );
    }

    // Verify ownership and existence
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to project." }, { status: 401 });
    }

    // Update safely
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedProject
    });

  } catch (error) {
    console.error("Database error in PATCH /api/projects/[id]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const { id } = await params;

    // Securely delete only if it matches id AND user_id matches
    // Using deleteMany is a safe way to delete conditionally without risking P2025 if it doesn't exist/belong.
    // Alternatively, we can use delete and catch P2025, but we must verify ownership first.
    // Easiest is to check existence first, then delete.
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized access to project." }, { status: 401 });
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025') {
      return NextResponse.json(
        { error: "Project not found or already deleted." },
        { status: 404 }
      );
    }

    console.error("Database error in DELETE /api/projects/[id]:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
