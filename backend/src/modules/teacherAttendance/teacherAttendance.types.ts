export type TeacherAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "HALF_DAY";

export interface TeacherAttendanceInput {
  teacherId: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface BulkTeacherAttendanceData {
  date: string;
  attendance: TeacherAttendanceInput[];
}

export interface UpdateTeacherAttendanceData {
  status?: TeacherAttendanceStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  remarks?: string | null;
}

export interface TeacherAttendanceFilters {
  teacherId?: string;
  date?: string;
  status?: TeacherAttendanceStatus;
  month?: number;
  year?: number;
}

export interface TeacherAttendanceSummaryFilters {
  teacherId?: string;
  month: number;
  year: number;
}

export interface TeacherAttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  attendancePercentage: number;
}

