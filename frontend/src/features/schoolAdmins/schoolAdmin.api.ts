import api from "../../api/axios";

import type {
  SchoolAdmin,
  CreateSchoolAdminPayload,
  UpdateSchoolAdminPayload,
} from "./schoolAdmin.types";

// CREATE SCHOOL ADMIN
export const createSchoolAdminApi = async (
  schoolId: string,
  data: CreateSchoolAdminPayload
): Promise<SchoolAdmin> => {
  const response = await api.post(
    `/super-admin/schools/${schoolId}/admin`,
    data
  );

  return response.data.data.admin;
};

// GET SCHOOL ADMINS
export const getSchoolAdminsApi = async (
  schoolId: string
): Promise<SchoolAdmin[]> => {
  const response = await api.get(
    `/super-admin/schools/${schoolId}/admin`
  );

  return response.data.data.admins;
};

// UPDATE SCHOOL ADMIN
export const updateSchoolAdminApi = async (
  schoolId: string,
  adminId: string,
  data: UpdateSchoolAdminPayload
): Promise<SchoolAdmin> => {
  const response = await api.put(
    `/super-admin/schools/${schoolId}/admin/${adminId}`,
    data
  );

  return response.data.data.admin;
};

// UPDATE SCHOOL ADMIN STATUS
export const updateSchoolAdminStatusApi = async (
  schoolId: string,
  adminId: string,
  isActive: boolean
): Promise<SchoolAdmin> => {
  const response = await api.patch(
    `/super-admin/schools/${schoolId}/admin/${adminId}/status`,
    {
      isActive,
    }
  );

  return response.data.data.admin;
};