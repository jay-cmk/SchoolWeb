export interface SchoolAdmin {
  id: string;
  name: string;
  email: string;
  mobile?: string;

  role: "SCHOOL_ADMIN";

  schoolId: string;

  isActive: boolean;

  lastLoginAt?: string;
  createdAt?: string;
  
}


export interface UpdateSchoolAdminPayload {
  name?: string;
  email?: string;
  mobile?: string;
}


export interface CreateSchoolAdminPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
}