// ============================================
// CLASS API (class.api.ts)
// ============================================
import type {
  ClassData,
  CreateClassPayload,
  UpdateClassPayload,
  ClassResponse,
  ClassesResponse,
} from "./class.types";

import api from "../../../api/axios";

// ✅ API 1: POST /api/v1/academic/classes - Create Class
export const createClassApi = async (data: any) => {
  console.log(
    "TOKEN:",
    localStorage.getItem(
      "accessToken"
    )
  );

  console.log(
    "CLASS PAYLOAD:",
    data
  );

  const response = await api.post("/academic/classes", data);
  return response.data.data.class;
};

// ✅ API 2: GET /api/v1/academic/classes - Get All Classes
export const getClassesApi = async () => {
  const response = await api.get("/academic/classes");
  return response.data.data.classes;
};

// ✅ API 3 & 4: GET /api/v1/academic/classes/:classId - Get Class By ID
export const getClassByIdApi = async (classId: string) => {
  const response = await api.get(`/academic/classes/${classId}`);
  return response.data.data.class;
};

// ✅ API 5: PATCH /api/v1/academic/classes/:classId - Update Class
export const updateClassApi = async (classId: string, data: any) => {
  const response = await api.put(`/academic/classes/${classId}`, data);
  return response.data.data.class;
};


// API 5: UPDATE CLASS STATUS
// PATCH /api/v1/academic/classes/:classId/status
// ============================================

export const updateClassStatusApi = async (
  classId: string,
  isActive: boolean
): Promise<ClassData> => {
  const response =
    await api.patch<ClassResponse>(
      `/academic/classes/${classId}/status`,
      {
        isActive,
      }
    );

  return response.data.data.class;

}