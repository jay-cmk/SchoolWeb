import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
  CreateHomeworkSubmissionData,
  HomeworkSubmission,
  HomeworkSubmissionFilters,
  HomeworkSubmissionPagination,
  HomeworkSubmissionStats,
  ReviewHomeworkSubmissionData,
  UpdateHomeworkSubmissionData,
} from "./homeworkSubmission.types";

import {
  createHomeworkSubmissionApi,
  deleteHomeworkSubmissionApi,
  getHomeworkSubmissionByIdApi,
  getHomeworkSubmissionsApi,
  getHomeworkSubmissionStatsApi,
  getStudentHomeworkSubmissionApi,
  reviewHomeworkSubmissionApi,
  updateHomeworkSubmissionApi,
} from "./homeworkSubmission.api";


// ======================================================
// STATE
// ======================================================

interface HomeworkSubmissionState {
  submissions: HomeworkSubmission[];

  selectedSubmission: HomeworkSubmission | null;

  studentSubmission: HomeworkSubmission | null;

  stats: HomeworkSubmissionStats | null;

  pagination: HomeworkSubmissionPagination | null;

  loading: boolean;

  error: string | null;
}


const initialState: HomeworkSubmissionState = {
  submissions: [],

  selectedSubmission: null,

  studentSubmission: null,

  stats: null,

  pagination: null,

  loading: false,

  error: null,
};


// ======================================================
// CREATE SUBMISSION
// ======================================================

export const createHomeworkSubmission =
  createAsyncThunk(
    "homeworkSubmission/createHomeworkSubmission",

    async (
      data: CreateHomeworkSubmissionData,
      { rejectWithValue }
    ) => {
      try {
        return await createHomeworkSubmissionApi(
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create homework submission"
        );
      }
    }
  );


// ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

export const getHomeworkSubmissions =
  createAsyncThunk(
    "homeworkSubmission/getHomeworkSubmissions",

    async (
      {
        homeworkId,
        filters,
      }: {
        homeworkId: string;
        filters?: HomeworkSubmissionFilters;
      },
      { rejectWithValue }
    ) => {
      try {
        return await getHomeworkSubmissionsApi(
          homeworkId,
          filters
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch homework submissions"
        );
      }
    }
  );


// ======================================================
// GET SUBMISSION STATS
// ======================================================

export const getHomeworkSubmissionStats =
  createAsyncThunk(
    "homeworkSubmission/getHomeworkSubmissionStats",

    async (
      homeworkId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getHomeworkSubmissionStatsApi(
          homeworkId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch homework submission stats"
        );
      }
    }
  );


// ======================================================
// GET STUDENT SUBMISSION
// ======================================================

export const getStudentHomeworkSubmission =
  createAsyncThunk(
    "homeworkSubmission/getStudentHomeworkSubmission",

    async (
      {
        homeworkId,
        studentId,
      }: {
        homeworkId: string;
        studentId: string;
      },
      { rejectWithValue }
    ) => {
      try {
        return await getStudentHomeworkSubmissionApi(
          homeworkId,
          studentId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch student homework submission"
        );
      }
    }
  );


// ======================================================
// GET SUBMISSION BY ID
// ======================================================

export const getHomeworkSubmissionById =
  createAsyncThunk(
    "homeworkSubmission/getHomeworkSubmissionById",

    async (
      submissionId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getHomeworkSubmissionByIdApi(
          submissionId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch homework submission"
        );
      }
    }
  );


// ======================================================
// UPDATE SUBMISSION
// ======================================================

export const updateHomeworkSubmission =
  createAsyncThunk(
    "homeworkSubmission/updateHomeworkSubmission",

    async (
      {
        submissionId,
        data,
      }: {
        submissionId: string;
        data: UpdateHomeworkSubmissionData;
      },
      { rejectWithValue }
    ) => {
      try {
        return await updateHomeworkSubmissionApi(
          submissionId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update homework submission"
        );
      }
    }
  );


// ======================================================
// REVIEW SUBMISSION
// ======================================================

export const reviewHomeworkSubmission =
  createAsyncThunk(
    "homeworkSubmission/reviewHomeworkSubmission",

    async (
      {
        submissionId,
        data,
      }: {
        submissionId: string;
        data: ReviewHomeworkSubmissionData;
      },
      { rejectWithValue }
    ) => {
      try {
        return await reviewHomeworkSubmissionApi(
          submissionId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to review homework submission"
        );
      }
    }
  );


// ======================================================
// DELETE SUBMISSION
// ======================================================

export const deleteHomeworkSubmission =
  createAsyncThunk(
    "homeworkSubmission/deleteHomeworkSubmission",

    async (
      submissionId: string,
      { rejectWithValue }
    ) => {
      try {
        await deleteHomeworkSubmissionApi(
          submissionId
        );

        return submissionId;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete homework submission"
        );
      }
    }
  );


