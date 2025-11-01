import { z } from 'zod';

// Property Validation Schemas
export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  type: z.enum(['short-term', 'long-term', 'hybrid']),
  propertyType: z.enum(['apartment', 'house', 'condo', 'commercial']),
  units: z.number().int().positive().default(1),
  nightlyRate: z.number().int().positive().optional().nullable(),
  cleaningFee: z.number().int().nonnegative().optional().nullable(),
  amenities: z.string().optional().nullable(),
});

export const createPropertySchema = propertySchema;
export const updatePropertySchema = propertySchema.partial().extend({
  id: z.number().int().positive(),
});

// Tenant Validation Schemas
export const tenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
});

export const createTenantSchema = tenantSchema;
export const updateTenantSchema = tenantSchema.partial().extend({
  id: z.number().int().positive(),
});

// Guest Validation Schemas
export const guestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
});

export const createGuestSchema = guestSchema;
export const updateGuestSchema = guestSchema.partial().extend({
  id: z.number().int().positive(),
});

// Booking Validation Schemas
export const bookingSchema = z.object({
  propertyId: z.number().int().positive(),
  guestId: z.number().int().positive(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  status: z.enum(['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled']).default('pending'),
  nightlyRate: z.number().int().positive(),
  cleaningFee: z.number().int().nonnegative().default(0),
  totalAmount: z.number().int().positive(),
  specialRequests: z.string().optional().nullable(),
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

export const createBookingSchema = bookingSchema;
export const updateBookingSchema = bookingSchema.partial().extend({
  id: z.number().int().positive(),
});

// Lease Validation Schemas
export const leaseSchema = z.object({
  propertyId: z.number().int().positive(),
  tenantId: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  monthlyRent: z.number().int().positive(),
  securityDeposit: z.number().int().nonnegative().default(0),
  status: z.enum(['active', 'expired', 'terminated']).default('active'),
  terms: z.string().optional().nullable(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const createLeaseSchema = leaseSchema;
export const updateLeaseSchema = leaseSchema.partial().extend({
  id: z.number().int().positive(),
});

// Payment Validation Schemas
export const paymentSchema = z.object({
  leaseId: z.number().int().positive(),
  amount: z.number().int().positive(),
  dueDate: z.coerce.date(),
  paidDate: z.coerce.date().optional().nullable(),
  status: z.enum(['pending', 'paid', 'overdue', 'partial']).default('pending'),
  paymentMethod: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createPaymentSchema = paymentSchema;
export const updatePaymentSchema = paymentSchema.partial().extend({
  id: z.number().int().positive(),
});

// Maintenance Request Validation Schemas
export const maintenanceRequestSchema = z.object({
  propertyId: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['open', 'in-progress', 'completed', 'cancelled']).default('open'),
  reportedBy: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  estimatedCost: z.number().int().nonnegative().optional().nullable(),
  actualCost: z.number().int().nonnegative().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const createMaintenanceRequestSchema = maintenanceRequestSchema;
export const updateMaintenanceRequestSchema = maintenanceRequestSchema.partial().extend({
  id: z.number().int().positive(),
});
