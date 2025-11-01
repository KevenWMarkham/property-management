export interface Tenant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface UpdateTenantInput extends Partial<CreateTenantInput> {
  id: number;
}
