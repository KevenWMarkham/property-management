import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { createTenantSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/admin/tenants
export async function GET() {
  try {
    const allTenants = await db
      .select()
      .from(tenants)
      .orderBy(desc(tenants.createdAt));

    return NextResponse.json({ tenants: allTenants });
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

// POST /api/admin/tenants
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = createTenantSchema.parse(body);

    const [newTenant] = await db
      .insert(tenants)
      .values({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        emergencyContact: validatedData.emergencyContactName,
        emergencyPhone: validatedData.emergencyContactPhone,
      })
      .returning();

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Failed to create tenant:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
