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
