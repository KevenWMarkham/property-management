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
  propertyType: text('property_type').notNull(), // apartment, house, commercial, etc.
  units: integer('units').notNull().default(1),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Leases table
export const leases = sqliteTable('leases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  unitNumber: text('unit_number'),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  monthlyRent: integer('monthly_rent').notNull(), // stored in cents
  securityDeposit: integer('security_deposit').notNull(), // stored in cents
  status: text('status').notNull().default('active'), // active, expired, terminated
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaseId: integer('lease_id').notNull().references(() => leases.id),
  amount: integer('amount').notNull(), // stored in cents
  dueDate: text('due_date').notNull(),
  paidDate: text('paid_date'),
  status: text('status').notNull().default('pending'), // pending, paid, late, partial
  paymentMethod: text('payment_method'), // check, bank_transfer, credit_card, etc.
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
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
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
