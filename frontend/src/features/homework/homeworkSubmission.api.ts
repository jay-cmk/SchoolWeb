// import axios from "axios";

// import type {
//   CreateHomeworkSubmissionData,
//   HomeworkSubmission,
//   HomeworkSubmissionDeleteResponse,
//   HomeworkSubmissionDetailsResponse,
//   HomeworkSubmissionFilters,
//   HomeworkSubmissionListResponse,
//   HomeworkSubmissionStats,
//   HomeworkSubmissionStatsResponse,
//   HomeworkSubmissionUpdateResponse,
//   ReviewHomeworkSubmissionData,
//   UpdateHomeworkSubmissionData,
// } from "./homeworkSubmission.types";


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
// // CREATE HOMEWORK SUBMISSION
// // ======================================================

// export const createHomeworkSubmissionApi =
//   async (
//     data: CreateHomeworkSubmissionData
//   ) => {

//     const response =
//       await axios.post(
//         `${API_URL}/homework-submissions`,
//         data,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .submission as HomeworkSubmission;
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSIONS
// // ======================================================

// export const getHomeworkSubmissionsApi =
//   async (
//     homeworkId: string,
//     filters?: HomeworkSubmissionFilters
//   ) => {

//     const response =
//       await axios.get<HomeworkSubmissionListResponse>(
//         `${API_URL}/homework-submissions/homework/${homeworkId}`,
//         {
//           headers:
//             getAuthHeaders(),

//           params: filters,
//         }
//       );

//     return response.data.data;
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION STATS
// // ======================================================

// export const getHomeworkSubmissionStatsApi =
//   async (
//     homeworkId: string
//   ) => {

//     const response =
//       await axios.get<HomeworkSubmissionStatsResponse>(
//         `${API_URL}/homework-submissions/homework/${homeworkId}/stats`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .stats as HomeworkSubmissionStats;
//   };


// // ======================================================
// // GET STUDENT HOMEWORK SUBMISSION
// // ======================================================

// export const getStudentHomeworkSubmissionApi =
//   async (
//     homeworkId: string,
//     studentId: string
//   ) => {

//     const response =
//       await axios.get<HomeworkSubmissionDetailsResponse>(
//         `${API_URL}/homework-submissions/homework/${homeworkId}/student/${studentId}`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .submission;
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION BY ID
// // ======================================================

// export const getHomeworkSubmissionByIdApi =
//   async (
//     submissionId: string
//   ) => {

//     const response =
//       await axios.get<HomeworkSubmissionDetailsResponse>(
//         `${API_URL}/homework-submissions/${submissionId}`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .submission;
//   };


// // ======================================================
// // UPDATE HOMEWORK SUBMISSION
// // ======================================================

// export const updateHomeworkSubmissionApi =
//   async (
//     submissionId: string,
//     data: UpdateHomeworkSubmissionData
//   ) => {

//     const response =
//       await axios.put<HomeworkSubmissionUpdateResponse>(
//         `${API_URL}/homework-submissions/${submissionId}`,
//         data,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .submission as HomeworkSubmission;
//   };


// // ======================================================
// // REVIEW HOMEWORK SUBMISSION
// // ======================================================

// export const reviewHomeworkSubmissionApi =
//   async (
//     submissionId: string,
//     data: ReviewHomeworkSubmissionData
//   ) => {

//     const response =
//       await axios.patch<HomeworkSubmissionUpdateResponse>(
//         `${API_URL}/homework-submissions/${submissionId}/review`,
//         data,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data.data
//       .submission as HomeworkSubmission;
//   };


// // ======================================================
// // DELETE HOMEWORK SUBMISSION
// // ======================================================

// export const deleteHomeworkSubmissionApi =
//   async (
//     submissionId: string
//   ) => {

//     const response =
//       await axios.delete<HomeworkSubmissionDeleteResponse>(
//         `${API_URL}/homework-submissions/${submissionId}`,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data;
//   };




// ======================================================
// HOMEWORK SUBMISSION API
// ======================================================

import axios from "axios";

import type {
  CreateHomeworkSubmissionData,
  HomeworkSubmission,
  HomeworkSubmissionCreateResponse,
  HomeworkSubmissionDeleteResponse,
  HomeworkSubmissionDetailsResponse,
  HomeworkSubmissionFilters,
  HomeworkSubmissionListData,
  HomeworkSubmissionListResponse,
  HomeworkSubmissionStats,
  HomeworkSubmissionStatsResponse,
  HomeworkSubmissionUpdateResponse,
  ReviewHomeworkSubmissionData,
  UpdateHomeworkSubmissionData,
} from "./homeworkSubmission.types";


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

