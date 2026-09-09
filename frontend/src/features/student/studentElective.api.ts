import api from "../../api/axios";

import type {
  AssignStudentElectivePayload,
  BulkAssignElectiveResult,
  BulkAssignStudentElectivePayload,
  GetStudentElectivesParams,
  StudentElectiveEnrollment,
  StudentElectiveResponse,
  StudentElectivesResponse,
  UpdateStudentElectivePayload,
} from "./studentElective.types";


/* =====================================================
   ASSIGN SINGLE ELECTIVE SUBJECT

   SCHOOL_ADMIN

   POST /students/elective-subjects
===================================================== */

export const assignStudentElectiveApi =
  async (
    data: AssignStudentElectivePayload
  ): Promise<StudentElectiveEnrollment> => {
    const response =
      await api.post<StudentElectiveResponse>(
        "/students/elective-subjects",
        data
      );

    return response.data.data.enrollment;
  };


/* =====================================================
   BULK ASSIGN ELECTIVE SUBJECT

   SCHOOL_ADMIN

   POST /students/elective-subjects/bulk
===================================================== */

export const bulkAssignStudentElectiveApi =
  async (
    data: BulkAssignStudentElectivePayload
  ): Promise<BulkAssignElectiveResult> => {
    const response =
      await api.post<{
        success: boolean;
        message?: string;
        data: BulkAssignElectiveResult;
      }>(
        "/students/elective-subjects/bulk",
        data
      );

    return response.data.data;
  };


/* =====================================================
   GET STUDENT ELECTIVE ENROLLMENTS

   SCHOOL_ADMIN

   GET /students/elective-subjects
===================================================== */

export const getStudentElectivesApi =
  async (
    filters?: GetStudentElectivesParams
  ): Promise<StudentElectiveEnrollment[]> => {
    const params:
      Record<string, string> = {};

    if (filters?.sessionId) {
      params.sessionId =
        filters.sessionId;
    }

    if (filters?.classId) {
      params.classId =
        filters.classId;
    }

    if (filters?.sectionId) {
      params.sectionId =
        filters.sectionId;
    }

    if (filters?.studentId) {
      params.studentId =
        filters.studentId;
    }

    if (filters?.subjectId) {
      params.subjectId =
        filters.subjectId;
    }

    if (
      filters?.subjectAssignmentId
    ) {
      params.subjectAssignmentId =
        filters.subjectAssignmentId;
    }

    if (filters?.stream) {
      params.stream =
        filters.stream;
    }

    if (filters?.status) {
      params.status =
        filters.status;
    }

    const response =
      await api.get<StudentElectivesResponse>(
        "/students/elective-subjects",
        {
          params,
        }
      );

    const enrollments =
      response.data?.data?.enrollments;

    if (!Array.isArray(enrollments)) {
      console.error(
        "Elective enrollments response is invalid:",
        response.data
      );

      return [];
    }

    return enrollments;
  };


/* =====================================================
   UPDATE ELECTIVE STATUS / REMARKS

   SCHOOL_ADMIN

   PATCH /students/elective-subjects/:enrollmentId
===================================================== */

export const updateStudentElectiveApi =
  async (
    enrollmentId: string,
    data: UpdateStudentElectivePayload
  ): Promise<StudentElectiveEnrollment> => {
    const response =
      await api.patch<StudentElectiveResponse>(
        `/students/elective-subjects/${enrollmentId}`,
        data
      );

    return response.data.data.enrollment;
  };