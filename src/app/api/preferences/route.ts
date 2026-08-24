import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-server';

// Match frontend UserPreferences type
const DEFAULT_PREFERENCES = {
  preferredCategories: [],
  experienceLevel: undefined,
};

export async function GET() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to access Preferences." },
      { status: 401 }
    );
  }

  try {
    const preference = await prisma.preference.findUnique({
      where: { user_id: user.id }
    });

    if (!preference) {
      return NextResponse.json({
        success: true,
        data: DEFAULT_PREFERENCES
      });
    }

    // Safely cast the Json value to an array of strings
    const categories = Array.isArray(preference.preferredCategories) 
      ? (preference.preferredCategories as string[]) 
      : [];

    return NextResponse.json({
      success: true,
      data: {
        preferredCategories: categories,
        experienceLevel: preference.experienceLevel || undefined
      }
    });

  } catch (error) {
    console.error("Database error in GET /api/preferences:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized. Authentication is required to modify Preferences." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { preferredCategories, experienceLevel } = body;

    // Validate preferredCategories
    if (!Array.isArray(preferredCategories) || !preferredCategories.every(c => typeof c === 'string')) {
      return NextResponse.json(
        { error: "Invalid 'preferredCategories'. Must be an array of strings." },
        { status: 400 }
      );
    }

    // Validate experienceLevel
    const validLevels = ['beginner', 'intermediate', 'advanced', null, undefined];
    if (!validLevels.includes(experienceLevel)) {
      return NextResponse.json(
        { error: "Invalid 'experienceLevel'. Must be beginner, intermediate, advanced, or null." },
        { status: 400 }
      );
    }

    const upserted = await prisma.preference.upsert({
      where: { user_id: user.id },
      update: {
        preferredCategories: preferredCategories,
        experienceLevel: experienceLevel || null
      },
      create: {
        user_id: user.id,
        preferredCategories: preferredCategories,
        experienceLevel: experienceLevel || null
      }
    });

    // Safely cast the Json value
    const categories = Array.isArray(upserted.preferredCategories) 
      ? (upserted.preferredCategories as string[]) 
      : [];

    return NextResponse.json({
      success: true,
      data: {
        preferredCategories: categories,
        experienceLevel: upserted.experienceLevel || undefined
      }
    });

  } catch (error) {
    console.error("Database error in PUT /api/preferences:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
