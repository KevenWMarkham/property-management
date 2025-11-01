import { NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

// GET /api/guest/properties - Public property listings
export async function GET() {
  try {
    // Only show properties available for short-term rental
    const availableProperties = await db
      .select()
      .from(properties)
      .where(
        or(
          eq(properties.type, 'short-term'),
          eq(properties.type, 'hybrid')
        )
      );

    return NextResponse.json({ properties: availableProperties });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
