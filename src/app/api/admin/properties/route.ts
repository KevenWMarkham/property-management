import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createPropertySchema } from '@/lib/validations';
import { z } from 'zod';

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

    // Validate with Zod
    const validatedData = createPropertySchema.parse(body);

    const [newProperty] = await db
      .insert(properties)
      .values({
        name: validatedData.name,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zipCode: validatedData.zipCode,
        type: validatedData.type,
        propertyType: validatedData.propertyType,
        units: validatedData.units || 1,
        nightlyRate: validatedData.nightlyRate || null,
        cleaningFee: validatedData.cleaningFee || null,
        amenities: validatedData.amenities || null,
      })
      .returning();

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
