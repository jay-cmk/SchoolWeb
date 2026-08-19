export type SchoolStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export interface School {
  _id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;

  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  logo?: string;
  status: SchoolStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSchoolPayload {
  name?: string;
  code?: string;
  email?: string;
  phone?: string;
  logo?: string;

  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}


export interface CreateSchoolPayload {
  name: string;
  code: string;
  email: string;
  phone: string;

  address: {
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}