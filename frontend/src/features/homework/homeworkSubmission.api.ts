import axios from "axios";

import type {
  CreateHomeworkSubmissionData,
  HomeworkSubmission,
  HomeworkSubmissionDeleteResponse,
  HomeworkSubmissionDetailsResponse,
  HomeworkSubmissionFilters,
  HomeworkSubmissionListResponse,
  HomeworkSubmissionStats,
  HomeworkSubmissionStatsResponse,
  HomeworkSubmissionUpdateResponse,
  ReviewHomeworkSubmissionData,
  UpdateHomeworkSubmissionData,
} from "./homeworkSubmission.types";


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
// CREATE HOMEWORK SUBMISSION
// ======================================================

export const createHomeworkSubmissionApi =
  async (
    data: CreateHomeworkSubmissionData
  ) => {

    const response =
      await axios.post(
        `${API_URL}/homework-submissions`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .submission as HomeworkSubmission;
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

export const getHomeworkSubmissionsApi =
  async (
    homeworkId: string,
    filters?: HomeworkSubmissionFilters
  ) => {

    const response =
      await axios.get<HomeworkSubmissionListResponse>(
        `${API_URL}/homework-submissions/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),

          params: filters,
        }
      );

    return response.data.data;
  };


// ======================================================
// GET HOMEWORK SUBMISSION STATS
// ======================================================

export const getHomeworkSubmissionStatsApi =
  async (
    homeworkId: string
  ) => {

    const response =
      await axios.get<HomeworkSubmissionStatsResponse>(
        `${API_URL}/homework-submissions/homework/${homeworkId}/stats`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .stats as HomeworkSubmissionStats;
  };


// ======================================================
// GET STUDENT HOMEWORK SUBMISSION
// ======================================================

export const getStudentHomeworkSubmissionApi =
  async (
    homeworkId: string,
    studentId: string
  ) => {

    const response =
      await axios.get<HomeworkSubmissionDetailsResponse>(
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
// ======================================================

export const getHomeworkSubmissionByIdApi =
  async (
    submissionId: string
  ) => {

    const response =
      await axios.get<HomeworkSubmissionDetailsResponse>(
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
// ======================================================

export const updateHomeworkSubmissionApi =
  async (
    submissionId: string,
    data: UpdateHomeworkSubmissionData
  ) => {

    const response =
      await axios.put<HomeworkSubmissionUpdateResponse>(
        `${API_URL}/homework-submissions/${submissionId}`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .submission as HomeworkSubmission;
  };


// ======================================================
// REVIEW HOMEWORK SUBMISSION
// ======================================================

export const reviewHomeworkSubmissionApi =
  async (
    submissionId: string,
    data: ReviewHomeworkSubmissionData
  ) => {

    const response =
      await axios.patch<HomeworkSubmissionUpdateResponse>(
        `${API_URL}/homework-submissions/${submissionId}/review`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .submission as HomeworkSubmission;
  };


// ======================================================
// DELETE HOMEWORK SUBMISSION
// ======================================================

export const deleteHomeworkSubmissionApi =
  async (
    submissionId: string
  ) => {

    const response =
      await axios.delete<HomeworkSubmissionDeleteResponse>(
        `${API_URL}/homework-submissions/${submissionId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data;
  };