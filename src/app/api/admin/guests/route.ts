import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guests } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createGuestSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/admin/guests
export async function GET() {
  try {
    const allGuests = await db
      .select()
      .from(guests)
      .orderBy(desc(guests.createdAt));

    return NextResponse.json({ guests: allGuests });
  } catch (error) {
    console.error('Failed to fetch guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

// POST /api/admin/guests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = createGuestSchema.parse(body);

    const [newGuest] = await db
      .insert(guests)
      .values({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        emergencyContact: validatedData.emergencyContactName || null,
        emergencyPhone: validatedData.emergencyContactPhone || null,
      })
      .returning();

    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to create guest:', error);
    return NextResponse.json(
      { error: 'Failed to create guest' },
      { status: 500 }
    );
  }
}
