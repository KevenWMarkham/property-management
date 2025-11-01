# Phase 1: Foundation & Command K - Design Document

**Timeline**: Weeks 1-3 (November 1-21, 2025)
**Status**: Ready for Implementation
**Linear Project**: [Phase 1: Foundation & Command K](https://linear.app/kevenmarkham55/project/phase-1-foundation-and-command-k-498601335027)

---

## Overview

Phase 1 establishes the core architecture of the Smart Property Management Platform with a functional admin interface and Command K palette. This phase focuses on building solid foundations that will support both short-term vacation rentals and long-term lease management.

### Goals

1. **Database Foundation**: Create a unified schema supporting hybrid rental models
2. **API Architecture**: Build RESTful API with clear admin/guest separation
3. **Admin Interface**: Develop property and tenant management UI
4. **Command K Palette**: Implement keyboard-first navigation and actions
5. **Development Environment**: Set up Docker-based development workflow

### Success Criteria

- [ ] Database schema supports both rental models (short-term and long-term)
- [ ] Admin can CRUD properties and tenants via UI and API
- [ ] Command K palette opens with Cmd/Ctrl+K and provides quick navigation
- [ ] API routes follow RESTful conventions with proper error handling
- [ ] TypeScript strict mode enabled with no compilation errors
- [ ] Development environment documented and reproducible

---

## Architecture Overview

### Technology Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- cmdk (Command K palette library)

**Backend:**
- Next.js API routes
- Drizzle ORM
- SQLite database

**Development:**
- Docker Compose (optional for Phase 1)
- Node.js LTS

### Project Structure

```
property-management/
├── src/
│   ├── app/
│   │   ├── (admin)/              # Admin dashboard routes
│   │   │   ├── layout.tsx        # Admin layout with navigation
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx      # Properties list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx  # Property detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx  # Create property
│   │   │   ├── tenants/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── bookings/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── api/
│   │   │   ├── admin/            # Private admin API
│   │   │   │   ├── properties/
│   │   │   │   │   ├── route.ts  # GET (list), POST (create)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   │   ├── tenants/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   └── bookings/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/route.ts
│   │   │   └── guest/            # Public guest API (prepared, not fully used in Phase 1)
│   │   │       └── properties/
│   │   │           └── route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── command-palette.tsx   # Command K implementation
│   │   └── ui/                   # Reusable UI components
│   ├── db/
│   │   ├── index.ts              # Database connection
│   │   └── schema.ts             # Drizzle schema definitions
│   └── lib/
│       └── utils.ts              # Utility functions
├── docs/
│   ├── plans/
│   │   └── 2025-10-31-smart-property-management-design.md
│   └── phase-1-foundation-design.md  # This document
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Database Schema Design

### Schema Extensions

Extend the existing schema in `src/db/schema.ts`:

#### 1. Properties Table (Extended)

```typescript
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address').notNull(),

  // NEW: Rental type field
  type: text('type').notNull(), // 'short-term' | 'long-term' | 'hybrid'

  propertyType: text('property_type').notNull(), // 'house' | 'apartment' | 'condo'
  units: integer('units').default(1),

  // NEW: Short-term rental fields (nullable for long-term only properties)
  nightlyRate: integer('nightly_rate'), // in cents, for short-term rentals
  cleaningFee: integer('cleaning_fee'), // in cents
  amenities: text('amenities'), // JSON string

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

#### 2. Guests Table (New)

```typescript
export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

#### 3. Bookings Table (New)

```typescript
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => properties.id),
  guestId: integer('guest_id')
    .notNull()
    .references(() => guests.id),

  checkInDate: integer('check_in_date', { mode: 'timestamp' }).notNull(),
  checkOutDate: integer('check_out_date', { mode: 'timestamp' }).notNull(),

  status: text('status').notNull(),
  // 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'

  nightlyRate: integer('nightly_rate').notNull(), // in cents
  cleaningFee: integer('cleaning_fee').default(0), // in cents
  totalAmount: integer('total_amount').notNull(), // in cents

  specialRequests: text('special_requests'),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

#### 4. IoT Devices Table (New - Foundation for Phase 2)

