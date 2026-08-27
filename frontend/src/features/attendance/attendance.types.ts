// ============================================
// ATTENDANCE TYPES
// ============================================


// ============================================
// STATUS
// ============================================

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "HALF_DAY";


// ============================================
// POPULATED STUDENT
// ============================================

export interface AttendanceStudent {
  _id: string;

  firstName: string;

  lastName?: string;

  admissionNumber?: string;

  rollNumber?: number;

  profileImage?: string;
}


// ============================================
// POPULATED SESSION
// ============================================

export interface AttendanceSession {
  _id: string;

  name: string;
}


// ============================================
// POPULATED CLASS
// ============================================

export interface AttendanceClass {
  _id: string;

  name: string;
}


// ============================================
// POPULATED SECTION
// ============================================

export interface AttendanceSection {
  _id: string;

  name: string;
}


// ============================================
// MARKED BY USER
// ============================================

export interface AttendanceMarkedBy {
  _id: string;

  name?: string;

  email?: string;
}


// ============================================
// ATTENDANCE RECORD
// ============================================

export interface AttendanceData {
  _id: string;

  schoolId: string;

  sessionId:
    | string
    | AttendanceSession;

  classId:
    | string
    | AttendanceClass;

  sectionId:
    | string
    | AttendanceSection;

  studentId:
    | string
    | AttendanceStudent;

  date: string;

  status:
    AttendanceStatus;

  remarks?: string;

  markedBy:
    | string
    | AttendanceMarkedBy;

  createdAt: string;

  updatedAt: string;
}


// ============================================
// SINGLE STUDENT INPUT
// ============================================

export interface StudentAttendanceInput {
  studentId: string;

  status:
    AttendanceStatus;

  remarks?: string;
}


// ============================================
// BULK PAYLOAD
// ============================================

export interface BulkAttendancePayload {
  sessionId: string;

  classId: string;

  sectionId: string;

  date: string;

  attendance:
    StudentAttendanceInput[];
}


// ============================================
// UPDATE ATTENDANCE
// ============================================

export interface UpdateAttendancePayload {
  status?: AttendanceStatus;

  remarks?: string;
}


// ============================================
// GET ATTENDANCE FILTERS
// ============================================

export interface GetAttendanceParams {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  studentId?: string;

  date?: string;

  status?: AttendanceStatus;
}


// ============================================
// MONTHLY SUMMARY PARAMS
// ============================================

export interface MonthlyAttendanceParams {
  sessionId: string;

  classId: string;

  sectionId: string;

  month: number;

  year: number;
}


// ============================================
// STUDENT SUMMARY PARAMS
// ============================================

export interface StudentAttendanceSummaryParams {
  studentId: string;

  sessionId?: string;

  month?: number;

  year?: number;
}


// ============================================
// MONTHLY STUDENT SUMMARY
// ============================================

export interface MonthlyStudentSummary {
  student:
    AttendanceStudent;

  presentDays: number;

  absentDays: number;

  leaveDays: number;

  halfDays: number;

  workingDays: number;

  attendancePercentage:
    number;

  below75: boolean;
}


// ============================================
// MONTHLY SUMMARY DATA
// ============================================

export interface MonthlyAttendanceSummaryData {
  month: number;

  year: number;

  workingDays: number;

  totalStudents: number;

  summary:
    MonthlyStudentSummary[];
}


// ============================================
// CALENDAR RECORD
// ============================================

export interface StudentAttendanceCalendarItem {
  date: string;

  status:
    AttendanceStatus;

  remarks: string;
}


// ============================================
// STUDENT ATTENDANCE TOTAL SUMMARY
// ============================================

export interface StudentAttendanceTotalSummary {
  presentDays: number;

  absentDays: number;

  leaveDays: number;

  halfDays: number;

  workingDays: number;

  attendancePercentage:
    number;

  below75: boolean;
}


// ============================================
// STUDENT SUMMARY RESPONSE DATA
// ============================================

export interface StudentAttendanceSummaryData {
  student: {
    _id: string;

    firstName: string;

    lastName?: string;

    admissionNumber?: string;

    rollNumber?: number;

    profileImage?: string;

    sessionId?:
      | string
      | AttendanceSession;

    classId?:
      | string
      | AttendanceClass;

    sectionId?:
      | string
      | AttendanceSection;
  };

  summary:
    StudentAttendanceTotalSummary;

  calendar:
    StudentAttendanceCalendarItem[];
}


// ============================================
// BULK RESPONSE
// ============================================

export interface BulkAttendanceResponse {
  success: boolean;

  message: string;

  data: {
    attendance:
      AttendanceData[];
  };
}


// ============================================
// GET ATTENDANCE RESPONSE
// ============================================

export interface AttendanceListResponse {
  success: boolean;

  message: string;

  data: {
    attendance:
      AttendanceData[];
  };
}


// ============================================
// SINGLE ATTENDANCE RESPONSE
// ============================================

export interface AttendanceResponse {
  success: boolean;

  message: string;

  data: {
    attendance:
      AttendanceData;
  };
}


// ============================================
// MONTHLY SUMMARY RESPONSE
// ============================================

export interface MonthlyAttendanceSummaryResponse {
  success: boolean;

  message: string;

  data:
    MonthlyAttendanceSummaryData;
}


// ============================================
// STUDENT SUMMARY RESPONSE
// ============================================

export interface StudentAttendanceSummaryResponse {
  success: boolean;

  message: string;

  data:
    StudentAttendanceSummaryData;
}


// ============================================
// REDUX STATE
// ============================================

export interface AttendanceState {
  attendance:
    AttendanceData[];

  monthlySummary:
    MonthlyAttendanceSummaryData | null;

  studentSummary:
    StudentAttendanceSummaryData | null;

  selectedAttendance:
    AttendanceData | null;

  loading: boolean;

  saving: boolean;

  error: string | null;
}