
// ============================================
// ATTENDANCE API
// ============================================

import api from "../../api/axios";

import type {
  AttendanceData,
  BulkAttendancePayload,
  UpdateAttendancePayload,
  GetAttendanceParams,
  MonthlyAttendanceParams,
  StudentAttendanceSummaryParams,
  MonthlyAttendanceSummaryData,
  StudentAttendanceSummaryData,
  BulkAttendanceResponse,
  AttendanceListResponse,
  AttendanceResponse,
  MonthlyAttendanceSummaryResponse,
  StudentAttendanceSummaryResponse,
} from "./attendance.types";


// ============================================
// BULK MARK ATTENDANCE
//
// SCHOOL_ADMIN + TEACHER
//
// POST /attendance/bulk
//
// Teacher ke case me backend JWT teacherId
// se SubjectAssignment permission check karega.
// ============================================

export const markBulkAttendanceApi =
  async (
    data:
      BulkAttendancePayload
  ): Promise<AttendanceData[]> => {

    const response =
      await api.post<BulkAttendanceResponse>(
        "/attendance/bulk",
        data
      );

    return response.data.data.attendance;
  };


// ============================================
// GET ATTENDANCE
//
// SCHOOL_ADMIN + TEACHER
//
// GET /attendance
//
// TEACHER:
// sessionId + classId + sectionId required
// backend permission validation ke liye.
// ============================================

export const getAttendanceApi =
  async (
    params?:
      GetAttendanceParams
  ): Promise<AttendanceData[]> => {

    const queryParams:
      Record<
        string,
        string
      > = {};


    if (
      params?.sessionId
    ) {
      queryParams.sessionId =
        params.sessionId;
    }


    if (
      params?.classId
    ) {
      queryParams.classId =
        params.classId;
    }


    if (
      params?.sectionId
    ) {
      queryParams.sectionId =
        params.sectionId;
    }


    if (
      params?.studentId
    ) {
      queryParams.studentId =
        params.studentId;
    }


    if (
      params?.date
    ) {
      queryParams.date =
        params.date;
    }


    if (
      params?.status
    ) {
      queryParams.status =
        params.status;
    }


    const response =
      await api.get<AttendanceListResponse>(
        "/attendance",
        {
          params:
            queryParams,
        }
      );

    return response.data.data.attendance;
  };


// ============================================
// UPDATE SINGLE ATTENDANCE
//
// SCHOOL_ADMIN + TEACHER
//
// PUT /attendance/:attendanceId
//
// Teacher can update only attendance belonging
// to assigned class/section.
// Backend handles permission validation.
// ============================================

export const updateAttendanceApi =
  async (
    attendanceId: string,

    data:
      UpdateAttendancePayload
  ): Promise<AttendanceData> => {

    const response =
      await api.put<AttendanceResponse>(
        `/attendance/${attendanceId}`,
        data
      );

    return response.data.data.attendance;
  };


// ============================================
// MONTHLY SUMMARY
//
// SCHOOL_ADMIN + TEACHER
//
// GET /attendance/monthly-summary
// ============================================

export const getMonthlyAttendanceSummaryApi =
  async (
    params:
      MonthlyAttendanceParams
  ): Promise<MonthlyAttendanceSummaryData> => {

    const queryParams = {
      sessionId:
        params.sessionId,

      classId:
        params.classId,

      sectionId:
        params.sectionId,

      month:
        params.month,

      year:
        params.year,
    };


    const response =
      await api.get<MonthlyAttendanceSummaryResponse>(
        "/attendance/monthly-summary",
        {
          params:
            queryParams,
        }
      );

    return response.data.data;
  };


// ============================================
// STUDENT ATTENDANCE SUMMARY
//
// SCHOOL_ADMIN + TEACHER
//
// GET /attendance/student/:studentId/summary
//
// Teacher permission backend me assigned
// class/section ke against validate hogi.
// ============================================

export const getStudentAttendanceSummaryApi =
  async (
    params:
      StudentAttendanceSummaryParams
  ): Promise<StudentAttendanceSummaryData> => {

    const {
      studentId,
      sessionId,
      month,
      year,
    } = params;


    // exactOptionalPropertyTypes safe
    const queryParams: {
      sessionId?: string;

      month?: number;

      year?: number;
    } = {};


    if (
      sessionId
    ) {
      queryParams.sessionId =
        sessionId;
    }


    if (
      month !== undefined
    ) {
      queryParams.month =
        month;
    }


    if (
      year !== undefined
    ) {
      queryParams.year =
        year;
    }


    const response =
      await api.get<StudentAttendanceSummaryResponse>(
        `/attendance/student/${studentId}/summary`,
        {
          params:
            queryParams,
        }
      );


    return response.data.data;
  };