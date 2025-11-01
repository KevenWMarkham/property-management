# Smart Hospitality & Property Management Platform - Implementation Plan

**Created**: 2025-10-31
**Status**: Design Complete - Ready for Implementation
**Timeline**: 18 weeks to production-ready system

---

## Executive Summary

A **zero-cost, privacy-first hybrid property management platform** combining traditional property management with vacation rental operations and smart home integration.

### Market Differentiators

- **Zero ongoing costs**: Open-source stack, on-premises deployment, no SaaS subscriptions
- **Hybrid rental model**: Support both short-term vacation rentals AND long-term leases
- **Guest AI concierge**: On-premises LLM with MCP integrations for local services
- **Smart guest controls**: Temporary, secure access to property IoT devices
- **Complete privacy**: All operational data stays on your hardware

---

## System Architecture

### Three-Tier Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ PUBLIC INTERNET (Free tier hosting)                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Guest Portal (Next.js on Vercel Free)                           │
│  • Property browsing & booking calendar                          │
│  • Guest dashboard (active reservations, check-in info)          │
│  • AI concierge chat (talks to on-prem Ollama via MCP)          │
│  • IoT controls (lights, locks, music) - proxied & validated    │
│  • Digital guidebook (key codes, WiFi, house rules)             │
│                                                                   │
│  Admin Dashboard (Next.js on Vercel Free)                        │
│  • Command K palette (navigation & quick actions)                │
│  • Property/tenant/booking management                            │
│  • Real-time IoT monitoring & control                            │
│  • Financial reports & analytics                                 │
│  • Access: TwinGate VPN (free tier) only                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
              ↓ HTTPS (Cloudflare Tunnel Free or Tailscale Funnel)
┌──────────────────────────────────────────────────────────────────┐
│ ON-PREMISES (Beelink Mini S13 recommended)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Backend API (Next.js API routes)                                │
│  ┌─────────────────────┐  ┌───────────────────────────┐        │
│  │ Public Guest API    │  │ Private Admin API          │        │
│  ├─────────────────────┤  ├───────────────────────────┤        │
│  │ • Bookings         │  │ • Full CRUD                │        │
│  │ • Guest auth       │  │ • Tenant management         │        │
│  │ • IoT proxy        │  │ • Financial operations      │        │
│  │ • AI chat proxy    │  │ • Direct HA control         │        │
│  │ • MCP endpoints    │  │ • N8N workflows             │        │
│  └─────────────────────┘  └───────────────────────────┘        │
│                                                                   │
│  SQLite Database (Drizzle ORM)                                   │
│  • Properties (type: short-term | long-term | hybrid)           │
│  • Bookings (dates, guests, pricing, status)                    │
│  • Leases (terms, tenants, monthly rent)                        │
│  • Guests & Tenants (profiles, history)                         │
│  • Payments (unified transaction log)                            │
│  • Maintenance requests                                          │
│  • IoT device registry & guest permissions                       │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Home Assistant (Docker container)                               │
│  • Multi-protocol IoT (Zigbee, Z-Wave, Matter, WiFi, etc.)     │
│  • Per-unit device areas & grouping                             │
│  • REST API + WebSocket for real-time updates                   │
│                                                                   │
│  N8N (Docker container)                                          │
│  • Automated check-in/out workflows                              │
│  • Maintenance alert routing                                     │
│  • Booking sync & calendar management                            │
│  • External service integrations                                 │
│                                                                   │
│  Ollama + Local LLM (e.g., Llama 3.1 8B)                        │
│  • Guest AI concierge (embedded in guest portal chat)           │
│  • Admin AI assistant (natural language queries)                │
│  • Future: Predictive maintenance analytics                      │
│                                                                   │
│  MCP Servers (exposed to Ollama & guest portal)                 │
│  • Property data MCP (bookings, properties, amenities)          │
│  • Local services MCP (restaurants, events, transportation)     │
│  • IoT control MCP (guest device access with permissions)       │
│  • External APIs MCP (food delivery, excursion booking)         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Technical Foundation

**Core Stack:**
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend/API**: Next.js API routes (RESTful design for N8N/MCP consumption)
- **Database**: SQLite with Drizzle ORM (low overhead, perfect for edge deployment)
- **Command Palette**: cmdk library (keyboard-first navigation and actions)

**Integration Layer:**
- **IoT Hub**: Home Assistant (multi-protocol support: Zigbee, Z-Wave, Matter, WiFi, etc.)
- **Automation Engine**: N8N (workflow orchestration, alert routing, data pipelines)
- **AI Future-Ready**: MCP servers expose APIs for local LLM integration (Ollama)
- **Network Access**: TwinGate for secure remote access via phone/browser

**Deployment Options:**
- **All-in-one**: Docker Compose stack on Zimaboard/Beelink (suitable for 1-5 properties)
- **Distributed**: Separate HA instance per property, centralized management app
- **Service Discovery**: Environment-based config, supports both architectures

**Hardware Targets:**
- **Recommended**: Beelink Mini S13 (Intel N100, ~$180, better for AI workloads)
- **Alternative**: Zimaboard (7W TDP, fanless, ~$250, perfect for 24/7 operation without AI)

### Key Architectural Decisions

1. **Security model**: Guest IoT controls proxied through backend API with booking validation, never direct HA access
2. **Deployment flexibility**: All services containerized (Docker Compose), supports all-in-one or distributed hardware
3. **Network exposure**: Cloudflare Tunnel for public guest API, TwinGate VPN for admin access
4. **Data sovereignty**: All operational data on-premises (SQLite), cloud frontends are stateless
5. **API-first design**: All features accessible via REST API for N8N automation and future MCP integration

