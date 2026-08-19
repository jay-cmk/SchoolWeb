// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export interface School {
//   _id: string;
//   name: string;
//   code: string;
//   email?: string;
//   phone?: string;
//   address?: {
//     addressLine?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//     country?: string;
//   };
//   logo?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("accessToken");

//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// export const getSchoolsApi = async () => {
//   const response = await axios.get(`${API_URL}/super-admin/schools`, {
//     headers: getAuthHeaders(),
//   });

//   return response.data.data.schools as School[];
// };


import api from "../../api/axios";

import type {
  School,
  SchoolStatus,
  CreateSchoolPayload,
  UpdateSchoolPayload,
} from "./school.types";

// CREATE SCHOOL
export const createSchoolApi = async (
  data: CreateSchoolPayload
): Promise<School> => {
  const response = await api.post(
    "/super-admin/schools",
    data
  );

  return response.data.data.school;
};

// GET ALL SCHOOLS
export const getSchoolsApi = async (): Promise<School[]> => {
  const response = await api.get(
    "/super-admin/schools"
  );

  return response.data.data.schools;
};

// GET SINGLE SCHOOL
export const getSchoolByIdApi = async (
  schoolId: string
): Promise<School> => {
  const response = await api.get(
    `/super-admin/schools/${schoolId}`
  );

  return response.data.data.school;
};

// UPDATE SCHOOL
export const updateSchoolApi = async (
  schoolId: string,
  data: UpdateSchoolPayload
): Promise<School> => {
  const response = await api.put(
    `/super-admin/schools/${schoolId}`,
    data
  );

  return response.data.data.school;
};

// UPDATE SCHOOL STATUS
export const updateSchoolStatusApi = async (
  schoolId: string,
  status: SchoolStatus
): Promise<School> => {
  const response = await api.patch(
    `/super-admin/schools/${schoolId}/status`,
    { status }
  );

  return response.data.data.school;
};