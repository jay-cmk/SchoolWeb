// // ============================================
// // TEACHER API
// // ============================================

// import api from "../../api/axios";

// import type {
//   TeacherData,
//   CreateTeacherPayload,
//   UpdateTeacherPayload,
//   GetTeachersParams,
//   TeacherResponse,
//   TeachersResponse,
// } from "./teacher.types";


// // ============================================
// // CREATE TEACHER
// // POST /api/v1/teachers
// // ============================================

// export const createTeacherApi =
//   async (
//     data: CreateTeacherPayload
//   ): Promise<TeacherData> => {
//     const response =
//       await api.post<TeacherResponse>(
//         "/teachers",
//         data
//       );

//     return response.data.data.teacher;
//   };


// // ============================================
// // GET ALL TEACHERS
// // GET /api/v1/teachers
// // ============================================

// export const getTeachersApi =
//   async (
//     params?: GetTeachersParams
//   ): Promise<TeacherData[]> => {
//     const response =
//       await api.get<TeachersResponse>(
//         "/teachers",
//         {
//           params,
//         }
//       );

//     return response.data.data.teachers;
//   };


// // ============================================
// // GET TEACHER BY ID
// // GET /api/v1/teachers/:teacherId
// // ============================================

// export const getTeacherByIdApi =
//   async (
//     teacherId: string
//   ): Promise<TeacherData> => {
//     const response =
//       await api.get<TeacherResponse>(
//         `/teachers/${teacherId}`
//       );

//     return response.data.data.teacher;
//   };


// // ============================================
// // UPDATE TEACHER
// // PUT /api/v1/teachers/:teacherId
// // ============================================

// export const updateTeacherApi =
//   async (
//     teacherId: string,
//     data: UpdateTeacherPayload
//   ): Promise<TeacherData> => {
//     const response =
//       await api.put<TeacherResponse>(
//         `/teachers/${teacherId}`,
//         data
//       );

//     return response.data.data.teacher;
//   };


// // ============================================
// // UPDATE TEACHER STATUS
// // PATCH /api/v1/teachers/:teacherId/status
// // ============================================

// export const updateTeacherStatusApi =
//   async (
//     teacherId: string,
//     isActive: boolean
//   ): Promise<TeacherData> => {
//     const response =
//       await api.patch<TeacherResponse>(
//         `/teachers/${teacherId}/status`,
//         {
//           isActive,
//         }
//       );

//     return response.data.data.teacher;
//   };






// ============================================
// TEACHER API
// ============================================

import api from "../../api/axios";

import type {
  TeacherData,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  GetTeachersParams,
  TeacherResponse,
  TeachersResponse,
} from "./teacher.types";


// ============================================
// CREATE TEACHER
// POST /api/v1/teachers
//
// SCHOOL_ADMIN
// ============================================

export const createTeacherApi =
  async (
    data: CreateTeacherPayload
  ): Promise<TeacherData> => {

    const response =
      await api.post<TeacherResponse>(
        "/teachers",
        data
      );

    return response.data.data.teacher;
  };


// ============================================
// GET ALL TEACHERS
// GET /api/v1/teachers
//
// SCHOOL_ADMIN
// ============================================

export const getTeachersApi =
  async (
    params?: GetTeachersParams
  ): Promise<TeacherData[]> => {

    const response =
      await api.get<TeachersResponse>(
        "/teachers",
        {
          params,
        }
      );

    return response.data.data.teachers;
  };


// ============================================
// GET MY TEACHER PROFILE
// GET /api/v1/teachers/me
//
// TEACHER
//
// teacherId request me bhejne ki zarurat nahi.
// Backend JWT se teacherId leta hai.
// ============================================

export const getMyTeacherProfileApi =
  async (): Promise<TeacherData> => {

    const response =
      await api.get<TeacherResponse>(
        "/teachers/me"
      );

    return response.data.data.teacher;
  };


// ============================================
// GET TEACHER BY ID
// GET /api/v1/teachers/:teacherId
//
// SCHOOL_ADMIN
// ============================================

export const getTeacherByIdApi =
  async (
    teacherId: string
  ): Promise<TeacherData> => {

    const response =
      await api.get<TeacherResponse>(
        `/teachers/${teacherId}`
      );

    return response.data.data.teacher;
  };


// ============================================
// UPDATE TEACHER
// PUT /api/v1/teachers/:teacherId
//
// SCHOOL_ADMIN
// ============================================

export const updateTeacherApi =
  async (
    teacherId: string,
    data: UpdateTeacherPayload
  ): Promise<TeacherData> => {

    const response =
      await api.put<TeacherResponse>(
        `/teachers/${teacherId}`,
        data
      );

    return response.data.data.teacher;
  };


// ============================================
// UPDATE TEACHER STATUS
// PATCH /api/v1/teachers/:teacherId/status
//
// SCHOOL_ADMIN
// ============================================

export const updateTeacherStatusApi =
  async (
    teacherId: string,
    isActive: boolean
  ): Promise<TeacherData> => {

    const response =
      await api.patch<TeacherResponse>(
        `/teachers/${teacherId}/status`,
        {
          isActive,
        }
      );

    return response.data.data.teacher;
  };