### Cost Breakdown

**Zero Ongoing Costs:**
- ✅ Next.js frontends on Vercel (free tier: unlimited static, reasonable API limits)
- ✅ SQLite database (file-based, no licensing)
- ✅ Home Assistant (open source)
- ✅ N8N (self-hosted, open source)
- ✅ Ollama (open source, local LLM)
- ✅ TwinGate (free tier: 1 user, unlimited devices)
- ✅ Cloudflare Tunnel (free tier for basic usage)

**One-Time Costs:**
- Beelink Mini S13: ~$180
- IoT devices: Variable (locks, sensors, lights)

**Minimal Recurring Costs:**
- Domain name: ~$12/year
- Electricity: ~$10-15/month (~15W TDP)

**Guest Services:**
- Pass-through costs when guests order food, book excursions, etc.

**Total SaaS fees: $0** ✅

---

## Phase 1: Foundation & Command K (Weeks 1-3)

### Goal
Establish core architecture with functional admin interface and Command K palette.

### Deliverables

#### Database Schema Extensions

Extend existing schema in `src/db/schema.ts`:

```typescript
// Properties - add type field for hybrid support
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  type: text('type').notNull(), // 'short-term' | 'long-term' | 'hybrid'
  propertyType: text('property_type').notNull(), // 'house' | 'apartment' | 'condo'
  units: integer('units').default(1),
  // ... existing fields
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// New: Bookings table (short-term reservations)
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  checkInDate: integer('check_in_date', { mode: 'timestamp' }).notNull(),
  checkOutDate: integer('check_out_date', { mode: 'timestamp' }).notNull(),
  status: text('status').notNull(), // 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  nightlyRate: integer('nightly_rate').notNull(), // in cents
  cleaningFee: integer('cleaning_fee').default(0), // in cents
  totalAmount: integer('total_amount').notNull(), // in cents
  specialRequests: text('special_requests'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// New: Guests table (separate from tenants)
export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// New: IoT Devices table
export const iotDevices = sqliteTable('iot_devices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  haEntityId: text('ha_entity_id').notNull().unique(), // Home Assistant entity ID
  deviceType: text('device_type').notNull(), // 'light' | 'lock' | 'thermostat' | 'sensor' | 'switch'
  name: text('name').notNull(),
  room: text('room'), // 'Living Room', 'Bedroom 1', etc.
  guestControllable: integer('guest_controllable', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// New: IoT Permissions table (temporary guest access)
export const iotPermissions = sqliteTable('iot_permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  deviceId: integer('device_id').notNull().references(() => iotDevices.id),
  grantedAt: integer('granted_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
});
```

#### Backend API Structure

Create API route structure in `src/app/api/`:

```
src/app/api/
├── admin/               # Private admin API (TwinGate only)
│   ├── properties/
│   │   ├── route.ts     # GET (list), POST (create)
│   │   └── [id]/
│   │       └── route.ts # GET, PUT, DELETE
│   ├── tenants/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── bookings/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── iot/
│       ├── devices/route.ts
│       └── control/route.ts
└── guest/               # Public guest API (internet-exposed)
    ├── properties/route.ts      # Browse available properties
    ├── bookings/route.ts        # Create/view own bookings
    └── iot/
        └── control/route.ts     # Proxied IoT control with validation
```

