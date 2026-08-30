// src/features/schoolAdminDashboard/schoolAdminDashboard.types.ts

export interface DashboardSchool {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  logo?: string;
  status: string;
}

export interface DashboardAdmin {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

export interface DashboardSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface DashboardAttendance {
  present: number;
  absent: number;
  leave: number;
  halfDay: number;
  totalMarked: number;
  percentage: number;
}

export interface DashboardStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;

  attendance: DashboardAttendance;

  pendingFees: number;
  upcomingExams: number;
  pendingHomework: number;
}

export interface SchoolAdminDashboard {
  school: DashboardSchool;
  admin: DashboardAdmin;
  currentSession: DashboardSession | null;
  statistics: DashboardStatistics;
}

export interface SchoolAdminDashboardResponse {
  success: boolean;
  message: string;
  data: SchoolAdminDashboard;
}