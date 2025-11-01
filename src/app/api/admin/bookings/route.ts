import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { desc } from 'drizzle-orm';

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

    if (!body.propertyId || !body.guestId || !body.checkInDate || !body.checkOutDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newBooking] = await db
      .insert(bookings)
      .values({
        propertyId: body.propertyId,
        guestId: body.guestId,
        checkInDate: new Date(body.checkInDate),
        checkOutDate: new Date(body.checkOutDate),
        status: body.status || 'pending',
        nightlyRate: body.nightlyRate,
        cleaningFee: body.cleaningFee || 0,
        totalAmount: body.totalAmount,
        specialRequests: body.specialRequests || null,
      })
      .returning();

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
