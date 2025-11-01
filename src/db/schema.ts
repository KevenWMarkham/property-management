import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Properties table
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),

  // NEW: Rental type for hybrid support
  type: text('type').notNull().default('long-term'), // 'short-term' | 'long-term' | 'hybrid'

  propertyType: text('property_type').notNull(), // apartment, house, commercial, etc.
  units: integer('units').notNull().default(1),

  // NEW: Short-term rental fields
  nightlyRate: integer('nightly_rate'), // in cents, for short-term rentals
  cleaningFee: integer('cleaning_fee'), // in cents
  amenities: text('amenities'), // JSON string of amenities

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tenants table
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Leases table
export const leases = sqliteTable('leases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  unitNumber: text('unit_number'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  monthlyRent: integer('monthly_rent').notNull(), // stored in cents
  securityDeposit: integer('security_deposit').notNull(), // stored in cents
  status: text('status').notNull().default('active'), // active, expired, terminated
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaseId: integer('lease_id').notNull().references(() => leases.id),
  amount: integer('amount').notNull(), // stored in cents
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  paidDate: integer('paid_date', { mode: 'timestamp' }),
  status: text('status').notNull().default('pending'), // pending, paid, late, partial
  paymentMethod: text('payment_method'), // check, bank_transfer, credit_card, etc.
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Maintenance requests table
export const maintenanceRequests = sqliteTable('maintenance_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  tenantId: integer('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull().default('medium'), // low, medium, high, urgent
  status: text('status').notNull().default('open'), // open, in_progress, completed, cancelled
  category: text('category'), // plumbing, electrical, hvac, appliance, etc.
  completedDate: text('completed_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: Guests table (separate from tenants)
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

// NEW: Bookings table (short-term reservations)
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  checkInDate: integer('check_in_date', { mode: 'timestamp' }).notNull(),
  checkOutDate: integer('check_out_date', { mode: 'timestamp' }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  nightlyRate: integer('nightly_rate').notNull(), // in cents
  cleaningFee: integer('cleaning_fee').default(0), // in cents
  totalAmount: integer('total_amount').notNull(), // in cents
  specialRequests: text('special_requests'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: IoT Devices table (foundation for Phase 2)
export const iotDevices = sqliteTable('iot_devices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  haEntityId: text('ha_entity_id').notNull().unique(), // Home Assistant entity ID
  deviceType: text('device_type').notNull(), // 'light' | 'lock' | 'thermostat' | 'sensor' | 'switch' | 'media_player'
  name: text('name').notNull(),
  room: text('room'), // 'Living Room', 'Bedroom 1', etc.
  guestControllable: integer('guest_controllable', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: IoT Permissions table (temporary guest access)
export const iotPermissions = sqliteTable('iot_permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  deviceId: integer('device_id').notNull().references(() => iotDevices.id),
  grantedAt: integer('granted_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
});
