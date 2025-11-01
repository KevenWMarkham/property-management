import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createBookingSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/admin/bookings
export async function GET() {
  try {
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({ bookings: allBookings });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = createBookingSchema.parse(body);

    const [newBooking] = await db
      .insert(bookings)
      .values({
        propertyId: validatedData.propertyId,
        guestId: validatedData.guestId,
        checkInDate: validatedData.checkInDate,
        checkOutDate: validatedData.checkOutDate,
        status: validatedData.status,
        nightlyRate: validatedData.nightlyRate,
        cleaningFee: validatedData.cleaningFee,
        totalAmount: validatedData.totalAmount,
        specialRequests: validatedData.specialRequests || null,
      })
      .returning();

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to create booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
