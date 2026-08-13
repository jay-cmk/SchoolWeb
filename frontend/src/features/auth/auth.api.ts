import api from "../../api/axios";

import type {
  LoginPayload,
  LoginResponse,
} from "../../types/auth.types";

export const loginApi = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);

  return response.data.data;
};