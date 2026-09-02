// import axios from "axios";

// import type {
//   CreateHomeworkData,
//   Homework,
//   HomeworkDeleteResponse,
//   HomeworkDetailsResponse,
//   HomeworkFilters,
//   HomeworkListResponse,
//   HomeworkStats,
//   HomeworkStatsResponse,
//   HomeworkUpdateResponse,
//   UpdateHomeworkData,
// } from "./homework.types";

// import {
//   HomeworkStatus,
// } from "./homework.types";


// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api/v1";


// // ======================================================
// // AUTH HEADERS
// // ======================================================

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem(
//       "accessToken"
//     );

//   return {
//     Authorization:
//       `Bearer ${token}`,
//   };
// };


// // ======================================================
// // GET HOMEWORK LIST
// // ======================================================

// export const getHomeworksApi =
//   async (
//     filters?: HomeworkFilters
//   ) => {

//     const response =
//       await axios.get<HomeworkListResponse>(
//         `${API_URL}/homework`,
//         {
//           headers:
//             getAuthHeaders(),

//           params: filters,
//         }
//       );

//     return response.data.data;
//   };


// // ======================================================
// // GET HOMEWORK STATS
// // ======================================================

// export const getHomeworkStatsApi =
//   async () => {

//     const response =
//       await axios.get<HomeworkStatsResponse>(
//         `${API_URL}/homework/stats`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .stats as HomeworkStats;
//   };


// // ======================================================
// // GET HOMEWORK BY ID
// // ======================================================

// export const getHomeworkByIdApi =
//   async (
//     homeworkId: string
//   ) => {

//     const response =
//       await axios.get<HomeworkDetailsResponse>(
//         `${API_URL}/homework/${homeworkId}`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .homework as Homework;
//   };


// // ======================================================
// // CREATE HOMEWORK
// // ======================================================

// export const createHomeworkApi =
//   async (
//     data: CreateHomeworkData
//   ) => {

//     const response =
//       await axios.post(
//         `${API_URL}/homework`,
//         data,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .homework as Homework;
//   };


// // ======================================================
// // UPDATE HOMEWORK
// // ======================================================

// export const updateHomeworkApi =
//   async (
//     homeworkId: string,
//     data: UpdateHomeworkData
//   ) => {

//     const response =
//       await axios.put<HomeworkUpdateResponse>(
//         `${API_URL}/homework/${homeworkId}`,
//         data,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .homework as Homework;
//   };


// // ======================================================
// // CHANGE HOMEWORK STATUS
// // ======================================================

// export const changeHomeworkStatusApi =
//   async (
//     homeworkId: string,
//     status: HomeworkStatus
//   ) => {

//     const response =
//       await axios.patch<HomeworkUpdateResponse>(
//         `${API_URL}/homework/${homeworkId}/status`,
//         {
//           status,
//         },
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .homework as Homework;
//   };


// // ======================================================
// // DELETE HOMEWORK
// // ======================================================

// export const deleteHomeworkApi =
//   async (
//     homeworkId: string
//   ) => {

//     const response =
//       await axios.delete<HomeworkDeleteResponse>(
//         `${API_URL}/homework/${homeworkId}`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data;
//   };






// ======================================================
// HOMEWORK API
// ======================================================

import axios from "axios";

import type {
  CreateHomeworkData,
  Homework,
  HomeworkCreateResponse,
  HomeworkDeleteResponse,
  HomeworkDetailsResponse,
  HomeworkFilters,
  HomeworkListData,
  HomeworkListResponse,
  HomeworkStats,
  HomeworkStatsResponse,
  HomeworkUpdateResponse,
  UpdateHomeworkData,
} from "./homework.types";

import {
  HomeworkStatus,
} from "./homework.types";


// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";


// ======================================================
// AUTH HEADERS
// ======================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem(
      "accessToken"
    );

  return {
    Authorization:
      `Bearer ${token}`,
  };
};


// ======================================================
// ERROR MESSAGE
// ======================================================

export const getHomeworkApiErrorMessage = (
  error: unknown
): string => {

  if (
    axios.isAxiosError(
      error
    )
  ) {
    return (
      error.response?.data
        ?.message ||
      error.message ||
      "Something went wrong"
    );
  }


  if (
    error instanceof Error
  ) {
    return error.message;
  }


  return "Something went wrong";
};


