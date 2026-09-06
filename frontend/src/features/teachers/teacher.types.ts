// // ============================================
// // TEACHER TYPES
// // ============================================

// export type TeacherGender =
//   | "MALE"
//   | "FEMALE"
//   | "OTHER";


// // ============================================
// // TEACHER DATA
// // ============================================

// export interface TeacherData {
//   _id: string;

//   schoolId: string;

//   employeeId: string;

//   name: string;

//   email: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: string;

//   profileImage?: string;

//   isActive: boolean;

//   createdAt: string;

//   updatedAt: string;
// }


// // ============================================
// // CREATE TEACHER
// // ============================================

// export interface CreateTeacherPayload {
//   employeeId: string;

//   name: string;

//   email: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: string;

//   profileImage?: string;
// }


// // ============================================
// // UPDATE TEACHER
// // ============================================

// export interface UpdateTeacherPayload {
//   employeeId?: string;

//   name?: string;

//   email?: string;

//   mobile?: string;

//   gender?: TeacherGender;

//   qualification?: string;

//   joiningDate?: string;

//   profileImage?: string;
// }


// // ============================================
// // GET TEACHERS FILTERS
// // ============================================

// export interface GetTeachersParams {
//   isActive?: boolean;

//   gender?: TeacherGender;
// }


// // ============================================
// // SINGLE RESPONSE
// // ============================================

// export interface TeacherResponse {
//   success: boolean;

//   message: string;

//   data: {
//     teacher: TeacherData;
//   };
// }


// // ============================================
// // LIST RESPONSE
// // ============================================

// export interface TeachersResponse {
//   success: boolean;

//   message: string;

//   data: {
//     teachers: TeacherData[];
//   };
// }


// // ============================================
// // REDUX STATE
// // ============================================

// export interface TeacherState {
//   teachers: TeacherData[];

//   selectedTeacher:
//     | TeacherData
//     | null;

//   loading: boolean;

//   error: string | null;
// }






// ============================================
// TEACHER TYPES
// ============================================

export type TeacherGender =
  | "MALE"
  | "FEMALE"
  | "OTHER";


// ============================================
// LINKED USER DATA
//
// New Teacher records are linked with User.
// GET /teachers/me may return populated userId.
// ============================================

export interface TeacherUserData {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
}


// ============================================
// TEACHER DATA
// ============================================

export interface TeacherData {
  _id: string;

  schoolId: string;

  // Old teachers may not have userId yet.
  // New teachers are linked with User.
  userId?:
    | string
    | TeacherUserData;

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
//
// password is required because backend now
// creates Teacher + User login account together.
// ============================================

export interface CreateTeacherPayload {
  employeeId: string;

  name: string;

  email: string;

  password: string;

  mobile?: string;

  gender?: TeacherGender;

  qualification?: string;

  joiningDate?: string;

  profileImage?: string;
}


// ============================================
// UPDATE TEACHER
//
// Password is intentionally NOT here.
// Password reset will be separate later.
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
  // School Admin teacher list
  teachers: TeacherData[];

  // School Admin selected teacher
  selectedTeacher:
    | TeacherData
    | null;

  // Logged-in Teacher own profile
  myTeacher:
    | TeacherData
    | null;

  loading: boolean;

  error: string | null;
}