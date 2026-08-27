import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  markBulkAttendanceApi,
  getAttendanceApi,
  updateAttendanceApi,
  getMonthlyAttendanceSummaryApi,
  getStudentAttendanceSummaryApi,
} from "./attendance.api";

import type {
  AttendanceState,
  BulkAttendancePayload,
  UpdateAttendancePayload,
  GetAttendanceParams,
  MonthlyAttendanceParams,
  StudentAttendanceSummaryParams,
} from "./attendance.types";


// ============================================
// INITIAL STATE
// ============================================

const initialState:
  AttendanceState = {

    attendance: [],

    monthlySummary: null,

    studentSummary: null,

    selectedAttendance: null,

    loading: false,

    saving: false,

    error: null,
  };


// ============================================
// BULK MARK ATTENDANCE
// ============================================

export const markBulkAttendance =
  createAsyncThunk(
    "attendance/markBulkAttendance",

    async (
      data:
        BulkAttendancePayload,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await markBulkAttendanceApi(
          data
        );

      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to save attendance"
        );
      }
    }
  );


// ============================================
// GET ATTENDANCE
// ============================================

export const getAttendance =
  createAsyncThunk(
    "attendance/getAttendance",

    async (
      params:
        | GetAttendanceParams
        | undefined,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getAttendanceApi(
          params
        );

      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch attendance"
        );
      }
    }
  );


// ============================================
// UPDATE SINGLE ATTENDANCE
// ============================================

export const updateAttendance =
  createAsyncThunk(
    "attendance/updateAttendance",

    async (
      {
        attendanceId,
        data,
      }: {
        attendanceId: string;

        data:
          UpdateAttendancePayload;
      },

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await updateAttendanceApi(
          attendanceId,
          data
        );

      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update attendance"
        );
      }
    }
  );


// ============================================
// MONTHLY SUMMARY
// ============================================

export const getMonthlyAttendanceSummary =
  createAsyncThunk(
    "attendance/getMonthlyAttendanceSummary",

    async (
      params:
        MonthlyAttendanceParams,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getMonthlyAttendanceSummaryApi(
          params
        );

      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch monthly attendance summary"
        );
      }
    }
  );


// ============================================
// STUDENT ATTENDANCE SUMMARY
// ============================================

export const getStudentAttendanceSummary =
  createAsyncThunk(
    "attendance/getStudentAttendanceSummary",

    async (
      params:
        StudentAttendanceSummaryParams,

      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getStudentAttendanceSummaryApi(
          params
        );

      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch student attendance summary"
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const attendanceSlice =
  createSlice({
    name:
      "attendance",

    initialState,

    reducers: {

      // ======================================
      // CLEAR ERROR
      // ======================================

      clearAttendanceError: (
        state
      ) => {
        state.error =
          null;
      },


      // ======================================
      // CLEAR ATTENDANCE LIST
      // ======================================

      clearAttendance: (
        state
      ) => {
        state.attendance =
          [];
      },


      // ======================================
      // CLEAR MONTHLY SUMMARY
      // ======================================

      clearMonthlyAttendanceSummary: (
        state
      ) => {
        state.monthlySummary =
          null;
      },


      // ======================================
      // CLEAR STUDENT SUMMARY
      // ======================================

      clearStudentAttendanceSummary: (
        state
      ) => {
        state.studentSummary =
          null;
      },


      // ======================================
      // CLEAR SELECTED
      // ======================================

      clearSelectedAttendance: (
        state
      ) => {
        state.selectedAttendance =
          null;
      },
    },


    extraReducers: (
      builder
    ) => {
      builder

        // ======================================
        // BULK MARK ATTENDANCE
        // ======================================

        .addCase(
          markBulkAttendance.pending,

          (
            state
          ) => {
            state.saving =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          markBulkAttendance.fulfilled,

          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.attendance =
              action.payload;
          }
        )

        .addCase(
          markBulkAttendance.rejected,

          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // GET ATTENDANCE
        // ======================================

        .addCase(
          getAttendance.pending,

          (
            state
          ) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          getAttendance.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.attendance =
              action.payload;
          }
        )

        .addCase(
          getAttendance.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // UPDATE SINGLE
        // ======================================

        .addCase(
          updateAttendance.pending,

          (
            state
          ) => {
            state.saving =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          updateAttendance.fulfilled,

          (
            state,
            action
          ) => {
            state.saving =
              false;


            const index =
              state.attendance.findIndex(
                (attendance) =>
                  attendance._id ===
                  action.payload._id
              );


            if (
              index !== -1
            ) {
              state.attendance[
                index
              ] =
                action.payload;
            }


            if (
              state.selectedAttendance
                ?._id ===
              action.payload._id
            ) {
              state.selectedAttendance =
                action.payload;
            }
          }
        )

        .addCase(
          updateAttendance.rejected,

          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // MONTHLY SUMMARY
        // ======================================

        .addCase(
          getMonthlyAttendanceSummary.pending,

          (
            state
          ) => {
            state.loading =
              true;

            state.error =
              null;

            state.monthlySummary =
              null;
          }
        )

        .addCase(
          getMonthlyAttendanceSummary.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.monthlySummary =
              action.payload;
          }
        )

        .addCase(
          getMonthlyAttendanceSummary.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // STUDENT SUMMARY
        // ======================================

        .addCase(
          getStudentAttendanceSummary.pending,

          (
            state
          ) => {
            state.loading =
              true;

            state.error =
              null;

            state.studentSummary =
              null;
          }
        )

        .addCase(
          getStudentAttendanceSummary.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.studentSummary =
              action.payload;
          }
        )

        .addCase(
          getStudentAttendanceSummary.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload as string;
          }
        );
    },
  });


// ============================================
// ACTIONS
// ============================================

export const {
  clearAttendanceError,

  clearAttendance,

  clearMonthlyAttendanceSummary,

  clearStudentAttendanceSummary,

  clearSelectedAttendance,
} =
  attendanceSlice.actions;


// ============================================
// REDUCER
// ============================================

export default
  attendanceSlice.reducer;