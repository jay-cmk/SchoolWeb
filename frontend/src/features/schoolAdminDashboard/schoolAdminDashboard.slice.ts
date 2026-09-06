// // src/features/schoolAdminDashboard/schoolAdminDashboard.slice.ts

// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   getSchoolAdminDashboardApi,
// } from "./schoolAdminDashboard.api";

// import type {
//   SchoolAdminDashboard,
// } from "./schoolAdminDashboard.types";

// interface SchoolAdminDashboardState {
//   dashboard: SchoolAdminDashboard | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SchoolAdminDashboardState = {
//   dashboard: null,
//   loading: false,
//   error: null,
// };

// export const getSchoolAdminDashboard =
//   createAsyncThunk(
//     "schoolAdminDashboard/getSchoolAdminDashboard",
//     async (_, { rejectWithValue }) => {
//       try {
//         return await getSchoolAdminDashboardApi();
//       } catch (error: unknown) {
//         if (
//           typeof error === "object" &&
//           error !== null &&
//           "response" in error
//         ) {
//           const axiosError =
//             error as {
//               response?: {
//                 data?: {
//                   message?: string;
//                 };
//               };
//             };

//           return rejectWithValue(
//             axiosError.response?.data?.message ||
//               "Failed to fetch dashboard"
//           );
//         }

//         return rejectWithValue(
//           "Failed to fetch dashboard"
//         );
//       }
//     }
//   );

// const schoolAdminDashboardSlice =
//   createSlice({
//     name: "schoolAdminDashboard",

//     initialState,

//     reducers: {
//       clearSchoolAdminDashboardError: (
//         state
//       ) => {
//         state.error = null;
//       },
//     },

//     extraReducers: (builder) => {
//       builder
//         .addCase(
//           getSchoolAdminDashboard.pending,
//           (state) => {
//             state.loading = true;
//             state.error = null;
//           }
//         )

//         .addCase(
//           getSchoolAdminDashboard.fulfilled,
//           (state, action) => {
//             state.loading = false;
//             state.dashboard = action.payload;
//           }
//         )

//         .addCase(
//           getSchoolAdminDashboard.rejected,
//           (state, action) => {
//             state.loading = false;
//             state.error =
//               action.payload as string;
//           }
//         );
//     },
//   });

// export const {
//   clearSchoolAdminDashboardError,
// } = schoolAdminDashboardSlice.actions;

// export default
//   schoolAdminDashboardSlice.reducer;



// src/features/schoolAdminDashboard/schoolAdminDashboard.slice.ts

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getSchoolAdminDashboardApi,
} from "./schoolAdminDashboard.api";

import type {
  SchoolAdminDashboard,
} from "./schoolAdminDashboard.types";

interface SchoolAdminDashboardState {
  dashboard: SchoolAdminDashboard | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolAdminDashboardState = {
  dashboard: null,
  loading: false,
  error: null,
};

export const getSchoolAdminDashboard =
  createAsyncThunk<
    SchoolAdminDashboard,
    string
  >(
    "schoolAdminDashboard/getSchoolAdminDashboard",
    async (
      sessionId,
      { rejectWithValue }
    ) => {
      try {
        return await getSchoolAdminDashboardApi(
          sessionId
        );
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError =
            error as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };

          return rejectWithValue(
            axiosError.response?.data?.message ||
              "Failed to fetch dashboard"
          );
        }

        return rejectWithValue(
          "Failed to fetch dashboard"
        );
      }
    }
  );

const schoolAdminDashboardSlice =
  createSlice({
    name: "schoolAdminDashboard",

    initialState,

    reducers: {
      clearSchoolAdminDashboard: (
        state
      ) => {
        state.dashboard = null;
        state.error = null;
      },

      clearSchoolAdminDashboardError: (
        state
      ) => {
        state.error = null;
      },
    },

    extraReducers: (builder) => {
      builder
        .addCase(
          getSchoolAdminDashboard.pending,
          (state) => {
            state.loading = true;
            state.error = null;
            state.dashboard = null;
          }
        )

        .addCase(
          getSchoolAdminDashboard.fulfilled,
          (state, action) => {
            state.loading = false;
            state.dashboard = action.payload;
          }
        )

        .addCase(
          getSchoolAdminDashboard.rejected,
          (state, action) => {
            state.loading = false;
            state.error =
              action.payload as string;
          }
        );
    },
  });

export const {
  clearSchoolAdminDashboard,
  clearSchoolAdminDashboardError,
} = schoolAdminDashboardSlice.actions;

export default
  schoolAdminDashboardSlice.reducer;
