import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { desc } from 'drizzle-orm';

// GET /api/admin/properties - List all properties
export async function GET() {
  try {
    const allProperties = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));

    return NextResponse.json({ properties: allProperties });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/admin/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.address || !body.city || !body.state || !body.zipCode || !body.propertyType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newProperty] = await db
      .insert(properties)
      .values({
        name: body.name,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        type: body.type || 'long-term',
        propertyType: body.propertyType,
        units: body.units || 1,
        nightlyRate: body.nightlyRate || null,
        cleaningFee: body.cleaningFee || null,
        amenities: body.amenities || null,
      })
      .returning();

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
