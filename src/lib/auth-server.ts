import { createClient } from './supabase/server';
import prisma from './prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Ensure the authenticated user exists in the Prisma 'User' table.
    // This is required because our Favorites schema defines a foreign key
    // relationship between Favorite and User.
    const prismaUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: { 
        id: user.id, 
        email: user.email! 
      }
    });

    return {
      id: prismaUser.id,
      email: prismaUser.email,
    };
  } catch (err) {
    console.error("Error in getAuthenticatedUser:", err);
    return null;
  }
}
