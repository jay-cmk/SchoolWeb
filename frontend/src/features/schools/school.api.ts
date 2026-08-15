import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface School {
  _id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSchoolsApi = async () => {
  const response = await axios.get(`${API_URL}/super-admin/schools`, {
    headers: getAuthHeaders(),
  });

  return response.data.data.schools as School[];
};