import { NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';

// GET /api/properties - List all properties
export async function GET() {
  try {
    const allProperties = await db.select().from(properties);
    return NextResponse.json(allProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, city, state, zipCode, propertyType, units } = body;

    if (!name || !address || !city || !state || !zipCode || !propertyType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProperty = await db
      .insert(properties)
      .values({
        name,
        address,
        city,
        state,
        zipCode,
        propertyType,
        units: units || 1,
      })
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
