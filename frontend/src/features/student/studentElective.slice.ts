import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  assignStudentElectiveApi,
  bulkAssignStudentElectiveApi,
  getStudentElectivesApi,
  updateStudentElectiveApi,
} from "./studentElective.api";

import type {
  AssignStudentElectivePayload,
  BulkAssignStudentElectivePayload,
  GetStudentElectivesParams,
  StudentElectiveEnrollment,
  StudentElectiveState,
  UpdateStudentElectivePayload,
} from "./studentElective.types";


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: StudentElectiveState = {
  enrollments: [],

  selectedEnrollment: null,

  loading: false,

  submitting: false,

  error: null,

  successMessage: null,
};


/* =====================================================
   ERROR MESSAGE HELPER
===================================================== */

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
): string => {
  const apiError =
    error as {
      response?: {
        data?: {
          message?: string;
        };
      };

      message?: string;
    };

  return (
    apiError.response?.data?.message ??
    apiError.message ??
    fallbackMessage
  );
};


/* =====================================================
   GET ELECTIVE ENROLLMENTS
===================================================== */

export const getStudentElectives =
  createAsyncThunk<
    StudentElectiveEnrollment[],
    GetStudentElectivesParams | undefined,
    {
      rejectValue: string;
    }
  >(
    "studentElectives/getAll",

    async (
      filters,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getStudentElectivesApi(
          filters
        );
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to fetch elective assignments"
          )
        );
      }
    }
  );


/* =====================================================
   ASSIGN SINGLE ELECTIVE
===================================================== */

export const assignStudentElective =
  createAsyncThunk<
    StudentElectiveEnrollment,
    AssignStudentElectivePayload,
    {
      rejectValue: string;
    }
  >(
    "studentElectives/assign",

    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await assignStudentElectiveApi(
          data
        );
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to assign elective subject"
          )
        );
      }
    }
  );


/* =====================================================
   BULK ASSIGN ELECTIVE
===================================================== */

export const bulkAssignStudentElective =
  createAsyncThunk<
    StudentElectiveEnrollment[],
    BulkAssignStudentElectivePayload,
    {
      rejectValue: string;
    }
  >(
    "studentElectives/bulkAssign",

    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const result =
          await bulkAssignStudentElectiveApi(
            data
          );

        return result.enrollments;
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to assign elective subject to students"
          )
        );
      }
    }
  );


/* =====================================================
   UPDATE ELECTIVE STATUS / REMARKS
===================================================== */

interface UpdateStudentElectiveThunkData {
  enrollmentId: string;

  data: UpdateStudentElectivePayload;
}


export const updateStudentElective =
  createAsyncThunk<
    StudentElectiveEnrollment,
    UpdateStudentElectiveThunkData,
    {
      rejectValue: string;
    }
  >(
    "studentElectives/update",

    async (
      {
        enrollmentId,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await updateStudentElectiveApi(
          enrollmentId,
          data
        );
      } catch (error: unknown) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to update elective assignment"
          )
        );
      }
    }
  );


/* =====================================================
   SLICE
===================================================== */

