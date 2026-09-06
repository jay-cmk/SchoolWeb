// // ============================================
// // SUBJECT ASSIGNMENT TYPES
// // ============================================


// // ============================================
// // POPULATED SESSION
// // ============================================

// export interface AssignmentSession {
//   _id: string;

//   name: string;

//   startDate?: string;

//   endDate?: string;

//   isCurrent?: boolean;
// }


// // ============================================
// // POPULATED SUBJECT
// // ============================================

// export interface AssignmentSubject {
//   _id: string;

//   name: string;

//   code: string;

//   subjectType: string;
// }


// // ============================================
// // POPULATED CLASS
// // ============================================

// export interface AssignmentClass {
//   _id: string;

//   name: string;

//   order?: number;
// }


// // ============================================
// // POPULATED SECTION
// // ============================================

// export interface AssignmentSection {
//   _id: string;

//   name: string;

//   roomNumber?: string;
// }


// // ============================================
// // POPULATED TEACHER
// // ============================================

// export interface AssignmentTeacher {
//   _id: string;

//   name: string;

//   employeeId: string;

//   email: string;

//   mobile?: string;

//   profileImage?: string;
// }


// // ============================================
// // SUBJECT ASSIGNMENT DATA
// // ============================================

// export interface SubjectAssignmentData {
//   _id: string;

//   schoolId: string;

//   sessionId:
//     | string
//     | AssignmentSession;

//   subjectId:
//     | string
//     | AssignmentSubject;

//   classId:
//     | string
//     | AssignmentClass;

//   sectionId:
//     | string
//     | AssignmentSection;

//   teacherId:
//     | string
//     | AssignmentTeacher;

//   weeklyPeriods: number;

//   isActive: boolean;

//   createdAt: string;

//   updatedAt: string;
// }


// // ============================================
// // CREATE PAYLOAD
// // ============================================

// export interface CreateSubjectAssignmentPayload {
//   sessionId: string;

//   subjectId: string;

//   classId: string;

//   sectionId: string;

//   teacherId: string;

//   weeklyPeriods: number;
// }


// // ============================================
// // UPDATE PAYLOAD
// // ============================================

// export interface UpdateSubjectAssignmentPayload {
//   teacherId?: string;

//   weeklyPeriods?: number;
// }


// // ============================================
// // GET FILTERS
// // ============================================

// export interface GetSubjectAssignmentsParams {
//   sessionId?: string;

//   subjectId?: string;

//   classId?: string;

//   sectionId?: string;

//   teacherId?: string;

//   isActive?: boolean;
// }


// // ============================================
// // SINGLE RESPONSE
// // ============================================

// export interface SubjectAssignmentResponse {
//   success: boolean;

//   message: string;

//   data: {
//     assignment:
//       SubjectAssignmentData;
//   };
// }


// // ============================================
// // LIST RESPONSE
// // ============================================

// export interface SubjectAssignmentsResponse {
//   success: boolean;

//   message: string;

//   data: {
//     assignments:
//       SubjectAssignmentData[];
//   };
// }


// // ============================================
// // REDUX STATE
// // ============================================

// export interface SubjectAssignmentState {
//   assignments:
//     SubjectAssignmentData[];

//   selectedAssignment:
//     SubjectAssignmentData | null;

//   loading: boolean;

//   error: string | null;
// }






// ============================================
// SUBJECT ASSIGNMENT TYPES
// ============================================


// ============================================
// POPULATED SESSION
// ============================================

export interface AssignmentSession {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;
}


// ============================================
// POPULATED SUBJECT
// ============================================

export interface AssignmentSubject {
  _id: string;

  name: string;

  code: string;

  subjectType: string;
}


// ============================================
// POPULATED CLASS
// ============================================

export interface AssignmentClass {
  _id: string;

  name: string;

  order?: number;
}


// ============================================
// POPULATED SECTION
// ============================================

export interface AssignmentSection {
  _id: string;

  name: string;

  roomNumber?: string;
}


// ============================================
// POPULATED TEACHER
// ============================================

export interface AssignmentTeacher {
  _id: string;

  name: string;

  employeeId: string;

  email: string;

  mobile?: string;

  profileImage?: string;
}


// ============================================
// LOGGED-IN TEACHER SUMMARY
//
// GET /subject-assignments/teacher/me
// ============================================

export interface MyAssignmentTeacher {
  _id: string;

  employeeId: string;

  name: string;

  email: string;
}


// ============================================
// SUBJECT ASSIGNMENT DATA
// ============================================

export interface SubjectAssignmentData {
  _id: string;

  schoolId: string;

  sessionId:
    | string
    | AssignmentSession;

  subjectId:
    | string
    | AssignmentSubject;

  classId:
    | string
    | AssignmentClass;

  sectionId:
    | string
    | AssignmentSection;

  teacherId:
    | string
    | AssignmentTeacher;

  weeklyPeriods: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}


// ============================================
// CREATE PAYLOAD
// ============================================

export interface CreateSubjectAssignmentPayload {
  sessionId: string;

  subjectId: string;

  classId: string;

  sectionId: string;

  teacherId: string;

  weeklyPeriods: number;
}


// ============================================
// UPDATE PAYLOAD
// ============================================

export interface UpdateSubjectAssignmentPayload {
  teacherId?: string;

  weeklyPeriods?: number;
}


// ============================================
// GET FILTERS
// ============================================

export interface GetSubjectAssignmentsParams {
  sessionId?: string;

  subjectId?: string;

  classId?: string;

  sectionId?: string;

  teacherId?: string;

  isActive?: boolean;
}


// ============================================
// SINGLE RESPONSE
// ============================================

export interface SubjectAssignmentResponse {
  success: boolean;

  message: string;

  data: {
    assignment:
      SubjectAssignmentData;
  };
}


// ============================================
// LIST RESPONSE
// ============================================

export interface SubjectAssignmentsResponse {
  success: boolean;

  message: string;

  data: {
    assignments:
      SubjectAssignmentData[];
  };
}


// ============================================
// MY SUBJECT ASSIGNMENTS RESPONSE
//
// TEACHER
// GET /subject-assignments/teacher/me
// ============================================

export interface MySubjectAssignmentsResponse {
  success: boolean;

  message: string;

  data: {
    teacher:
      MyAssignmentTeacher;

    assignments:
      SubjectAssignmentData[];
  };
}


// ============================================
// MY SUBJECT ASSIGNMENTS DATA
// ============================================

export interface MySubjectAssignmentsData {
  teacher:
    MyAssignmentTeacher;

  assignments:
    SubjectAssignmentData[];
}


// ============================================
// REDUX STATE
// ============================================

export interface SubjectAssignmentState {
  // School Admin assignments
  assignments:
    SubjectAssignmentData[];

  // School Admin selected assignment
  selectedAssignment:
    | SubjectAssignmentData
    | null;

  // Logged-in Teacher assignments
  myAssignments:
    SubjectAssignmentData[];

  // Logged-in Teacher summary
  myTeacher:
    MyAssignmentTeacher | null;

  loading: boolean;

  error: string | null;
}