Example API implementation (`src/app/api/admin/properties/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/admin/properties - List all properties
export async function GET() {
  try {
    const allProperties = await db.select().from(properties);
    return NextResponse.json(allProperties);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST /api/admin/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProperty = await db.insert(properties).values(body).returning();
    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
```

#### Admin Dashboard Pages

Create admin pages in `src/app/(admin)/`:

```
src/app/(admin)/
├── layout.tsx           # Admin layout with navigation
├── page.tsx             # Dashboard home
├── properties/
│   ├── page.tsx         # Properties list
│   ├── [id]/page.tsx    # Property detail
│   └── new/page.tsx     # Create property
├── tenants/
│   ├── page.tsx
│   └── [id]/page.tsx
└── bookings/
    ├── page.tsx
    └── [id]/page.tsx
```

#### Command K Palette Integration

Install cmdk:
```bash
npm install cmdk
```

Create Command K component (`src/components/command-palette.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

interface CommandItem {
  id: string;
  label: string;
  action: () => void;
  group: string;
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

  const commands: CommandItem[] = [
    // Navigation commands
    {
      id: 'nav-properties',
      label: 'Go to Properties',
      action: () => router.push('/properties'),
      group: 'Navigation',
      keywords: ['properties', 'list', 'view'],
    },
    {
      id: 'nav-tenants',
      label: 'Go to Tenants',
      action: () => router.push('/tenants'),
      group: 'Navigation',
      keywords: ['tenants', 'list', 'view'],
    },
    {
      id: 'nav-bookings',
      label: 'Go to Bookings',
      action: () => router.push('/bookings'),
      group: 'Navigation',
      keywords: ['bookings', 'reservations', 'list'],
    },
    // Action commands
    {
      id: 'action-add-property',
      label: 'Add Property',
      action: () => router.push('/properties/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'property'],
    },
    {
      id: 'action-add-tenant',
      label: 'Add Tenant',
      action: () => router.push('/tenants/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'tenant'],
    },
    {
      id: 'action-create-booking',
      label: 'Create Booking',
      action: () => router.push('/bookings/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'booking', 'reservation'],
    },
  ];

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        {['Navigation', 'Actions'].map((group) => (
          <Command.Group key={group} heading={group}>
            {commands
              .filter((cmd) => cmd.group === group)
              .map((cmd) => (
                <Command.Item
                  key={cmd.id}
                  onSelect={() => {
                    cmd.action();
                    setOpen(false);
                  }}
                  keywords={cmd.keywords}
                >
                  {cmd.label}
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
```

Add to root layout (`src/app/layout.tsx`):

```typescript
import { CommandPalette } from '@/components/command-palette';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

#### Development Environment

Create `docker-compose.dev.yml`:

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
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./sqlite.db
```

### Success Criteria

- [ ] Database schema supports both short-term and long-term rentals
- [ ] Admin can CRUD properties via UI and API
- [ ] Admin can CRUD tenants via UI and API
- [ ] Command K palette opens with Cmd/Ctrl+K
- [ ] Command K supports navigation commands (Go to X)
- [ ] Command K supports action commands (Add X)
- [ ] API routes follow RESTful conventions
- [ ] TypeScript strict mode enabled with no errors
- [ ] All database queries use Drizzle ORM

### Testing Checklist

- [ ] Create a property via UI
- [ ] Edit property details
- [ ] Delete a property
- [ ] Create a tenant
- [ ] Command K search filters results
- [ ] Command K navigation works
- [ ] API endpoints return proper error codes
- [ ] Database migrations run successfully

---

## Phase 2: Home Assistant Integration & IoT Foundation (Weeks 4-6)

### Goal
Connect Home Assistant, establish device registry, and build proxied control system.

### Deliverables

#### Home Assistant Docker Setup

Add to `docker-compose.yml`:

```yaml
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    container_name: homeassistant
    privileged: true
    restart: unless-stopped
    environment:
      - TZ=America/New_York
    volumes:
      - ./homeassistant:/config
    network_mode: host
    depends_on:
      - mqtt  # Optional: for Zigbee/MQTT devices

  mqtt:
    image: eclipse-mosquitto:latest
    container_name: mosquitto
    restart: unless-stopped
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
```

#### Home Assistant Integration Service

Create HA service (`src/services/homeassistant.ts`):

```typescript
import { db } from '@/db';
import { iotDevices } from '@/db/schema';

interface HADevice {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
}

class HomeAssistantService {
  private baseUrl: string;
  private token: string;
  private ws: WebSocket | null = null;

  constructor() {
    this.baseUrl = process.env.HA_URL || 'http://localhost:8123';
    this.token = process.env.HA_TOKEN || '';
  }

  // REST API Methods
  async getStates(): Promise<HADevice[]> {
    const response = await fetch(`${this.baseUrl}/api/states`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch HA states');
    return response.json();
  }

  async callService(domain: string, service: string, entityId: string, data?: Record<string, any>) {
    const response = await fetch(`${this.baseUrl}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: entityId,
        ...data,
      }),
    });

    if (!response.ok) throw new Error(`Failed to call service ${domain}.${service}`);
    return response.json();
  }

  // Device Control Methods
  async turnOn(entityId: string) {
    const domain = entityId.split('.')[0];
    return this.callService(domain, 'turn_on', entityId);
  }

  async turnOff(entityId: string) {
    const domain = entityId.split('.')[0];
    return this.callService(domain, 'turn_off', entityId);
  }

  async setLightBrightness(entityId: string, brightness: number) {
    return this.callService('light', 'turn_on', entityId, { brightness });
  }

  async lockDoor(entityId: string) {
    return this.callService('lock', 'lock', entityId);
  }

  async unlockDoor(entityId: string) {
    return this.callService('lock', 'unlock', entityId);
  }

  // WebSocket for real-time updates
  connectWebSocket(onMessage: (data: any) => void) {
    this.ws = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/api/websocket`);

    this.ws.onopen = () => {
      // Authenticate
      this.ws?.send(JSON.stringify({
        type: 'auth',
        access_token: this.token,
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'auth_ok') {
        // Subscribe to state changes
        this.ws?.send(JSON.stringify({
          id: 1,
          type: 'subscribe_events',
          event_type: 'state_changed',
        }));
      }

      onMessage(data);
    };
  }

  // Sync devices from HA to local database
  async syncDevices(propertyId: number) {
    const states = await this.getStates();

    // Filter controllable devices (lights, locks, switches)
    const controllableDevices = states.filter(device =>
      ['light', 'lock', 'switch', 'climate'].includes(device.entity_id.split('.')[0])
    );

    for (const device of controllableDevices) {
      const domain = device.entity_id.split('.')[0];

      await db.insert(iotDevices).values({
        propertyId,
        haEntityId: device.entity_id,
        deviceType: domain,
        name: device.attributes.friendly_name || device.entity_id,
        room: device.attributes.area || null,
        guestControllable: false, // Default: admin only
      }).onConflictDoUpdate({
        target: iotDevices.haEntityId,
        set: {
          name: device.attributes.friendly_name || device.entity_id,
          room: device.attributes.area || null,
        },
      });
    }
  }
}

export const haService = new HomeAssistantService();
```

#### IoT Control API Endpoints

Admin control API (`src/app/api/admin/iot/control/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { haService } from '@/services/homeassistant';

export async function POST(request: NextRequest) {
  try {
    const { entityId, action, params } = await request.json();

    let result;
    switch (action) {
      case 'turn_on':
        result = await haService.turnOn(entityId);
        break;
      case 'turn_off':
        result = await haService.turnOff(entityId);
        break;
      case 'set_brightness':
        result = await haService.setLightBrightness(entityId, params.brightness);
        break;
      case 'lock':
        result = await haService.lockDoor(entityId);
        break;
      case 'unlock':
        result = await haService.unlockDoor(entityId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('IoT control error:', error);
    return NextResponse.json({ error: 'Failed to control device' }, { status: 500 });
  }
}
```

Guest control API with validation (`src/app/api/guest/iot/control/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { haService } from '@/services/homeassistant';
import { db } from '@/db';
import { iotPermissions, iotDevices, bookings } from '@/db/schema';
import { and, eq, isNull, lte, gte } from 'drizzle-orm';

async function validateGuestAccess(guestId: number, deviceId: number): Promise<boolean> {
  // Check if guest has an active booking with permission to this device
  const now = new Date();

  const permission = await db
    .select()
    .from(iotPermissions)
    .innerJoin(bookings, eq(iotPermissions.bookingId, bookings.id))
    .innerJoin(iotDevices, eq(iotPermissions.deviceId, iotDevices.id))
    .where(
      and(
        eq(bookings.guestId, guestId),
        eq(iotDevices.id, deviceId),
        eq(bookings.status, 'checked-in'),
        lte(bookings.checkInDate, now),
        gte(bookings.checkOutDate, now),
        isNull(iotPermissions.revokedAt)
      )
    )
    .limit(1);

  return permission.length > 0;
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Extract guestId from auth session
    const guestId = 1; // Placeholder

    const { deviceId, action, params } = await request.json();

    // Validate guest has permission
    const hasAccess = await validateGuestAccess(guestId, deviceId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get device entity ID
    const device = await db.query.iotDevices.findFirst({
      where: eq(iotDevices.id, deviceId),
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Validate device is guest-controllable
    if (!device.guestControllable) {
      return NextResponse.json({ error: 'Device not guest-controllable' }, { status: 403 });
    }

    // Perform action via HA service
    let result;
    switch (action) {
      case 'turn_on':
        result = await haService.turnOn(device.haEntityId);
        break;
      case 'turn_off':
        result = await haService.turnOff(device.haEntityId);
        break;
      case 'set_brightness':
        result = await haService.setLightBrightness(device.haEntityId, params.brightness);
        break;
      case 'lock':
        result = await haService.lockDoor(device.haEntityId);
        break;
      case 'unlock':
        result = await haService.unlockDoor(device.haEntityId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // TODO: Log action to audit trail

    return NextResponse.json(result);
  } catch (error) {
    console.error('Guest IoT control error:', error);
    return NextResponse.json({ error: 'Failed to control device' }, { status: 500 });
  }
}
```

#### Admin Dashboard IoT Features

Create IoT dashboard page (`src/app/(admin)/iot/page.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Device {
  id: number;
  name: string;
  deviceType: string;
  room: string;
  haEntityId: string;
  state: string;
  guestControllable: boolean;
}

export default function IoTDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchDevices();

    // Setup WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:3000/api/admin/iot/ws');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Update device state in real-time
      setDevices(prev => prev.map(d =>
        d.haEntityId === update.entity_id
          ? { ...d, state: update.state }
          : d
      ));
    };

    return () => ws.close();
  }, []);

  async function fetchDevices() {
    const res = await fetch('/api/admin/iot/devices');
    const data = await res.json();
    setDevices(data);
  }

  async function controlDevice(entityId: string, action: string) {
    await fetch('/api/admin/iot/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityId, action }),
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">IoT Devices</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{device.name}</h3>
                <p className="text-sm text-gray-600">{device.room}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                device.state === 'on' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {device.state}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => controlDevice(device.haEntityId, 'turn_on')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                On
              </button>
              <button
                onClick={() => controlDevice(device.haEntityId, 'turn_off')}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Off
              </button>
            </div>

            <label className="flex items-center gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={device.guestControllable}
                onChange={(e) => {
                  // TODO: Update device guest controllable flag
                }}
              />
              Guest controllable
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Command K IoT Integration

Add IoT commands to Command Palette:

```typescript
// Add to command-palette.tsx
{
  id: 'nav-iot',
  label: 'Go to IoT Dashboard',
  action: () => router.push('/iot'),
  group: 'Navigation',
  keywords: ['iot', 'devices', 'smart', 'home'],
},
{
  id: 'action-sync-devices',
  label: 'Sync Home Assistant Devices',
  action: async () => {
    await fetch('/api/admin/iot/sync', { method: 'POST' });
    // Show success toast
  },
  group: 'Actions',
  keywords: ['sync', 'refresh', 'devices', 'home assistant'],
},
```

### Success Criteria

- [ ] Home Assistant running in Docker container
- [ ] Backend can communicate with HA via REST API
- [ ] Device sync from HA to SQLite works
- [ ] Admin can view all devices in dashboard
- [ ] Admin can control devices (on/off, brightness, lock/unlock)
- [ ] Real-time device state updates via WebSocket
- [ ] Guest control API validates permissions correctly
- [ ] IoT commands available in Command K palette
- [ ] Device assignment to properties/rooms working

### Testing Checklist

- [ ] Pair a test device with Home Assistant
- [ ] Sync devices to database
- [ ] Control device from admin dashboard
- [ ] Verify device state updates in real-time
- [ ] Test guest API rejects unauthorized access
- [ ] Test guest API allows access for checked-in guests
- [ ] Command K IoT shortcuts work

---

## Phase 3: Guest Portal & Booking System (Weeks 7-10)

### Goal
Launch public-facing guest portal with booking and basic guest services.

### Deliverables

#### Guest Portal Application

Create separate Next.js app for guest portal:

```bash
mkdir apps/guest-portal
cd apps/guest-portal
npx create-next-app@latest . --typescript --tailwind --app
```

Or use monorepo structure with Turborepo:

```
property-management/
├── apps/
│   ├── admin/          # Admin dashboard
│   └── guest/          # Guest portal
├── packages/
│   ├── database/       # Shared database client
│   ├── ui/             # Shared UI components
│   └── types/          # Shared TypeScript types
└── services/
    └── api/            # Backend API (shared by both frontends)
```

#### Guest Portal Pages

```
apps/guest/src/app/
├── page.tsx                    # Property browsing
├── properties/
│   └── [id]/page.tsx          # Property detail & booking
├── dashboard/
│   └── page.tsx               # Guest dashboard (bookings)
├── bookings/
│   └── [id]/page.tsx          # Booking detail & controls
└── auth/
    ├── login/page.tsx
    └── register/page.tsx
```

Property browsing page (`apps/guest/src/app/page.tsx`):

```typescript
import { PropertyCard } from '@/components/property-card';

async function getProperties() {
  const res = await fetch(`${process.env.API_URL}/api/guest/properties`);
  return res.json();
}

export default async function HomePage() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Find Your Perfect Stay</h1>
        <p className="text-gray-600 mt-2">
          Discover unique properties for your next vacation
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
```

Booking flow page (`apps/guest/src/app/properties/[id]/page.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '@/components/date-range-picker';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleBooking() {
    if (!checkIn || !checkOut) return;

    setLoading(true);
    try {
      const res = await fetch('/api/guest/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: params.id,
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        router.push(`/bookings/${booking.id}`);
      } else {
        // Handle error
        alert('Booking failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Property details, photos, etc. */}

      <div className="mt-8 border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
        />

        <button
          onClick={handleBooking}
          disabled={!checkIn || !checkOut || loading}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}
```

Guest dashboard with IoT controls (`apps/guest/src/app/bookings/[id]/page.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Booking {
  id: number;
  property: { name: string; address: string };
  checkInDate: string;
  checkOutDate: string;
  keyCode: string;
  wifiPassword: string;
}

interface Device {
  id: number;
  name: string;
  deviceType: string;
  room: string;
  state: string;
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    fetchBooking();
    fetchDevices();
  }, []);

  async function fetchBooking() {
    const res = await fetch(`/api/guest/bookings/${params.id}`);
    const data = await res.json();
    setBooking(data);
  }

  async function fetchDevices() {
    const res = await fetch(`/api/guest/bookings/${params.id}/devices`);
    const data = await res.json();
    setDevices(data);
  }

  async function controlDevice(deviceId: number, action: string) {
    await fetch('/api/guest/iot/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, action }),
    });

    // Refresh devices to get updated state
    fetchDevices();
  }

  if (!booking) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Booking</h1>

      {/* Booking details */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">{booking.property.name}</h2>
        <p className="text-gray-600">{booking.property.address}</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600">Check-in</p>
            <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Check-out</p>
            <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Access info */}
      <div className="border rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Access Information</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-600">Door Code:</span>
            <span className="ml-2 font-mono font-bold text-lg">{booking.keyCode}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">WiFi Password:</span>
            <span className="ml-2 font-mono">{booking.wifiPassword}</span>
          </div>
        </div>
      </div>

      {/* Device controls */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Smart Home Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-semibold">{device.name}</h4>
                  <p className="text-sm text-gray-600">{device.room}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  device.state === 'on'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {device.state}
                </span>
              </div>

              {device.deviceType === 'light' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => controlDevice(device.id, 'turn_on')}
                    className="flex-1 py-2 bg-yellow-500 text-white rounded"
                  >
                    On
                  </button>
                  <button
                    onClick={() => controlDevice(device.id, 'turn_off')}
                    className="flex-1 py-2 bg-gray-500 text-white rounded"
                  >
                    Off
                  </button>
                </div>
              )}

              {device.deviceType === 'lock' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => controlDevice(device.id, 'lock')}
                    className="flex-1 py-2 bg-red-500 text-white rounded"
                  >
                    Lock
                  </button>
                  <button
                    onClick={() => controlDevice(device.id, 'unlock')}
                    className="flex-1 py-2 bg-green-500 text-white rounded"
                  >
                    Unlock
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### Booking Engine API

Availability checker (`services/api/src/lib/booking-engine.ts`):

```typescript
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { and, eq, or, lte, gte } from 'drizzle-orm';

export async function checkAvailability(
  propertyId: number,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const conflicts = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.propertyId, propertyId),
        or(
          // New booking starts during existing booking
          and(
            lte(bookings.checkInDate, checkIn),
            gte(bookings.checkOutDate, checkIn)
          ),
          // New booking ends during existing booking
          and(
            lte(bookings.checkInDate, checkOut),
            gte(bookings.checkOutDate, checkOut)
          ),
          // New booking completely contains existing booking
          and(
            gte(bookings.checkInDate, checkIn),
            lte(bookings.checkOutDate, checkOut)
          )
        )
      )
    );

  return conflicts.length === 0;
}

export function calculateTotalAmount(
  nightlyRate: number,
  cleaningFee: number,
  nights: number
): number {
  return (nightlyRate * nights) + cleaningFee;
}

export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

Booking creation API (`services/api/src/app/api/guest/bookings/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, iotPermissions, iotDevices } from '@/db/schema';
import { checkAvailability, calculateNights, calculateTotalAmount } from '@/lib/booking-engine';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // TODO: Get guestId from auth session
    const guestId = 1;

    const { propertyId, checkInDate, checkOutDate } = await request.json();

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });
    }

    // Check availability
    const available = await checkAvailability(propertyId, checkIn, checkOut);
    if (!available) {
      return NextResponse.json({ error: 'Property not available for these dates' }, { status: 409 });
    }

    // Get property pricing
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Calculate pricing
    const nights = calculateNights(checkIn, checkOut);
    const nightlyRate = property.nightlyRate || 10000; // Default $100/night
    const cleaningFee = property.cleaningFee || 5000; // Default $50
    const totalAmount = calculateTotalAmount(nightlyRate, cleaningFee, nights);

    // Create booking
    const [booking] = await db.insert(bookings).values({
      propertyId,
      guestId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status: 'confirmed',
      nightlyRate,
      cleaningFee,
      totalAmount,
    }).returning();

    // Grant IoT permissions for guest-controllable devices
    const devices = await db
      .select()
      .from(iotDevices)
      .where(
        and(
          eq(iotDevices.propertyId, propertyId),
          eq(iotDevices.guestControllable, true)
        )
      );

    for (const device of devices) {
      await db.insert(iotPermissions).values({
        bookingId: booking.id,
        deviceId: device.id,
      });
    }

    // TODO: Trigger N8N check-in workflow

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
```

#### Network Exposure Setup

Install Cloudflare Tunnel:

```bash
# On Beelink/Zimaboard
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create property-management

