export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: number;
  propertyId: number;
  guestId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: BookingStatus;
  nightlyRate: number; // in cents
  cleaningFee: number; // in cents
  totalAmount: number; // in cents
  specialRequests?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingInput {
  propertyId: number;
  guestId: number;
  checkInDate: Date;
  checkOutDate: Date;
  nightlyRate: number;
  cleaningFee?: number;
  totalAmount: number;
  specialRequests?: string;
}

export interface UpdateBookingInput extends Partial<CreateBookingInput> {
  id: number;
  status?: BookingStatus;
}
