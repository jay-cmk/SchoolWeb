import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { loginApi } from "./auth.api";

import type {
  LoginPayload,
  User,
} from "../../types/auth.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  authInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  authInitialized: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    data: LoginPayload,
    { rejectWithValue }
  ) => {
    try {
      const result = await loginApi(data);

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.authInitialized = true;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },

    loadUser: (state) => {
      const accessToken =
        localStorage.getItem("accessToken");

      const user = localStorage.getItem("user");

      state.accessToken = accessToken;

      if (user) {
        try {
          state.user = JSON.parse(user);
        } catch {
          state.user = null;

          localStorage.removeItem("user");
        }
      } else {
        state.user = null;
      }

      state.authInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken =
          action.payload.accessToken;
        state.user = action.payload.user;
        state.authInitialized = true;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload as string;
        state.authInitialized = true;
      });
  },
});

export const {
  logout,
  loadUser,
} = authSlice.actions;

export default authSlice.reducer;