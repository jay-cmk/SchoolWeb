export const TeacherAttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LEAVE: "LEAVE",
  HALF_DAY: "HALF_DAY",
} as const;

export type TeacherAttendanceStatus =
  (typeof TeacherAttendanceStatus)[keyof typeof TeacherAttendanceStatus];

export interface TeacherAttendanceTeacher {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile?: string;
  gender?: string;
  qualification?: string;
  profileImage?: string;
  isActive?: boolean;
}

export interface TeacherAttendanceMarkedBy {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface TeacherAttendanceData {
  _id: string;
  schoolId: string;
  teacherId: string | TeacherAttendanceTeacher;
  date: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  markedBy: string | TeacherAttendanceMarkedBy;
  updatedBy?: string | TeacherAttendanceMarkedBy;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendanceInput {
  teacherId: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface BulkTeacherAttendancePayload {
  date: string;
  attendance: TeacherAttendanceInput[];
}

export interface UpdateTeacherAttendancePayload {
  status?: TeacherAttendanceStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  remarks?: string | null;
}

export interface GetTeacherAttendanceParams {
  teacherId?: string;
  date?: string;
  status?: TeacherAttendanceStatus;
  month?: number;
  year?: number;
}

export interface TeacherAttendanceMonthlyParams {
  month: number;
  year: number;
  teacherId?: string;
}

export interface MyTeacherAttendanceParams {
  month?: number;
  year?: number;
}

export interface TeacherAttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  attendancePercentage: number;
}

export interface TeacherMonthlyAttendanceRow
  extends TeacherAttendanceSummary {
  teacher: TeacherAttendanceTeacher;
}

export interface TeacherAttendanceMonthlySummaryData {
  month: number;
  year: number;
  totalTeachers: number;
  summary: TeacherMonthlyAttendanceRow[];
}

export interface SingleTeacherAttendanceSummaryData {
  teacher: TeacherAttendanceTeacher;
  month: number;
  year: number;
  summary: TeacherAttendanceSummary;
  attendance: TeacherAttendanceData[];
}

export interface BulkTeacherAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendance: TeacherAttendanceData[];
    total: number;
  };
}

export interface TeacherAttendanceListResponse {
  success: boolean;
  message: string;
  data: {
    attendance: TeacherAttendanceData[];
    total: number;
  };
}

export interface TeacherAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendance: TeacherAttendanceData;
  };
}

export interface TeacherAttendanceMonthlySummaryResponse {
  success: boolean;
  message: string;
  data: TeacherAttendanceMonthlySummaryData;
}

export interface SingleTeacherAttendanceSummaryResponse {
  success: boolean;
  message: string;
  data: SingleTeacherAttendanceSummaryData;
}

export interface TeacherAttendanceState {
  attendance: TeacherAttendanceData[];
  monthlySummary: TeacherAttendanceMonthlySummaryData | null;
  selectedTeacherSummary: SingleTeacherAttendanceSummaryData | null;
  myAttendance: SingleTeacherAttendanceSummaryData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