export const getHomeworkSubmissionApiErrorMessage = (
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
// CREATE HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN ONLY
//
// POST /homework-submissions
//
// Teacher ko ye endpoint use nahi karna.
// ======================================================

export const createHomeworkSubmissionApi =
  async (
    data:
      CreateHomeworkSubmissionData
  ): Promise<HomeworkSubmission> => {

    const response =
      await axios.post<
        HomeworkSubmissionCreateResponse
      >(
        `${API_URL}/homework-submissions`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .submission;
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework-submissions/homework/:homeworkId
//
// Teacher ke case me backend homework ko logged-in
// teacherId se validate karega.
// ======================================================

export const getHomeworkSubmissionsApi =
  async (
    homeworkId: string,

    filters?:
      HomeworkSubmissionFilters
  ): Promise<HomeworkSubmissionListData> => {

    const params:
      Record<
        string,
        string | number
      > = {};


    if (
      filters?.studentId
    ) {
      params.studentId =
        filters.studentId;
    }


    if (
      filters?.submissionStatus
    ) {
      params.submissionStatus =
        filters.submissionStatus;
    }


    if (
      filters?.reviewStatus
    ) {
      params.reviewStatus =
        filters.reviewStatus;
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
        HomeworkSubmissionListResponse
      >(
        `${API_URL}/homework-submissions/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),

          params,
        }
      );


    return response.data.data;
  };


// ======================================================
// GET HOMEWORK SUBMISSION STATS
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework-submissions/homework/:homeworkId/stats
// ======================================================

export const getHomeworkSubmissionStatsApi =
  async (
    homeworkId: string
  ): Promise<HomeworkSubmissionStats> => {

    const response =
      await axios.get<
        HomeworkSubmissionStatsResponse
      >(
        `${API_URL}/homework-submissions/homework/${homeworkId}/stats`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .stats;
  };


// ======================================================
// GET STUDENT HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN + TEACHER
//
// GET
// /homework-submissions/homework/:homeworkId/student/:studentId
// ======================================================

export const getStudentHomeworkSubmissionApi =
  async (
    homeworkId: string,

    studentId: string
  ): Promise<HomeworkSubmission | null> => {

    const response =
      await axios.get<
        HomeworkSubmissionDetailsResponse
      >(
        `${API_URL}/homework-submissions/homework/${homeworkId}/student/${studentId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .submission;
  };


// ======================================================
// GET HOMEWORK SUBMISSION BY ID
//
// SCHOOL_ADMIN + TEACHER
//
// GET /homework-submissions/:submissionId
// ======================================================

export const getHomeworkSubmissionByIdApi =
  async (
    submissionId: string
  ): Promise<HomeworkSubmission | null> => {

    const response =
      await axios.get<
        HomeworkSubmissionDetailsResponse
      >(
        `${API_URL}/homework-submissions/${submissionId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .submission;
  };


// ======================================================
// UPDATE HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN ONLY
//
// PUT /homework-submissions/:submissionId
//
// Teacher ko generic update permission nahi.
// ======================================================

export const updateHomeworkSubmissionApi =
  async (
    submissionId: string,

    data:
      UpdateHomeworkSubmissionData
  ): Promise<HomeworkSubmission> => {

    const response =
      await axios.put<
        HomeworkSubmissionUpdateResponse
      >(
        `${API_URL}/homework-submissions/${submissionId}`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .submission;
  };


// ======================================================
// REVIEW HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN + TEACHER
//
// PATCH
// /homework-submissions/:submissionId/review
//
// reviewedBy backend logged-in User._id set karega.
// Teacher._id frontend se mat bhejna.
// ======================================================

export const reviewHomeworkSubmissionApi =
  async (
    submissionId: string,

    data:
      ReviewHomeworkSubmissionData
  ): Promise<HomeworkSubmission> => {

    const response =
      await axios.patch<
        HomeworkSubmissionUpdateResponse
      >(
        `${API_URL}/homework-submissions/${submissionId}/review`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data
      .submission;
  };


// ======================================================
// DELETE HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN ONLY
//
// DELETE /homework-submissions/:submissionId
//
// Teacher ko delete permission nahi.
// ======================================================

export const deleteHomeworkSubmissionApi =
  async (
    submissionId: string
  ): Promise<HomeworkSubmissionDeleteResponse> => {

    const response =
      await axios.delete<
        HomeworkSubmissionDeleteResponse
      >(
        `${API_URL}/homework-submissions/${submissionId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data;
  };