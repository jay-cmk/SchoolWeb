// import { UserRole } from "../constants/roles";

// export interface AuthTokenPayload {
//   userId: string;
//   role: UserRole;
//   schoolId?: string;
// }



import { UserRole } from "../constants/roles";

export interface AuthTokenPayload {
  userId: string;

  role: UserRole;

  schoolId?: string;

  studentId?: string;

   teacherId?: string;
}