import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

export async function GET() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to access Projects." },
      { status: 401 }
    );
  }

  try {
    const projects = await prisma.project.findMany({
      where: { user_id: user.id },
      include: { 
        tools: {
          include: {
            tool: {
              select: { slug: true }
            }
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to frontend expectation: { id, name, description, toolIds: string[], createdAt, updatedAt }
    const formattedProjects = projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      toolIds: p.tools.map(t => t.tool.slug),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects,
    });
  } catch (error) {
    console.error("Database error in GET /api/projects:", error);
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
      { error: "Unauthorized. Authentication is required to modify Projects." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: "Missing or invalid 'name' parameter." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        user_id: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        toolIds: [] // New project has no tools
      }
    });

  } catch (error) {
    console.error("Database error in POST /api/projects:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