// ======================================================
// GET HOMEWORK LIST
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework
//
// Teacher ke case me backend automatically
// logged-in teacherId se homework scope karega.
// ======================================================

export const getHomeworksApi =
  async (
    filters?:
      HomeworkFilters
  ): Promise<HomeworkListData> => {

    const params:
      Record<
        string,
        string | number
      > = {};


    if (
      filters?.sessionId
    ) {
      params.sessionId =
        filters.sessionId;
    }


    if (
      filters?.classId
    ) {
      params.classId =
        filters.classId;
    }


    if (
      filters?.sectionId
    ) {
      params.sectionId =
        filters.sectionId;
    }


    if (
      filters?.subjectId
    ) {
      params.subjectId =
        filters.subjectId;
    }


    if (
      filters?.teacherId
    ) {
      params.teacherId =
        filters.teacherId;
    }


    if (
      filters?.status
    ) {
      params.status =
        filters.status;
    }


    if (
      filters?.fromDate
    ) {
      params.fromDate =
        filters.fromDate;
    }


    if (
      filters?.toDate
    ) {
      params.toDate =
        filters.toDate;
    }


    if (
      filters?.search
    ) {
      params.search =
        filters.search;
    }


    if (
      filters?.page !==
      undefined
    ) {
      params.page =
        filters.page;
    }


    if (
      filters?.limit !==
      undefined
    ) {
      params.limit =
        filters.limit;
    }


    const response =
      await axios.get<
        HomeworkListResponse
      >(
        `${API_URL}/homework`,
        {
          headers:
            getAuthHeaders(),

          params,
        }
      );


    return response.data.data;
  };


// ======================================================
// GET HOMEWORK STATS
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework/stats
//
// Teacher gets only own homework stats.
// ======================================================

export const getHomeworkStatsApi =
  async (): Promise<HomeworkStats> => {

    const response =
      await axios.get<
        HomeworkStatsResponse
      >(
        `${API_URL}/homework/stats`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .stats;
  };


// ======================================================
// GET HOMEWORK BY ID
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework/:homeworkId
//
// Teacher cannot access another teacher's homework.
// Backend returns not found / unauthorized scope.
// ======================================================

export const getHomeworkByIdApi =
  async (
    homeworkId: string
  ): Promise<Homework> => {

    const response =
      await axios.get<
        HomeworkDetailsResponse
      >(
        `${API_URL}/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .homework;
  };


// ======================================================
// CREATE HOMEWORK
//
// SCHOOL_ADMIN + TEACHER
//
// POST /homework
//
// SCHOOL_ADMIN:
// teacherId payload me bhej sakta hai.
//
// TEACHER:
// teacherId payload me dene ki zarurat nahi.
// Backend JWT teacherId use karega.
// ======================================================

export const createHomeworkApi =
  async (
    data:
      CreateHomeworkData
  ): Promise<Homework> => {

    const response =
      await axios.post<
        HomeworkCreateResponse
      >(
        `${API_URL}/homework`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .homework;
  };


// ======================================================
// UPDATE HOMEWORK
//
// SCHOOL_ADMIN + TEACHER
//
// PUT /homework/:homeworkId
//
// Teacher only own homework.
// ======================================================

export const updateHomeworkApi =
  async (
    homeworkId: string,

    data:
      UpdateHomeworkData
  ): Promise<Homework> => {

    const response =
      await axios.put<
        HomeworkUpdateResponse
      >(
        `${API_URL}/homework/${homeworkId}`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .homework;
  };


// ======================================================
// CHANGE HOMEWORK STATUS
//
// SCHOOL_ADMIN + TEACHER
//
// PATCH /homework/:homeworkId/status
// ======================================================

export const changeHomeworkStatusApi =
  async (
    homeworkId: string,

    status:
      HomeworkStatus
  ): Promise<Homework> => {

    const response =
      await axios.patch<
        HomeworkUpdateResponse
      >(
        `${API_URL}/homework/${homeworkId}/status`,

        {
          status,
        },

        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .homework;
  };


// ======================================================
// DELETE HOMEWORK
//
// SCHOOL_ADMIN + TEACHER
//
// DELETE /homework/:homeworkId
//
// Teacher only own homework.
// ======================================================

export const deleteHomeworkApi =
  async (
    homeworkId: string
  ): Promise<HomeworkDeleteResponse> => {

    const response =
      await axios.delete<
        HomeworkDeleteResponse
      >(
        `${API_URL}/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data;
  };