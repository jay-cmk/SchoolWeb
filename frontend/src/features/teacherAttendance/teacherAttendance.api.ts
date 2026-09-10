import api from "../../api/axios";

import type {
  BulkTeacherAttendancePayload,
  BulkTeacherAttendanceResponse,
  GetTeacherAttendanceParams,
  MyTeacherAttendanceParams,
  SingleTeacherAttendanceSummaryData,
  SingleTeacherAttendanceSummaryResponse,
  TeacherAttendanceData,
  TeacherAttendanceListResponse,
  TeacherAttendanceMonthlyParams,
  TeacherAttendanceMonthlySummaryData,
  TeacherAttendanceMonthlySummaryResponse,
  TeacherAttendanceResponse,
  UpdateTeacherAttendancePayload,
} from "./teacherAttendance.types";

export const markBulkTeacherAttendanceApi = async (
  data: BulkTeacherAttendancePayload,
): Promise<TeacherAttendanceData[]> => {
  const response = await api.post<BulkTeacherAttendanceResponse>(
    "/teacher-attendance/bulk",
    data,
  );

  return response.data.data.attendance;
};

export const getTeacherAttendanceApi = async (
  params?: GetTeacherAttendanceParams,
): Promise<TeacherAttendanceData[]> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.teacherId) queryParams.teacherId = params.teacherId;
  if (params?.date) queryParams.date = params.date;
  if (params?.status) queryParams.status = params.status;
  if (params?.month !== undefined) queryParams.month = params.month;
  if (params?.year !== undefined) queryParams.year = params.year;

  const response = await api.get<TeacherAttendanceListResponse>(
    "/teacher-attendance",
    {
      params: queryParams,
    },
  );

  return response.data.data.attendance;
};

export const updateTeacherAttendanceApi = async (
  attendanceId: string,
  data: UpdateTeacherAttendancePayload,
): Promise<TeacherAttendanceData> => {
  const response = await api.put<TeacherAttendanceResponse>(
    `/teacher-attendance/${attendanceId}`,
    data,
  );

  return response.data.data.attendance;
};

export const getTeacherAttendanceMonthlySummaryApi = async (
  params: TeacherAttendanceMonthlyParams,
): Promise<TeacherAttendanceMonthlySummaryData> => {
  const queryParams: Record<string, string | number> = {
    month: params.month,
    year: params.year,
  };

  if (params.teacherId) {
    queryParams.teacherId = params.teacherId;
  }

  const response = await api.get<TeacherAttendanceMonthlySummaryResponse>(
    "/teacher-attendance/monthly-summary",
    {
      params: queryParams,
    },
  );

  return response.data.data;
};

export const getSingleTeacherAttendanceSummaryApi = async (
  teacherId: string,
  month: number,
  year: number,
): Promise<SingleTeacherAttendanceSummaryData> => {
  const response = await api.get<SingleTeacherAttendanceSummaryResponse>(
    `/teacher-attendance/teacher/${teacherId}/summary`,
    {
      params: {
        month,
        year,
      },
    },
  );

  return response.data.data;
};

export const getMyTeacherAttendanceApi = async (
  params?: MyTeacherAttendanceParams,
): Promise<SingleTeacherAttendanceSummaryData> => {
  const queryParams: Record<string, number> = {};

  if (params?.month !== undefined) queryParams.month = params.month;
  if (params?.year !== undefined) queryParams.year = params.year;

  const response = await api.get<SingleTeacherAttendanceSummaryResponse>(
    "/teacher-attendance/me",
    {
      params: queryParams,
    },
  );

  return response.data.data;
};

