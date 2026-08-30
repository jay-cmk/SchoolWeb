// src/features/schoolAdminDashboard/schoolAdminDashboard.api.ts

import axios from "axios";

import type {
  SchoolAdminDashboard,
  SchoolAdminDashboardResponse,
} from "./schoolAdminDashboard.types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSchoolAdminDashboardApi =
  async (): Promise<SchoolAdminDashboard> => {
    const response =
      await axios.get<SchoolAdminDashboardResponse>(
        `${API_URL}/school-admin/dashboard`,
        {
          headers: getAuthHeaders(),
        }
      );

    return response.data.data;
  };