import axios from "axios";

import type {
  Timetable,
  CreateTimetableData,
  UpdateTimetableData,
  TimetableFilters,
  CopyTimetableData,
  CopyTimetableResult,
  TimetableListResponse,
  TimetableSingleResponse,
  CopyTimetableResponse,
} from "./timetable.types";


// ============================================
// API URL
// ============================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";


// ============================================
// AUTH HEADER
// ============================================

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


// ============================================
// ERROR MESSAGE
// ============================================

export const getApiErrorMessage = (
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


// ============================================
// CREATE TIMETABLE PERIOD
//
// POST /timetable
// ============================================

export const createTimetableApi =
  async (
    data:
      CreateTimetableData
  ): Promise<Timetable> => {

    const response =
      await axios.post<
        TimetableSingleResponse
      >(
        `${API_URL}/timetable`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data
      .data.timetable;
  };


// ============================================
// GET TIMETABLE
//
// Weekly / Daily / Teacher / Subject
//
// GET /timetable
// ============================================

export const getTimetableApi =
  async (
    filters:
      TimetableFilters = {}
  ): Promise<Timetable[]> => {

    const params:
      Record<
        string,
        string | boolean
      > = {};


    if (
      filters.sessionId
    ) {
      params.sessionId =
        filters.sessionId;
    }


    if (
      filters.classId
    ) {
      params.classId =
        filters.classId;
    }


    if (
      filters.sectionId
    ) {
      params.sectionId =
        filters.sectionId;
    }


    if (
      filters.teacherId
    ) {
      params.teacherId =
        filters.teacherId;
    }


    if (
      filters.subjectId
    ) {
      params.subjectId =
        filters.subjectId;
    }


    if (
      filters.day
    ) {
      params.day =
        filters.day;
    }


    if (
      filters.periodType
    ) {
      params.periodType =
        filters.periodType;
    }


    if (
      filters.isActive !==
      undefined
    ) {
      params.isActive =
        filters.isActive;
    }


    const response =
      await axios.get<
        TimetableListResponse
      >(
        `${API_URL}/timetable`,
        {
          headers:
            getAuthHeaders(),

          params,
        }
      );


    return response.data
      .data.timetable;
  };


// ============================================
// GET SINGLE TIMETABLE PERIOD
//
// GET /timetable/:id
// ============================================

export const getTimetableByIdApi =
  async (
    timetableId: string
  ): Promise<Timetable> => {

    const response =
      await axios.get<
        TimetableSingleResponse
      >(
        `${API_URL}/timetable/${timetableId}`,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data
      .data.timetable;
  };


// ============================================
// UPDATE TIMETABLE
//
// PUT /timetable/:id
// ============================================

export const updateTimetableApi =
  async (
    timetableId: string,
    data:
      UpdateTimetableData
  ): Promise<Timetable> => {

    const response =
      await axios.put<
        TimetableSingleResponse
      >(
        `${API_URL}/timetable/${timetableId}`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data
      .data.timetable;
  };


// ============================================
// DELETE TIMETABLE
//
// DELETE /timetable/:id
// ============================================

export const deleteTimetableApi =
  async (
    timetableId: string
  ): Promise<string> => {

    await axios.delete(
      `${API_URL}/timetable/${timetableId}`,
      {
        headers:
          getAuthHeaders(),
      }
    );


    return timetableId;
  };


// ============================================
// COPY TIMETABLE
//
// POST /timetable/copy
// ============================================

export const copyTimetableApi =
  async (
    data:
      CopyTimetableData
  ): Promise<
    CopyTimetableResult
  > => {

    const response =
      await axios.post<
        CopyTimetableResponse
      >(
        `${API_URL}/timetable/copy`,
        data,
        {
          headers:
            getAuthHeaders(),
        }
      );


    return response.data.data;
  };