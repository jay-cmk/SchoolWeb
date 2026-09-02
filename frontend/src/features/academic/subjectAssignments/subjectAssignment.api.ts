// // ============================================
// // SUBJECT ASSIGNMENT API
// // ============================================

// import api from "../../../api/axios";

// import type {
//   SubjectAssignmentData,
//   CreateSubjectAssignmentPayload,
//   UpdateSubjectAssignmentPayload,
//   GetSubjectAssignmentsParams,
//   SubjectAssignmentResponse,
//   SubjectAssignmentsResponse,
// } from "./subjectAssignment.types";


// // ============================================
// // CREATE
// // POST /academic/subject-assignments
// // ============================================

// export const createSubjectAssignmentApi =
//   async (
//     data:
//       CreateSubjectAssignmentPayload
//   ): Promise<SubjectAssignmentData> => {
//     const response =
//       await api.post<SubjectAssignmentResponse>(
//         "/academic/subject-assignments",
//         data
//       );

//     return response.data.data.assignment;
//   };


// // ============================================
// // GET ALL
// // GET /academic/subject-assignments
// // ============================================

// export const getSubjectAssignmentsApi =
//   async (
//     params?:
//       GetSubjectAssignmentsParams
//   ): Promise<SubjectAssignmentData[]> => {
//     const response =
//       await api.get<SubjectAssignmentsResponse>(
//         "/academic/subject-assignments",
//         {
//           params,
//         }
//       );

//     return response.data.data.assignments;
//   };


// // ============================================
// // GET BY ID
// // GET /academic/subject-assignments/:assignmentId
// // ============================================

// export const getSubjectAssignmentByIdApi =
//   async (
//     assignmentId: string
//   ): Promise<SubjectAssignmentData> => {
//     const response =
//       await api.get<SubjectAssignmentResponse>(
//         `/academic/subject-assignments/${assignmentId}`
//       );

//     return response.data.data.assignment;
//   };


// // ============================================
// // UPDATE
// // PUT /academic/subject-assignments/:assignmentId
// // ============================================

// export const updateSubjectAssignmentApi =
//   async (
//     assignmentId: string,

//     data:
//       UpdateSubjectAssignmentPayload
//   ): Promise<SubjectAssignmentData> => {
//     const response =
//       await api.put<SubjectAssignmentResponse>(
//         `/academic/subject-assignments/${assignmentId}`,
//         data
//       );

//     return response.data.data.assignment;
//   };


// // ============================================
// // UPDATE STATUS
// // PATCH /academic/subject-assignments/:assignmentId/status
// // ============================================

// export const updateSubjectAssignmentStatusApi =
//   async (
//     assignmentId: string,

//     isActive: boolean
//   ): Promise<SubjectAssignmentData> => {
//     const response =
//       await api.patch<SubjectAssignmentResponse>(
//         `/academic/subject-assignments/${assignmentId}/status`,

//         {
//           isActive,
//         }
//       );

//     return response.data.data.assignment;
//   };





// ============================================
// SUBJECT ASSIGNMENT API
// ============================================

import api from "../../../api/axios";

import type {
  SubjectAssignmentData,
  CreateSubjectAssignmentPayload,
  UpdateSubjectAssignmentPayload,
  GetSubjectAssignmentsParams,
  SubjectAssignmentResponse,
  SubjectAssignmentsResponse,
  MySubjectAssignmentsResponse,
  MySubjectAssignmentsData,
} from "./subjectAssignment.types";


// ============================================
// CREATE
// POST /academic/subject-assignments
//
// SCHOOL_ADMIN
// ============================================

export const createSubjectAssignmentApi =
  async (
    data:
      CreateSubjectAssignmentPayload
  ): Promise<SubjectAssignmentData> => {

    const response =
      await api.post<SubjectAssignmentResponse>(
        "/academic/subject-assignments",
        data
      );

    return response.data.data.assignment;
  };


// ============================================
// GET ALL
// GET /academic/subject-assignments
//
// SCHOOL_ADMIN
// ============================================

export const getSubjectAssignmentsApi =
  async (
    params?:
      GetSubjectAssignmentsParams
  ): Promise<SubjectAssignmentData[]> => {

    const response =
      await api.get<SubjectAssignmentsResponse>(
        "/academic/subject-assignments",
        {
          params,
        }
      );

    return response.data.data.assignments;
  };


// ============================================
// GET MY SUBJECT ASSIGNMENTS
//
// TEACHER
// GET /academic/subject-assignments/teacher/me
//
// teacherId frontend se nahi bhejna.
// Backend JWT se teacherId leta hai.
// ============================================

export const getMySubjectAssignmentsApi =
  async (): Promise<MySubjectAssignmentsData> => {

    const response =
      await api.get<MySubjectAssignmentsResponse>(
        "/academic/subject-assignments/teacher/me"
      );

    return {
      teacher:
        response.data.data.teacher,

      assignments:
        response.data.data.assignments,
    };
  };


// ============================================
// GET BY ID
// GET /academic/subject-assignments/:assignmentId
//
// SCHOOL_ADMIN
// ============================================

export const getSubjectAssignmentByIdApi =
  async (
    assignmentId: string
  ): Promise<SubjectAssignmentData> => {

    const response =
      await api.get<SubjectAssignmentResponse>(
        `/academic/subject-assignments/${assignmentId}`
      );

    return response.data.data.assignment;
  };


// ============================================
// UPDATE
// PUT /academic/subject-assignments/:assignmentId
//
// SCHOOL_ADMIN
// ============================================

export const updateSubjectAssignmentApi =
  async (
    assignmentId: string,

    data:
      UpdateSubjectAssignmentPayload
  ): Promise<SubjectAssignmentData> => {

    const response =
      await api.put<SubjectAssignmentResponse>(
        `/academic/subject-assignments/${assignmentId}`,
        data
      );

    return response.data.data.assignment;
  };


// ============================================
// UPDATE STATUS
// PATCH /academic/subject-assignments/:assignmentId/status
//
// SCHOOL_ADMIN
// ============================================

export const updateSubjectAssignmentStatusApi =
  async (
    assignmentId: string,

    isActive: boolean
  ): Promise<SubjectAssignmentData> => {

    const response =
      await api.patch<SubjectAssignmentResponse>(
        `/academic/subject-assignments/${assignmentId}/status`,

        {
          isActive,
        }
      );

    return response.data.data.assignment;
  };