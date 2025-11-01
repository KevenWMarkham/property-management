export type PropertyType = 'short-term' | 'long-term' | 'hybrid';
export type PropertyCategory = 'apartment' | 'house' | 'condo' | 'commercial';

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  propertyType: PropertyCategory;
  units: number;
  nightlyRate?: number | null; // in cents
  cleaningFee?: number | null; // in cents
  amenities?: string | null; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  propertyType: PropertyCategory;
  units?: number;
  nightlyRate?: number; // in cents
  cleaningFee?: number; // in cents
  amenities?: string;
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  id: number;
}
