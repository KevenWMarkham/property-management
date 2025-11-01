import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { guests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateGuestSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/admin/guests/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guest = await db.query.guests.findFirst({
      where: eq(guests.id, parseInt(id)),
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guest' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/guests/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = updateGuestSchema.parse({
      ...body,
      id: parseInt(id),
    });

    const [updatedGuest] = await db
      .update(guests)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(guests.id, parseInt(id)))
      .returning();

    if (!updatedGuest) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedGuest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to update guest:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/guests/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db
      .delete(guests)
      .where(eq(guests.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete guest:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}
