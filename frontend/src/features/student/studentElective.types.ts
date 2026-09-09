/* =====================================================
   STUDENT ELECTIVE SUBJECT TYPES
===================================================== */

export type StudentElectiveStatus =
  | "ACTIVE"
  | "DROPPED"
  | "COMPLETED";


export type StudentStream =
  | "SCIENCE"
  | "COMMERCE"
  | "ARTS"
  | "VOCATIONAL";


export type ElectiveSubjectType =
  | "CORE"
  | "LANGUAGE"
  | "PRACTICAL"
  | "ELECTIVE";


/* =====================================================
   POPULATED STUDENT
===================================================== */

export interface ElectiveStudent {
  _id: string;

  name: string;

  admissionNumber: string;

  rollNumber?: number;

  penNumber?: string;

  mobile?: string;

  email?: string;

  status?: string;
}


/* =====================================================
   POPULATED ACADEMIC SESSION
===================================================== */

export interface ElectiveSession {
  _id: string;

  name: string;

  startDate?: string;

  endDate?: string;

  isCurrent?: boolean;
}


/* =====================================================
   POPULATED CLASS
===================================================== */

export interface ElectiveClass {
  _id: string;

  name: string;

  order?: number;
}


/* =====================================================
   POPULATED SECTION
===================================================== */

export interface ElectiveSection {
  _id: string;

  name: string;

  roomNumber?: string;
}


/* =====================================================
   POPULATED SUBJECT
===================================================== */

export interface ElectiveSubject {
  _id: string;

  name: string;

  code: string;

  description?: string;

  subjectType: ElectiveSubjectType;
}


/* =====================================================
   POPULATED TEACHER
===================================================== */

export interface ElectiveTeacher {
  _id: string;

  name: string;

  employeeId?: string;

  email?: string;

  mobile?: string;

  profileImage?: string;
}


/* =====================================================
   SUBJECT ASSIGNMENT
===================================================== */

export interface ElectiveSubjectAssignment {
  _id: string;

  schoolId?: string;

  sessionId:
    | string
    | ElectiveSession;

  classId:
    | string
    | ElectiveClass;

  sectionId:
    | string
    | ElectiveSection;

  subjectId:
    | string
    | ElectiveSubject;

  teacherId?:
    | string
    | ElectiveTeacher;

  weeklyPeriods?: number;

  isActive?: boolean;
}


/* =====================================================
   STUDENT ELECTIVE ENROLLMENT
===================================================== */

export interface StudentElectiveEnrollment {
  _id: string;

  schoolId: string;

  studentId:
    | string
    | ElectiveStudent;

  sessionId?:
    | string
    | ElectiveSession;

  classId?:
    | string
    | ElectiveClass;

  sectionId?:
    | string
    | ElectiveSection;

  subjectAssignmentId:
    | string
    | ElectiveSubjectAssignment;

  status: StudentElectiveStatus;

  remarks?: string;

  createdBy?: string;

  updatedBy?: string;

  createdAt?: string;

  updatedAt?: string;
}


/* =====================================================
   ASSIGN SINGLE ELECTIVE SUBJECT

   POST /students/elective-subjects
===================================================== */

export interface AssignStudentElectivePayload {
  studentId: string;

  subjectAssignmentId: string;

  remarks?: string;
}


/* =====================================================
   BULK ASSIGN ELECTIVE SUBJECT

   POST /students/elective-subjects/bulk
===================================================== */

export interface BulkAssignStudentElectivePayload {
  studentIds: string[];

  subjectAssignmentId: string;

  remarks?: string;
}


/* =====================================================
   UPDATE ELECTIVE STATUS / REMARKS

   PATCH /students/elective-subjects/:enrollmentId
===================================================== */

export interface UpdateStudentElectivePayload {
  status?: StudentElectiveStatus;

  remarks?: string;
}


/* =====================================================
   GET ELECTIVE ENROLLMENTS FILTERS
===================================================== */

export interface GetStudentElectivesParams {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  studentId?: string;

  subjectId?: string;

  subjectAssignmentId?: string;

  stream?: StudentStream;

  status?: StudentElectiveStatus;
}


/* =====================================================
   SINGLE API RESPONSE
===================================================== */

export interface StudentElectiveResponse {
  success: boolean;

  message?: string;

  data: {
    enrollment:
      StudentElectiveEnrollment;
  };
}


/* =====================================================
   LIST API RESPONSE
===================================================== */

export interface StudentElectivesResponse {
  success: boolean;

  message?: string;

  data: {
    enrollments:
      StudentElectiveEnrollment[];

    total?: number;
  };
}


/* =====================================================
   BULK ASSIGN RESULT
===================================================== */

export interface BulkAssignElectiveResult {
  enrollments:
    StudentElectiveEnrollment[];

  assignedCount?: number;

  skippedCount?: number;
}


/* =====================================================
   BULK ASSIGN RESPONSE
===================================================== */

export interface BulkAssignElectiveResponse {
  success: boolean;

  message?: string;

  data: BulkAssignElectiveResult;
}


/* =====================================================
   REDUX STATE
===================================================== */

export interface StudentElectiveState {
  enrollments:
    StudentElectiveEnrollment[];

  selectedEnrollment:
    StudentElectiveEnrollment | null;

  loading: boolean;

  submitting: boolean;

  error: string | null;

  successMessage: string | null;
}