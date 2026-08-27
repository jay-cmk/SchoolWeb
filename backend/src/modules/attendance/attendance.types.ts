// ============================================
// ATTENDANCE STATUS
// ============================================

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LEAVE = "LEAVE",
  HALF_DAY = "HALF_DAY",
}


// ============================================
// SINGLE STUDENT ATTENDANCE INPUT
// ============================================

export interface StudentAttendanceInput {
  studentId: string;

  status: AttendanceStatus;

  remarks?: string;
}


// ============================================
// BULK ATTENDANCE PAYLOAD
// ============================================

export interface BulkAttendanceData {
  sessionId: string;

  classId: string;

  sectionId: string;

  date: string;

  attendance: StudentAttendanceInput[];
}


// ============================================
// UPDATE SINGLE ATTENDANCE
// ============================================

export interface UpdateAttendanceData {
  status?: AttendanceStatus;

  remarks?: string;
}


// ============================================
// GET ATTENDANCE FILTERS
// ============================================

export interface AttendanceFilters {
  sessionId?: string;

  classId?: string;

  sectionId?: string;

  studentId?: string;

  date?: string;

  status?: AttendanceStatus;
}


// ============================================
// MONTHLY SUMMARY FILTERS
// ============================================

export interface MonthlyAttendanceSummaryFilters {
  sessionId: string;

  classId: string;

  sectionId: string;

  month: number;

  year: number;
}


// ============================================
// STUDENT ATTENDANCE SUMMARY FILTERS
// ============================================

export interface StudentAttendanceSummaryFilters {
  sessionId?: string;

  month?: number;

  year?: number;
}