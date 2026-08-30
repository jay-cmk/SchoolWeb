import axios from "axios";

import type {
  CreateHomeworkData,
  Homework,
  HomeworkDeleteResponse,
  HomeworkDetailsResponse,
  HomeworkFilters,
  HomeworkListResponse,
  HomeworkStats,
  HomeworkStatsResponse,
  HomeworkUpdateResponse,
  UpdateHomeworkData,
} from "./homework.types";

import {
  HomeworkStatus,
} from "./homework.types";


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
// GET HOMEWORK LIST
// ======================================================

export const getHomeworksApi =
  async (
    filters?: HomeworkFilters
  ) => {

    const response =
      await axios.get<HomeworkListResponse>(
        `${API_URL}/homework`,
        {
          headers:
            getAuthHeaders(),

          params: filters,
        }
      );

    return response.data.data;
  };


// ======================================================
// GET HOMEWORK STATS
// ======================================================

export const getHomeworkStatsApi =
  async () => {

    const response =
      await axios.get<HomeworkStatsResponse>(
        `${API_URL}/homework/stats`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .stats as HomeworkStats;
  };


// ======================================================
// GET HOMEWORK BY ID
// ======================================================

export const getHomeworkByIdApi =
  async (
    homeworkId: string
  ) => {

    const response =
      await axios.get<HomeworkDetailsResponse>(
        `${API_URL}/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .homework as Homework;
  };


// ======================================================
// CREATE HOMEWORK
// ======================================================

export const createHomeworkApi =
  async (
    data: CreateHomeworkData
  ) => {

    const response =
      await axios.post(
        `${API_URL}/homework`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .homework as Homework;
  };


// ======================================================
// UPDATE HOMEWORK
// ======================================================

export const updateHomeworkApi =
  async (
    homeworkId: string,
    data: UpdateHomeworkData
  ) => {

    const response =
      await axios.put<HomeworkUpdateResponse>(
        `${API_URL}/homework/${homeworkId}`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data.data
      .homework as Homework;
  };


// ======================================================
// CHANGE HOMEWORK STATUS
// ======================================================

export const changeHomeworkStatusApi =
  async (
    homeworkId: string,
    status: HomeworkStatus
  ) => {

    const response =
      await axios.patch<HomeworkUpdateResponse>(
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
      .homework as Homework;
  };


// ======================================================
// DELETE HOMEWORK
// ======================================================

export const deleteHomeworkApi =
  async (
    homeworkId: string
  ) => {

    const response =
      await axios.delete<HomeworkDeleteResponse>(
        `${API_URL}/homework/${homeworkId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data;
  };