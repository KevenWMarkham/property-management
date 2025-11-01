import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import { desc } from 'drizzle-orm';

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

    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newTenant] = await db
      .insert(tenants)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
      })
      .returning();

    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    console.error('Failed to create tenant:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