// ======================================================
// SLICE
// ======================================================

const homeworkSubmissionSlice =
  createSlice({
    name: "homeworkSubmission",

    initialState,

    reducers: {
      clearHomeworkSubmissionError: (
        state
      ) => {
        state.error = null;
      },

      clearSelectedSubmission: (
        state
      ) => {
        state.selectedSubmission =
          null;
      },

      clearStudentSubmission: (
        state
      ) => {
        state.studentSubmission =
          null;
      },

      clearHomeworkSubmissionStats: (
        state
      ) => {
        state.stats = null;
      },
    },

    extraReducers: (builder) => {

      // ================================================
      // CREATE SUBMISSION
      // ================================================

      builder
        .addCase(
          createHomeworkSubmission.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createHomeworkSubmission.fulfilled,
          (state, action) => {
            state.loading = false;

            state.submissions.unshift(
              action.payload
            );

            state.studentSubmission =
              action.payload;
          }
        )

        .addCase(
          createHomeworkSubmission.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // GET HOMEWORK SUBMISSIONS
      // ================================================

      builder
        .addCase(
          getHomeworkSubmissions.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getHomeworkSubmissions.fulfilled,
          (state, action) => {
            state.loading = false;

            state.submissions =
              action.payload.submissions;

            state.pagination =
              action.payload.pagination ??
              null;
          }
        )

        .addCase(
          getHomeworkSubmissions.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // GET SUBMISSION STATS
      // ================================================

      builder
        .addCase(
          getHomeworkSubmissionStats.pending,
          (state) => {
            state.error = null;
          }
        )

        .addCase(
          getHomeworkSubmissionStats.fulfilled,
          (state, action) => {
            state.stats =
              action.payload;
          }
        )

        .addCase(
          getHomeworkSubmissionStats.rejected,
          (state, action) => {
            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // GET STUDENT SUBMISSION
      // ================================================

      builder
        .addCase(
          getStudentHomeworkSubmission.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getStudentHomeworkSubmission.fulfilled,
          (state, action) => {
            state.loading = false;

            state.studentSubmission =
              action.payload;
          }
        )

        .addCase(
          getStudentHomeworkSubmission.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // GET SUBMISSION BY ID
      // ================================================

      builder
        .addCase(
          getHomeworkSubmissionById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getHomeworkSubmissionById.fulfilled,
          (state, action) => {
            state.loading = false;

            state.selectedSubmission =
              action.payload;
          }
        )

        .addCase(
          getHomeworkSubmissionById.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // UPDATE SUBMISSION
      // ================================================

      builder
        .addCase(
          updateHomeworkSubmission.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateHomeworkSubmission.fulfilled,
          (state, action) => {
            state.loading = false;

            const index =
              state.submissions.findIndex(
                (submission) =>
                  submission._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.submissions[index] =
                action.payload;
            }

            if (
              state.selectedSubmission?._id ===
              action.payload._id
            ) {
              state.selectedSubmission =
                action.payload;
            }

            if (
              state.studentSubmission?._id ===
              action.payload._id
            ) {
              state.studentSubmission =
                action.payload;
            }
          }
        )

        .addCase(
          updateHomeworkSubmission.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // REVIEW SUBMISSION
      // ================================================

      builder
        .addCase(
          reviewHomeworkSubmission.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          reviewHomeworkSubmission.fulfilled,
          (state, action) => {
            state.loading = false;

            const index =
              state.submissions.findIndex(
                (submission) =>
                  submission._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.submissions[index] =
                action.payload;
            }

            if (
              state.selectedSubmission?._id ===
              action.payload._id
            ) {
              state.selectedSubmission =
                action.payload;
            }

            if (
              state.studentSubmission?._id ===
              action.payload._id
            ) {
              state.studentSubmission =
                action.payload;
            }
          }
        )

        .addCase(
          reviewHomeworkSubmission.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );


      // ================================================
      // DELETE SUBMISSION
      // ================================================

      builder
        .addCase(
          deleteHomeworkSubmission.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          deleteHomeworkSubmission.fulfilled,
          (state, action) => {
            state.loading = false;

            state.submissions =
              state.submissions.filter(
                (submission) =>
                  submission._id !==
                  action.payload
              );

            if (
              state.selectedSubmission?._id ===
              action.payload
            ) {
              state.selectedSubmission =
                null;
            }

            if (
              state.studentSubmission?._id ===
              action.payload
            ) {
              state.studentSubmission =
                null;
            }
          }
        )

        .addCase(
          deleteHomeworkSubmission.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );
    },
  });


// ======================================================
// ACTIONS
// ======================================================

export const {
  clearHomeworkSubmissionError,
  clearSelectedSubmission,
  clearStudentSubmission,
  clearHomeworkSubmissionStats,
} = homeworkSubmissionSlice.actions;


// ======================================================
// REDUCER
// ======================================================

export default homeworkSubmissionSlice.reducer;