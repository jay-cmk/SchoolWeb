// // ============================================
// // CLASS API (class.api.ts)
// // ============================================
// import type {
//   ClassData,
//   CreateClassPayload,
//   UpdateClassPayload,
//   ClassResponse,
//   ClassesResponse,
// } from "./class.types";

// import api from "../../../api/axios";

// // ✅ API 1: POST /api/v1/academic/classes - Create Class
// export const createClassApi = async (data: any) => {
//   console.log(
//     "TOKEN:",
//     localStorage.getItem(
//       "accessToken"
//     )
//   );

//   console.log(
//     "CLASS PAYLOAD:",
//     data
//   );

//   const response = await api.post("/academic/classes", data);
//   return response.data.data.class;
// };

// // ✅ API 2: GET /api/v1/academic/classes - Get All Classes
// export const getClassesApi = async () => {
//   const response = await api.get("/academic/classes");
//   return response.data.data.classes;
// };

// // ✅ API 3 & 4: GET /api/v1/academic/classes/:classId - Get Class By ID
// export const getClassByIdApi = async (classId: string) => {
//   const response = await api.get(`/academic/classes/${classId}`);
//   return response.data.data.class;
// };

// // ✅ API 5: PATCH /api/v1/academic/classes/:classId - Update Class
// export const updateClassApi = async (classId: string, data: any) => {
//   const response = await api.put(`/academic/classes/${classId}`, data);
//   return response.data.data.class;
// };


// // API 5: UPDATE CLASS STATUS
// // PATCH /api/v1/academic/classes/:classId/status
// // ============================================

// export const updateClassStatusApi = async (
//   classId: string,
//   isActive: boolean
// ): Promise<ClassData> => {
//   const response =
//     await api.patch<ClassResponse>(
//       `/academic/classes/${classId}/status`,
//       {
//         isActive,
//       }
//     );

//   return response.data.data.class;

// }







// ============================================
// CLASS API (class.api.ts)
// ============================================

import api from "../../../api/axios";

import type {
  ClassData,
  ClassResponse,
  ClassesResponse,
  CreateClassPayload,
  GetClassesParams,
  UpdateClassPayload,
} from "./class.types";


// ============================================
// API 1: CREATE CLASS
// POST /api/v1/academic/classes
// ============================================

export const createClassApi = async (
  data: CreateClassPayload
): Promise<ClassData> => {
  const response =
    await api.post<ClassResponse>(
      "/academic/classes",
      data
    );

  return response.data.data.class;
};


// ============================================
// API 2: GET CLASSES
// GET /api/v1/academic/classes
//
// Optional:
// ?sessionId=...
// ============================================

export const getClassesApi = async (
  params?: GetClassesParams
): Promise<ClassData[]> => {
  const response =
    await api.get<ClassesResponse>(
      "/academic/classes",
      {
        params,
      }
    );

  return response.data.data.classes;
};


// ============================================
// API 3: GET CLASS BY ID
// GET /api/v1/academic/classes/:classId
// ============================================

export const getClassByIdApi = async (
  classId: string
): Promise<ClassData> => {
  const response =
    await api.get<ClassResponse>(
      `/academic/classes/${classId}`
    );

  return response.data.data.class;
};


// ============================================
// API 4: UPDATE CLASS
// PUT /api/v1/academic/classes/:classId
// ============================================

export const updateClassApi = async (
  classId: string,
  data: UpdateClassPayload
): Promise<ClassData> => {
  const response =
    await api.put<ClassResponse>(
      `/academic/classes/${classId}`,
      data
    );

  return response.data.data.class;
};


// ============================================
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
};