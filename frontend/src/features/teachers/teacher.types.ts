// ============================================
// TEACHER TYPES
// ============================================

export type TeacherGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


// ============================================
// TEACHER DATA
// ============================================

export interface TeacherData {
  _id: string;

  schoolId: string;

  employeeId: string;

  name: string;

  email: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}


// ============================================
// CREATE TEACHER
// ============================================

export interface CreateTeacherPayload {
  employeeId: string;

  name: string;

  email: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;
}


// ============================================
// UPDATE TEACHER
// ============================================

export interface UpdateTeacherPayload {
  employeeId?: string;

  name?: string;

  email?: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;
}


// ============================================
// GET TEACHERS FILTERS
// ============================================

export interface GetTeachersParams {
  isActive?: boolean;

  gender?: TeacherGender;
}


// ============================================
// SINGLE RESPONSE
// ============================================

export interface TeacherResponse {
  success: boolean;

  message: string;

  data: {
    teacher: TeacherData;
  };
}


// ============================================
// LIST RESPONSE
// ============================================

export interface TeachersResponse {
  success: boolean;

  message: string;

  data: {
    teachers: TeacherData[];
  };
}


// ============================================
// REDUX STATE
// ============================================

export interface TeacherState {
  teachers: TeacherData[];

  selectedTeacher:
    | TeacherData
    | null;

  loading: boolean;

  error: string | null;
}