```typescript
export const iotDevices = sqliteTable('iot_devices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => properties.id),

  haEntityId: text('ha_entity_id').notNull().unique(), // Home Assistant entity ID
  deviceType: text('device_type').notNull(),
  // 'light' | 'lock' | 'thermostat' | 'sensor' | 'switch' | 'media_player'

  name: text('name').notNull(),
  room: text('room'), // 'Living Room', 'Bedroom 1', etc.

  guestControllable: integer('guest_controllable', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

#### 5. IoT Permissions Table (New - Foundation for Phase 2)

```typescript
export const iotPermissions = sqliteTable('iot_permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id')
    .notNull()
    .references(() => bookings.id),
  deviceId: integer('device_id')
    .notNull()
    .references(() => iotDevices.id),

  grantedAt: integer('granted_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
});
```

### Migration Commands

```bash
# Generate migration
npm run db:generate

# Apply migration to database
npm run db:push

# Open Drizzle Studio to view data
npm run db:studio
```

---

## API Design

### Design Principles

1. **RESTful conventions**: Standard HTTP methods and status codes
2. **Clear separation**: Admin API (`/api/admin/*`) vs Guest API (`/api/guest/*`)
3. **Type safety**: Full TypeScript types for requests/responses
4. **Error handling**: Consistent error response format
5. **Future-ready**: Structure supports TwinGate VPN (admin) and public internet (guest)

### API Routes Structure

#### Admin API (`/api/admin/*`)

**Properties Endpoints:**

```typescript
// GET /api/admin/properties
// Returns: Property[]
{
  "properties": [
    {
      "id": 1,
      "name": "Cozy Beach House",
      "address": "123 Ocean Ave",
      "type": "short-term",
      "nightlyRate": 15000, // $150.00
      "cleaningFee": 5000   // $50.00
    }
  ]
}

// POST /api/admin/properties
// Request Body:
{
  "name": "Cozy Beach House",
  "address": "123 Ocean Ave",
  "type": "short-term",
  "propertyType": "house",
  "units": 1,
  "nightlyRate": 15000,
  "cleaningFee": 5000
}
// Returns: Property (created)

// GET /api/admin/properties/[id]
// Returns: Property with full details

// PUT /api/admin/properties/[id]
// Request Body: Partial<Property>
// Returns: Property (updated)

// DELETE /api/admin/properties/[id]
// Returns: { success: true }
```

**Tenants Endpoints:**

```typescript
// GET /api/admin/tenants
// Returns: Tenant[]

// POST /api/admin/tenants
// Request Body: CreateTenantDto
// Returns: Tenant

// GET /api/admin/tenants/[id]
// Returns: Tenant with lease history

// PUT /api/admin/tenants/[id]
// Request Body: Partial<Tenant>
// Returns: Tenant

// DELETE /api/admin/tenants/[id]
// Returns: { success: true }
```

**Bookings Endpoints:**

```typescript
// GET /api/admin/bookings
// Query params: ?propertyId=1&status=confirmed
// Returns: Booking[]

// POST /api/admin/bookings
// Request Body: CreateBookingDto
// Returns: Booking

// GET /api/admin/bookings/[id]
// Returns: Booking with guest and property details

// PUT /api/admin/bookings/[id]
// Request Body: Partial<Booking>
// Returns: Booking

// DELETE /api/admin/bookings/[id]
// Returns: { success: true }
```

#### Guest API (`/api/guest/*`)

**Note**: Guest API is prepared in Phase 1 but not fully implemented until Phase 3.

```typescript
// GET /api/guest/properties
// Returns: Public property listings (available for booking)

// GET /api/guest/properties/[id]
// Returns: Property details for booking page
```

### Error Response Format

```typescript
// 400 Bad Request
{
  "error": "Validation error",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}

// 404 Not Found
{
  "error": "Property not found"
}

// 500 Internal Server Error
{
  "error": "An unexpected error occurred"
}
```

### Example API Implementation

**File**: `src/app/api/admin/properties/route.ts`

```typescript
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

    // TODO: Add validation (Zod schema recommended)

    const [newProperty] = await db
      .insert(properties)
      .values({
        name: body.name,
        address: body.address,
        type: body.type,
        propertyType: body.propertyType,
        units: body.units || 1,
        nightlyRate: body.nightlyRate,
        cleaningFee: body.cleaningFee,
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
```

**File**: `src/app/api/admin/properties/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/properties/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, parseInt(params.id)),
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/properties/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, parseInt(params.id)))
      .returning();

    if (!updatedProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/properties/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db
      .delete(properties)
      .where(eq(properties.id, parseInt(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
```

---

## Admin Dashboard Design

### Layout Structure

**File**: `src/app/(admin)/layout.tsx`

```typescript
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Dashboard
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Properties
              </Link>
              <Link
                href="/tenants"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Tenants
              </Link>
              <Link
                href="/bookings"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                Bookings
              </Link>
            </div>

            <div className="flex items-center">
              <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
```

### Page Components

**Properties List Page** (`src/app/(admin)/properties/page.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
  id: number;
  name: string;
  address: string;
  type: string;
  nightlyRate?: number;
  units: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await fetch('/api/admin/properties');
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your property portfolio
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/properties/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add Property
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Address
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Rate
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {property.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {property.address}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
                        {property.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {property.nightlyRate
                        ? `$${(property.nightlyRate / 100).toFixed(2)}/night`
                        : 'N/A'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Create Property Form** (`src/app/(admin)/properties/new/page.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'short-term',
    propertyType: 'house',
    units: 1,
    nightlyRate: '',
    cleaningFee: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nightlyRate: formData.nightlyRate ? parseFloat(formData.nightlyRate) * 100 : null,
          cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) * 100 : null,
        }),
      });

      if (res.ok) {
        router.push('/properties');
      } else {
        alert('Failed to create property');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h2 className="text-lg font-medium text-gray-900">Add New Property</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create a new property in your portfolio
          </p>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rental Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="short-term">Short-term (vacation rental)</option>
                    <option value="long-term">Long-term (traditional lease)</option>
                    <option value="hybrid">Hybrid (both)</option>
                  </select>
                </div>

                {/* Nightly Rate (if short-term) */}
                {(formData.type === 'short-term' || formData.type === 'hybrid') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nightly Rate ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.nightlyRate}
                        onChange={(e) => setFormData({ ...formData, nightlyRate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cleaning Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cleaningFee}
                        onChange={(e) => setFormData({ ...formData, cleaningFee: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## Command K Palette Implementation

### Installation

```bash
npm install cmdk
```

### Component Implementation

**File**: `src/components/command-palette.tsx`

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

interface CommandItem {
  id: string;
  label: string;
  action: () => void;
  group: 'Navigation' | 'Actions';
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const commands: CommandItem[] = [
    // Navigation commands
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      action: () => navigate('/'),
      group: 'Navigation',
      keywords: ['home', 'dashboard', 'overview'],
    },
    {
      id: 'nav-properties',
      label: 'Go to Properties',
      action: () => navigate('/properties'),
      group: 'Navigation',
      keywords: ['properties', 'list', 'view', 'browse'],
    },
    {
      id: 'nav-tenants',
      label: 'Go to Tenants',
      action: () => navigate('/tenants'),
      group: 'Navigation',
      keywords: ['tenants', 'list', 'view', 'lessees'],
    },
    {
      id: 'nav-bookings',
      label: 'Go to Bookings',
      action: () => navigate('/bookings'),
      group: 'Navigation',
      keywords: ['bookings', 'reservations', 'list', 'calendar'],
    },

    // Action commands
    {
      id: 'action-add-property',
      label: 'Add Property',
      action: () => navigate('/properties/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'property', 'plus'],
    },
    {
      id: 'action-add-tenant',
      label: 'Add Tenant',
      action: () => navigate('/tenants/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'tenant', 'lessee', 'plus'],
    },
    {
      id: 'action-create-booking',
      label: 'Create Booking',
      action: () => navigate('/bookings/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'booking', 'reservation', 'plus'],
    },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

      {/* Command Palette */}
      <div className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
        <Command.Input
          placeholder="Type a command or search..."
          className="w-full border-b border-gray-200 px-4 py-3 text-base outline-none placeholder:text-gray-400"
        />

        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-gray-500">
            No results found.
          </Command.Empty>

          {['Navigation', 'Actions'].map((group) => (
            <Command.Group
              key={group}
              heading={group}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500"
            >
              {commands
                .filter((cmd) => cmd.group === group)
                .map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    onSelect={() => cmd.action()}
                    keywords={cmd.keywords}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-blue-50 aria-selected:text-blue-900"
                  >
                    <span className="flex-1">{cmd.label}</span>
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      ↵
                    </kbd>
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
```

### Integration

Add to root layout (`src/app/layout.tsx`):

```typescript
import { CommandPalette } from '@/components/command-palette';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
```

### Styling

Add cmdk styles to `src/app/globals.css`:

```css
/* Command Palette Styles */
[cmdk-root] {
  @apply relative;
}

[cmdk-list] {
  @apply overflow-auto;
}

[cmdk-item] {
  @apply transition-colors;
}

[cmdk-item][aria-selected='true'] {
  @apply bg-blue-50 text-blue-900;
}

[cmdk-group-heading] {
  @apply text-xs font-semibold text-gray-500 uppercase tracking-wide;
}
```

---

## Development Environment

### Option 1: Local Development (Recommended for Phase 1)

**Prerequisites:**
- Node.js 20+ (LTS)
- npm or pnpm

**Setup:**

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev

# Open browser
open http://localhost:3000

# (Optional) Open Drizzle Studio
npm run db:studio
```

### Option 2: Docker Development (Optional)

**File**: `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./sqlite.db
    command: npm run dev
```

**File**: `Dockerfile.dev`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**Usage:**

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Run migrations inside container
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

---

## Testing Strategy

### Manual Testing Checklist

**Database & Migrations:**
- [ ] Run `npm run db:push` successfully
- [ ] Open Drizzle Studio and verify all tables exist
- [ ] Create a test property manually in Drizzle Studio
- [ ] Verify created_at and updated_at timestamps work

**API Endpoints:**
- [ ] GET `/api/admin/properties` returns empty array initially
- [ ] POST `/api/admin/properties` creates new property
- [ ] GET `/api/admin/properties/[id]` returns property details
- [ ] PUT `/api/admin/properties/[id]` updates property
- [ ] DELETE `/api/admin/properties/[id]` removes property
- [ ] Verify proper error responses (404, 500)

**Admin Dashboard:**
- [ ] Properties list page loads without errors
- [ ] Empty state shows when no properties exist
- [ ] "Add Property" button navigates to form
- [ ] Create property form submits successfully
- [ ] New property appears in list after creation
- [ ] Click on property navigates to detail page
- [ ] Navigation between pages works correctly
- [ ] Responsive layout works on mobile/tablet

**Command K Palette:**
- [ ] Cmd/Ctrl+K opens palette
- [ ] ESC key closes palette
- [ ] Click outside closes palette
- [ ] Search input filters commands
- [ ] "Go to Properties" navigates correctly
- [ ] "Add Property" navigates to form
- [ ] All navigation commands work
- [ ] All action commands work
- [ ] Commands grouped properly (Navigation, Actions)

### Automated Testing (Optional for Phase 1)

```bash
# Unit tests (future)
npm test

# E2E tests (future)
npm run test:e2e
```

---

## Common Issues & Solutions

### Issue: Database migration fails

**Solution:**
```bash
# Delete existing database
rm sqlite.db

# Regenerate schema
npm run db:generate

# Push to database
npm run db:push
```

### Issue: Command K not opening

**Solution:**
- Check browser console for errors
- Verify cmdk is installed: `npm list cmdk`
- Ensure CommandPalette is imported in root layout
- Try Ctrl+K if Cmd+K doesn't work (Windows/Linux)

### Issue: API routes returning 404

**Solution:**
- Verify file structure matches `/api/admin/*/route.ts` pattern
- Restart dev server: `npm run dev`
- Check Next.js App Router documentation for route conventions

### Issue: TypeScript errors

**Solution:**
```bash
# Regenerate types from database
npm run db:generate

# Check tsconfig.json has correct paths
# Restart TypeScript server in VS Code (Cmd+Shift+P > "Restart TS Server")
```

---

## Next Steps

After completing Phase 1, you'll be ready for:

**Phase 2: Home Assistant & IoT** (Weeks 4-6)
- Docker setup for Home Assistant
- Device integration and sync
- Real-time WebSocket connections
- Guest permission system

**Key Deliverables from Phase 1:**
✅ Working admin dashboard
✅ Property and tenant management
✅ Command K keyboard navigation
✅ RESTful API foundation
✅ Database schema supporting hybrid rentals

---

## Resources

- **Linear Project**: https://linear.app/kevenmarkham55/project/phase-1-foundation-and-command-k-498601335027
- **Next.js App Router**: https://nextjs.org/docs/app
- **Drizzle ORM**: https://orm.drizzle.team/docs/overview
- **cmdk Documentation**: https://cmdk.paco.me/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Ready to start building Phase 1?** 🚀

Begin with story **KEV-5: Extend database schema** or **KEV-6: Create RESTful API structure**.
