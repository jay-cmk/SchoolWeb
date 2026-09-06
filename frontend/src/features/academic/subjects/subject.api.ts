// ============================================
// SUBJECT API
// ============================================

import api from "../../../api/axios";

import type {
  SubjectData,
  CreateSubjectPayload,
  UpdateSubjectPayload,
  GetSubjectsParams,
  SubjectResponse,
  SubjectsResponse,
} from "./subject.types";


// CREATE
export const createSubjectApi =
  async (
    data: CreateSubjectPayload
  ): Promise<SubjectData> => {
    const response =
      await api.post<SubjectResponse>(
        "/academic/subjects",
        data
      );

    return response.data.data.subject;
  };


// GET ALL
export const getSubjectsApi =
  async (
    params?: GetSubjectsParams
  ): Promise<SubjectData[]> => {
    const response =
      await api.get<SubjectsResponse>(
        "/academic/subjects",
        {
          params,
        }
      );

    return response.data.data.subjects;
  };


// GET BY ID
export const getSubjectByIdApi =
  async (
    subjectId: string
  ): Promise<SubjectData> => {
    const response =
      await api.get<SubjectResponse>(
        `/academic/subjects/${subjectId}`
      );

    return response.data.data.subject;
  };


// UPDATE
export const updateSubjectApi =
  async (
    subjectId: string,
    data: UpdateSubjectPayload
  ): Promise<SubjectData> => {
    const response =
      await api.put<SubjectResponse>(
        `/academic/subjects/${subjectId}`,
        data
      );

    return response.data.data.subject;
  };


// STATUS
export const updateSubjectStatusApi =
  async (
    subjectId: string,
    isActive: boolean
  ): Promise<SubjectData> => {
    const response =
      await api.patch<SubjectResponse>(
        `/academic/subjects/${subjectId}/status`,
        {
          isActive,
        }
      );

    return response.data.data.subject;
  };