# Route traffic to local backend
cloudflared tunnel route dns property-management api.yourdomain.com
```

Configure tunnel (`~/.cloudflared/config.yml`):

```yaml
tunnel: <tunnel-id>
credentials-file: /root/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:3000
    path: /api/guest/*
  - service: http_status:404
```

Run tunnel as service:

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
```

#### Vercel Deployment

Deploy guest portal to Vercel:

```bash
cd apps/guest
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

### Success Criteria

- [ ] Guest portal deployed to Vercel
- [ ] Guests can browse available properties
- [ ] Booking flow works end-to-end
- [ ] Availability checking prevents double bookings
- [ ] IoT permissions granted automatically on booking
- [ ] Guests can control lights, locks, music from dashboard
- [ ] Guest controls auto-revoke at checkout
- [ ] Cloudflare Tunnel exposes guest API securely
- [ ] Admin dashboard remains VPN-only

### Testing Checklist

- [ ] Create a test booking
- [ ] Verify availability calendar updates
- [ ] Log in as guest and view booking
- [ ] Control IoT device from guest dashboard
- [ ] Verify checkout revokes IoT access
- [ ] Test booking conflicts (double booking prevention)
- [ ] Deploy to Vercel and test live

---

## Phase 4: N8N Automation & AI Concierge (Weeks 11-14)

### Goal
Add workflow automation and guest AI concierge with MCP integrations.

### Deliverables

#### N8N Docker Setup

Add to `docker-compose.yml`:

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=n8n.local
      - WEBHOOK_URL=http://n8n:5678/
    volumes:
      - ./n8n:/home/node/.n8n
    depends_on:
      - postgres  # Optional: for N8N data persistence
```

#### N8N Workflows

**Check-in Automation Workflow:**

Trigger: 24 hours before check-in
1. Fetch booking details from API
2. Generate key code (smart lock integration)
3. Send check-in email with:
   - Property address and directions
   - Key code
   - WiFi password
   - House rules
   - Link to guest dashboard
4. Enable IoT permissions
5. Send admin notification

**Check-out Automation Workflow:**

Trigger: On checkout date
1. Revoke IoT permissions
2. Lock all doors
3. Create cleaning task
4. Send review request to guest
5. Send booking summary to admin

**Maintenance Alert Workflow:**

Trigger: HA sensor anomaly webhook
1. Parse sensor data
2. Create maintenance request in database
3. Determine severity
4. If urgent: Send SMS to admin
5. If normal: Create ticket in dashboard

#### Ollama Setup

Add to `docker-compose.yml`:

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ./ollama:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]  # If using GPU
```

Pull model:

```bash
docker exec -it ollama ollama pull llama3.1:8b
```

#### MCP Server Development

**Property Data MCP Server** (`mcp-servers/property/index.ts`):

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { db } from './db.js';
import { properties, bookings, guests } from './schema.js';
import { eq } from 'drizzle-orm';

const server = new Server(
  {
    name: 'property-management',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: Get property information
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_property_info': {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, args.propertyId),
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(property, null, 2),
          },
        ],
      };
    }

    case 'get_booking_details': {
      const booking = await db.query.bookings.findFirst({
        where: eq(bookings.id, args.bookingId),
        with: {
          property: true,
          guest: true,
        },
      });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(booking, null, 2),
          },
        ],
      };
    }

    case 'get_amenities': {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, args.propertyId),
      });
      return {
        content: [
          {
            type: 'text',
            text: property?.amenities || 'No amenities listed',
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Tool definitions
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'get_property_info',
        description: 'Get detailed information about a property',
        inputSchema: {
          type: 'object',
          properties: {
            propertyId: {
              type: 'number',
              description: 'The ID of the property',
            },
          },
          required: ['propertyId'],
        },
      },
      {
        name: 'get_booking_details',
        description: 'Get details about a specific booking',
        inputSchema: {
          type: 'object',
          properties: {
            bookingId: {
              type: 'number',
              description: 'The ID of the booking',
            },
          },
          required: ['bookingId'],
        },
      },
      {
        name: 'get_amenities',
        description: 'Get list of amenities for a property',
        inputSchema: {
          type: 'object',
          properties: {
            propertyId: {
              type: 'number',
              description: 'The ID of the property',
            },
          },
          required: ['propertyId'],
        },
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Property MCP server running on stdio');
}

main().catch(console.error);
```

**Local Services MCP Server** (`mcp-servers/local-services/index.ts`):

```typescript
// Similar structure, with tools like:
// - search_restaurants(location, cuisine, radius)
// - search_events(location, date, category)
// - get_directions(from, to)
// - get_weather(location)
```

**IoT Control MCP Server** (`mcp-servers/iot/index.ts`):

```typescript
// Tools:
// - control_lights(room, action, brightness)
// - control_lock(action)
// - control_music(action, volume)
// - get_device_status(deviceId)
```

**External Services MCP Server** (`mcp-servers/external/index.ts`):

```typescript
// Tools:
// - order_food(restaurant, items, address)
// - book_restaurant(name, time, partySize)
// - book_excursion(activity, date, participants)
```

#### AI Concierge Integration

Chat API endpoint (`services/api/src/app/api/guest/chat/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, message, history } = await request.json();

    // Get booking context
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: { property: true, guest: true },
    });

    // Build context for LLM
    const systemPrompt = `You are a helpful AI concierge for ${booking.property.name}.
The guest is staying from ${booking.checkInDate} to ${booking.checkOutDate}.

You can help with:
- Property information and amenities
- Local restaurant recommendations
- Event and activity suggestions
- Controlling smart home devices (lights, locks, music)
- Ordering food delivery
- Booking reservations

Be friendly, helpful, and concise. When taking actions (like ordering food or controlling devices),
confirm with the guest before executing.`;

    // Call Ollama with MCP context
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(history || []),
          { role: 'user', content: message },
        ],
        tools: [
          // MCP tools available to the model
          { name: 'get_property_info' },
          { name: 'search_restaurants' },
          { name: 'control_lights' },
          { name: 'order_food' },
          // ... all MCP tools
        ],
      }),
    });

    const data = await response.json();

    // If model calls a tool, execute it via MCP
    if (data.tool_calls) {
      for (const toolCall of data.tool_calls) {
        // Execute MCP tool
        const result = await executeMCPTool(toolCall.name, toolCall.arguments);
        // Add result to context and continue conversation
      }
    }

    return NextResponse.json({
      message: data.message.content,
      toolCalls: data.tool_calls,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
```

Chat UI in guest portal (`apps/guest/src/components/ai-chat.tsx`):

```typescript
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat({ bookingId }: { bookingId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/guest/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          message: input,
          history: messages,
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Success Criteria

- [ ] N8N running and accessible
- [ ] Check-in automation workflow working
- [ ] Check-out automation workflow working
- [ ] Maintenance alert workflow triggering correctly
- [ ] Ollama serving LLM locally
- [ ] All 4 MCP servers implemented and running
- [ ] AI chat interface in guest portal
- [ ] AI can answer property questions
- [ ] AI can recommend restaurants
- [ ] AI can control IoT devices via MCP
- [ ] AI can order food (with confirmation)
- [ ] Admin AI assistant working in Command K

### Testing Checklist

- [ ] Create test booking 24h in future, verify check-in email
- [ ] Test check-out automation on past booking
- [ ] Trigger HA sensor anomaly, verify maintenance ticket
- [ ] Chat with AI concierge about property
- [ ] Ask AI to turn on lights via chat
- [ ] Ask AI for restaurant recommendations
- [ ] Test food ordering flow (mock)
- [ ] Verify MCP tools are callable from Ollama

---

## Phase 5: Advanced Features & Multi-Property Scale (Weeks 15-18)

### Goal
Polish UX, add analytics, support multi-property scaling.

### Deliverables

#### Financial Management

Payment tracking table:

```typescript
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').references(() => bookings.id),
  leaseId: integer('lease_id').references(() => leases.id),
  amount: integer('amount').notNull(), // in cents
  method: text('method').notNull(), // 'cash' | 'check' | 'transfer' | 'stripe'
  status: text('status').notNull(), // 'pending' | 'completed' | 'failed'
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').references(() => properties.id),
  category: text('category').notNull(), // 'maintenance' | 'utilities' | 'insurance' | 'other'
  amount: integer('amount').notNull(),
  description: text('description'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});
```

Financial reports page:

```typescript
// Revenue by property, occupancy rates, expense tracking
```

#### Advanced Analytics Dashboard

```typescript
// Implement:
// - Occupancy rate calculation
// - Revenue projections
// - Maintenance cost analysis
// - Energy usage from HA sensors
// - Predictive maintenance alerts (rule-based)
```

#### Enhanced Command K with Entity Search

Update Command Palette to support entity search:

```typescript
// Add dynamic search results
const [searchResults, setSearchResults] = useState<CommandItem[]>([]);

async function handleSearch(query: string) {
  if (query.length < 2) return;

  // Search properties
  const propertiesRes = await fetch(`/api/admin/properties?search=${query}`);
  const properties = await propertiesRes.json();

  // Search bookings
  const bookingsRes = await fetch(`/api/admin/bookings?search=${query}`);
  const bookings = await bookingsRes.json();

  // Convert to command items
  const results: CommandItem[] = [
    ...properties.map(p => ({
      id: `property-${p.id}`,
      label: `${p.name} - ${p.address}`,
      action: () => router.push(`/properties/${p.id}`),
      group: 'Properties',
    })),
    ...bookings.map(b => ({
      id: `booking-${b.id}`,
      label: `Booking #${b.id} - ${b.guest.name}`,
      action: () => router.push(`/bookings/${b.id}`),
      group: 'Bookings',
    })),
  ];

  setSearchResults(results);
}
```

#### Multi-Property Optimization

Database indexing:

```typescript
// Add indexes for performance
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, check_in_date, check_out_date);
CREATE INDEX idx_iot_devices_property ON iot_devices(property_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
```

Property groups:

```typescript
export const propertyGroups = sqliteTable('property_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const propertyGroupMemberships = sqliteTable('property_group_memberships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupId: integer('group_id').references(() => propertyGroups.id),
  propertyId: integer('property_id').references(() => properties.id),
});
```

Centralized calendar view (all properties):

```typescript
// Calendar component showing all property bookings
```

#### Guest Experience Polish

PWA configuration (`apps/guest/public/manifest.json`):

```json
{
  "name": "Property Guest Portal",
  "short_name": "Guest Portal",
  "description": "Manage your stay",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Push notifications service worker:

```typescript
// Implement push notifications for check-in reminders, device alerts
```

Guest reviews:

```typescript
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').references(() => bookings.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});
```

#### Documentation

Create comprehensive docs:

- `docs/deployment.md` - Docker Compose setup guide
- `docs/hardware.md` - Hardware recommendations
- `docs/networking.md` - Cloudflare Tunnel + TwinGate setup
- `docs/mcp-extension.md` - How to add new MCP servers
- `docs/troubleshooting.md` - Common issues and solutions

### Success Criteria

- [ ] Financial reports showing revenue/expenses
- [ ] Analytics dashboard with occupancy rates
- [ ] Command K entity search working
- [ ] Property groups for multi-property management
- [ ] Centralized calendar view
- [ ] Guest portal installable as PWA
- [ ] Push notifications for check-in reminders
- [ ] Guest review system working
- [ ] Complete deployment documentation
- [ ] System tested with 10+ properties

### Testing Checklist

- [ ] Generate financial report for a property
- [ ] View occupancy analytics
- [ ] Search for a specific booking via Command K
- [ ] Create property group and assign properties
- [ ] Install guest portal as PWA on mobile
- [ ] Test push notification flow
- [ ] Submit and view guest review
- [ ] Follow deployment guide on fresh Beelink
- [ ] Load test with 20+ concurrent bookings

---

## Phase 6+ (Future Roadmap - Months 5-12)

### Optional Enhancements

**Advanced AI Capabilities:**
- Fine-tuned local LLM on property-specific data
- Predictive maintenance ML models (actual anomaly detection)
- Dynamic pricing recommendations (based on seasonality, events)
- Automated guest communication (smart responses to common questions)

**Multi-Tenant SaaS Mode:**
- PostgreSQL migration (from SQLite)
- Multi-landlord support with data isolation
- Subscription billing (if offering as service to other hosts)
- White-label guest portals

**Advanced Integrations:**
- Airbnb/VRBO calendar sync (import external bookings)
- Smart lock integration (August, Yale, Schlage APIs)
- Noise monitoring (Minut sensors for quiet hours enforcement)
- Energy optimization (auto-adjust thermostats between bookings)

**Mobile Native Apps:**
- React Native apps for iOS/Android
- Offline mode for guests (cached guidebook)
- Native push notifications

---

## Development Methodology

### Sprint Structure
- 2-week sprints per phase (adjust based on complexity)
- Deploy to staging environment after each phase
- User testing with 1-2 properties before full rollout
- Rollback plan for each deployment

### Testing Strategy
- Unit tests for API endpoints (Jest)
- E2E tests for critical flows (Playwright)
- Manual testing checklist per phase
- Security audit before public guest portal launch (Phase 3)

### Deployment Strategy
- **Phase 1-2**: Local development only
- **Phase 3**: Deploy guest portal to Vercel, admin dashboard stays local
- **Phase 4**: Full Docker Compose stack on Beelink
- **Phase 5**: Production hardening and monitoring

---

## Summary: Phase Timeline

| Phase | Timeline | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| **Phase 1** | Weeks 1-3 | Foundation & Command K | Admin dashboard, database schema, Command K palette |
| **Phase 2** | Weeks 4-6 | Home Assistant & IoT | Device control, real-time monitoring, permission system |
| **Phase 3** | Weeks 7-10 | Guest Portal & Bookings | Public booking site, guest IoT controls, Vercel deployment |
| **Phase 4** | Weeks 11-14 | Automation & AI | N8N workflows, Ollama concierge, MCP integrations |
| **Phase 5** | Weeks 15-18 | Scale & Polish | Analytics, entity search, multi-property support, documentation |
| **Phase 6+** | Months 5-12 | Advanced Features | ML predictions, SaaS mode, native apps (optional) |

**Total timeline to MVP (Phase 3 complete)**: ~10 weeks
**Total timeline to production-ready (Phase 5 complete)**: ~18 weeks

---

## Risk Mitigation

### Technical Risks
- **Hardware failure**: Regular backups to external drive + cloud backup (encrypted)
- **Network issues**: Fallback to mobile hotspot for critical operations
- **LLM performance**: Model quantization if Beelink struggles, upgrade to larger hardware if needed
- **IoT device compatibility**: Test devices before purchase, maintain compatibility matrix

### Operational Risks
- **Guest complaints**: 24/7 monitoring, automated alerts for critical failures
- **Data loss**: Daily automated backups, test restore procedures
- **Security breach**: Regular security audits, keep all software updated, use strong passwords

### Business Risks
- **Regulatory compliance**: Research local STR regulations, tax requirements
- **Liability**: Insurance coverage, clear terms of service, incident response plan

---

## Next Steps

1. **Review and approve this design document**
2. **Set up development environment** (Docker, Next.js, dependencies)
3. **Create git repository** and commit design doc
4. **Begin Phase 1 implementation** (Foundation & Command K)

**Ready to start building?** 🚀
