import { UserRole } from "../constants/roles";

export interface AuthTokenPayload {
  userId: string;
  role: UserRole;
  schoolId?: string;
}