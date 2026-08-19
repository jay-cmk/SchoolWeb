// import axios from "axios";

// import type {
//   CreateSessionPayload,
//   UpdateSessionPayload,
//   SessionResponse,
//   SessionsResponse,
// } from "./session.types";


// const API_URL = import.meta.env.VITE_API_URL;


// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("accessToken");

//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };


// // ================================
// // CREATE SESSION
// // POST /academic/sessions
// // ================================

// export const createSessionApi = async (
//   data: CreateSessionPayload
// ) => {
//   const response =
//     await axios.post<SessionResponse>(
//       `${API_URL}/academic/sessions`,
//       data,
//       {
//         headers: getAuthHeaders(),
//       }
//     );

//   return response.data.data.session;
// };


// // ================================
// // GET ALL SESSIONS
// // GET /academic/sessions
// // ================================

// export const getSessionsApi = async () => {
//   const response =
//     await axios.get<SessionsResponse>(
//       `${API_URL}/academic/sessions`,
//       {
//         headers: getAuthHeaders(),
//       }
//     );

//   return response.data.data.sessions;
// };


// // ================================
// // GET SESSION BY ID
// // GET /academic/sessions/:sessionId
// // ================================

// export const getSessionByIdApi = async (
//   sessionId: string
// ) => {
//   const response =
//     await axios.get<SessionResponse>(
//       `${API_URL}/academic/sessions/${sessionId}`,
//       {
//         headers: getAuthHeaders(),
//       }
//     );

//   return response.data.data.session;
// };


// // ================================
// // UPDATE SESSION
// // PUT /academic/sessions/:sessionId
// // ================================

// export const updateSessionApi = async (
//   sessionId: string,
//   data: UpdateSessionPayload
// ) => {
//   const response =
//     await axios.put<SessionResponse>(
//       `${API_URL}/academic/sessions/${sessionId}`,
//       data,
//       {
//         headers: getAuthHeaders(),
//       }
//     );

//   return response.data.data.session;
// };


// // ================================
// // SET CURRENT SESSION
// // PATCH /academic/sessions/:sessionId/current
// // ================================

// export const setCurrentSessionApi = async (
//   sessionId: string
// ) => {
//   const response =
//     await axios.patch<SessionResponse>(
//       `${API_URL}/academic/sessions/${sessionId}/current`,
//       {},
//       {
//         headers: getAuthHeaders(),
//       }
//     );

//   return response.data.data.session;
// };



import api from "../../../api/axios";

export const createSessionApi = async (data: any) => {
  const response = await api.post("/academic/sessions", data);
  return response.data.data.session;
};

export const getSessionsApi = async () => {
  const response = await api.get("/academic/sessions");
  return response.data.data.sessions;
};

export const getSessionByIdApi = async (sessionId: string) => {
  const response = await api.get(`/academic/sessions/${sessionId}`);
  return response.data.data.session;
};

export const updateSessionApi = async (sessionId: string, data: any) => {
  const response = await api.put(`/academic/sessions/${sessionId}`, data);
  return response.data.data.session;
};

export const setCurrentSessionApi = async (sessionId: string) => {
  const response = await api.patch(`/academic/sessions/${sessionId}/current`);
  return response.data.data.session;
};