const studentElectiveSlice =
  createSlice({
    name: "studentElectives",

    initialState,

    reducers: {
      clearStudentElectiveError: (
        state
      ) => {
        state.error = null;
      },

      clearStudentElectiveSuccess: (
        state
      ) => {
        state.successMessage = null;
      },

      clearStudentElectiveMessages: (
        state
      ) => {
        state.error = null;

        state.successMessage = null;
      },

      setSelectedStudentElective: (
        state,
        action: {
          payload:
            StudentElectiveEnrollment | null;
        }
      ) => {
        state.selectedEnrollment =
          action.payload;
      },

      resetStudentElectives: (
        state
      ) => {
        state.enrollments = [];

        state.selectedEnrollment = null;

        state.loading = false;

        state.submitting = false;

        state.error = null;

        state.successMessage = null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        /* =============================================
           GET ALL
        ============================================= */

        .addCase(
          getStudentElectives.pending,
          (state) => {
            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          getStudentElectives.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.enrollments =
              action.payload;

            state.error = null;
          }
        )

        .addCase(
          getStudentElectives.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ??
              "Failed to fetch elective assignments";
          }
        )

        /* =============================================
           ASSIGN SINGLE
        ============================================= */

        .addCase(
          assignStudentElective.pending,
          (state) => {
            state.submitting = true;

            state.error = null;

            state.successMessage = null;
          }
        )

        .addCase(
          assignStudentElective.fulfilled,
          (
            state,
            action
          ) => {
            state.submitting = false;

            const existingIndex =
              state.enrollments.findIndex(
                (enrollment) =>
                  enrollment._id ===
                  action.payload._id
              );

            if (existingIndex >= 0) {
              state.enrollments[
                existingIndex
              ] = action.payload;
            } else {
              state.enrollments.unshift(
                action.payload
              );
            }

            state.successMessage =
              "Elective subject assigned successfully";

            state.error = null;
          }
        )

        .addCase(
          assignStudentElective.rejected,
          (
            state,
            action
          ) => {
            state.submitting = false;

            state.error =
              action.payload ??
              "Failed to assign elective subject";
          }
        )

        /* =============================================
           BULK ASSIGN
        ============================================= */

        .addCase(
          bulkAssignStudentElective.pending,
          (state) => {
            state.submitting = true;

            state.error = null;

            state.successMessage = null;
          }
        )

        .addCase(
          bulkAssignStudentElective.fulfilled,
          (
            state,
            action
          ) => {
            state.submitting = false;

            action.payload.forEach(
              (newEnrollment) => {
                const existingIndex =
                  state.enrollments.findIndex(
                    (enrollment) =>
                      enrollment._id ===
                      newEnrollment._id
                  );

                if (
                  existingIndex >= 0
                ) {
                  state.enrollments[
                    existingIndex
                  ] = newEnrollment;
                } else {
                  state.enrollments.unshift(
                    newEnrollment
                  );
                }
              }
            );

            state.successMessage =
              `${action.payload.length} student elective assignment(s) completed`;

            state.error = null;
          }
        )

        .addCase(
          bulkAssignStudentElective.rejected,
          (
            state,
            action
          ) => {
            state.submitting = false;

            state.error =
              action.payload ??
              "Failed to assign elective subject to students";
          }
        )

        /* =============================================
           UPDATE
        ============================================= */

        .addCase(
          updateStudentElective.pending,
          (state) => {
            state.submitting = true;

            state.error = null;

            state.successMessage = null;
          }
        )

        .addCase(
          updateStudentElective.fulfilled,
          (
            state,
            action
          ) => {
            state.submitting = false;

            const index =
              state.enrollments.findIndex(
                (enrollment) =>
                  enrollment._id ===
                  action.payload._id
              );

            if (index >= 0) {
              state.enrollments[index] =
                action.payload;
            }

            if (
              state.selectedEnrollment?._id ===
              action.payload._id
            ) {
              state.selectedEnrollment =
                action.payload;
            }

            state.successMessage =
              "Elective assignment updated successfully";

            state.error = null;
          }
        )

        .addCase(
          updateStudentElective.rejected,
          (
            state,
            action
          ) => {
            state.submitting = false;

            state.error =
              action.payload ??
              "Failed to update elective assignment";
          }
        );
    },
  });


/* =====================================================
   EXPORT ACTIONS
===================================================== */

export const {
  clearStudentElectiveError,

  clearStudentElectiveSuccess,

  clearStudentElectiveMessages,

  setSelectedStudentElective,

  resetStudentElectives,
} = studentElectiveSlice.actions;


/* =====================================================
   EXPORT REDUCER
===================================================== */

export default studentElectiveSlice.reducer;