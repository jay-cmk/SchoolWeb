





import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSubjectAssignmentApi,
  getSubjectAssignmentsApi,
  getMySubjectAssignmentsApi,
  getSubjectAssignmentByIdApi,
  updateSubjectAssignmentApi,
  updateSubjectAssignmentStatusApi,
} from "./subjectAssignment.api";

import type {
  SubjectAssignmentState,
  CreateSubjectAssignmentPayload,
  UpdateSubjectAssignmentPayload,
  GetSubjectAssignmentsParams,
} from "./subjectAssignment.types";


// ============================================
// INITIAL STATE
// ============================================

const initialState:
  SubjectAssignmentState = {

    // School Admin
    assignments: [],

    selectedAssignment: null,

    // Logged-in Teacher
    myAssignments: [],

    myTeacher: null,

    loading: false,

    error: null,
  };


// ============================================
// CREATE ASSIGNMENT
//
// SCHOOL_ADMIN
// ============================================

export const createSubjectAssignment =
  createAsyncThunk(
    "subjectAssignments/createSubjectAssignment",

    async (
      data:
        CreateSubjectAssignmentPayload,

      {
        rejectWithValue,
      }
    ) => {

      try {

        return await createSubjectAssignmentApi(
          data
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create subject assignment"
        );
      }
    }
  );


// ============================================
// GET ALL ASSIGNMENTS
//
// SCHOOL_ADMIN
// ============================================

export const getSubjectAssignments =
  createAsyncThunk(
    "subjectAssignments/getSubjectAssignments",

    async (
      params:
        | GetSubjectAssignmentsParams
        | undefined,

      {
        rejectWithValue,
      }
    ) => {

      try {

        return await getSubjectAssignmentsApi(
          params
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch subject assignments"
        );
      }
    }
  );


// ============================================
// GET MY SUBJECT ASSIGNMENTS
//
// TEACHER
// GET /academic/subject-assignments/teacher/me
// ============================================

export const getMySubjectAssignments =
  createAsyncThunk(
    "subjectAssignments/getMySubjectAssignments",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {

      try {

        return await getMySubjectAssignmentsApi();

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch my subject assignments"
        );
      }
    }
  );


// ============================================
// GET ASSIGNMENT BY ID
//
// SCHOOL_ADMIN
// ============================================

export const getSubjectAssignmentById =
  createAsyncThunk(
    "subjectAssignments/getSubjectAssignmentById",

    async (
      assignmentId: string,

      {
        rejectWithValue,
      }
    ) => {

      try {

        return await getSubjectAssignmentByIdApi(
          assignmentId
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch subject assignment"
        );
      }
    }
  );


// ============================================
// UPDATE ASSIGNMENT
//
// SCHOOL_ADMIN
// ============================================

export const updateSubjectAssignment =
  createAsyncThunk(
    "subjectAssignments/updateSubjectAssignment",

    async (
      {
        assignmentId,
        data,
      }: {
        assignmentId: string;

        data:
          UpdateSubjectAssignmentPayload;
      },

      {
        rejectWithValue,
      }
    ) => {

      try {

        return await updateSubjectAssignmentApi(
          assignmentId,
          data
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update subject assignment"
        );
      }
    }
  );


// ============================================
// UPDATE STATUS
//
// SCHOOL_ADMIN
// ============================================

export const updateSubjectAssignmentStatus =
  createAsyncThunk(
    "subjectAssignments/updateSubjectAssignmentStatus",

    async (
      {
        assignmentId,
        isActive,
      }: {
        assignmentId: string;

        isActive: boolean;
      },

      {
        rejectWithValue,
      }
    ) => {

      try {

        return await updateSubjectAssignmentStatusApi(
          assignmentId,
          isActive
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update subject assignment status"
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const subjectAssignmentSlice =
  createSlice({

    name:
      "subjectAssignments",

    initialState,

    reducers: {

      // ======================================
      // CLEAR ERROR
      // ======================================

      clearSubjectAssignmentError: (
        state
      ) => {

        state.error =
          null;
      },


      // ======================================
      // CLEAR SELECTED
      // ======================================

      clearSelectedSubjectAssignment: (
        state
      ) => {

        state.selectedAssignment =
          null;
      },


      // ======================================
      // CLEAR MY ASSIGNMENTS
      // ======================================

      clearMySubjectAssignments: (
        state
      ) => {

        state.myAssignments = [];

        state.myTeacher = null;
      },
    },


    extraReducers: (
      builder
    ) => {

      builder

        // ======================================
        // CREATE
        // ======================================

        .addCase(
          createSubjectAssignment.pending,

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
          createSubjectAssignment.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.assignments.push(
              action.payload
            );
          }
        )

        .addCase(
          createSubjectAssignment.rejected,

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
        // GET ALL
        // ======================================

        .addCase(
          getSubjectAssignments.pending,

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
          getSubjectAssignments.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.assignments =
              action.payload;
          }
        )

        .addCase(
          getSubjectAssignments.rejected,

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
        // GET MY SUBJECT ASSIGNMENTS
        // ======================================

        .addCase(
          getMySubjectAssignments.pending,

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
          getMySubjectAssignments.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.myTeacher =
              action.payload.teacher;

            state.myAssignments =
              action.payload.assignments;
          }
        )

        .addCase(
          getMySubjectAssignments.rejected,

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
        // GET BY ID
        // ======================================

        .addCase(
          getSubjectAssignmentById.pending,

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
          getSubjectAssignmentById.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;

            state.selectedAssignment =
              action.payload;
          }
        )

        .addCase(
          getSubjectAssignmentById.rejected,

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
        // UPDATE
        // ======================================

        .addCase(
          updateSubjectAssignment.pending,

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
          updateSubjectAssignment.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;


            const index =
              state.assignments.findIndex(
                (
                  assignment
                ) =>
                  assignment._id ===
                  action.payload._id
              );


            if (
              index !== -1
            ) {

              state.assignments[
                index
              ] =
                action.payload;
            }


            if (
              state.selectedAssignment
                ?._id ===
              action.payload._id
            ) {

              state.selectedAssignment =
                action.payload;
            }


            // If same assignment already loaded
            // in logged-in Teacher state
            const myIndex =
              state.myAssignments.findIndex(
                (
                  assignment
                ) =>
                  assignment._id ===
                  action.payload._id
              );


            if (
              myIndex !== -1
            ) {

              state.myAssignments[
                myIndex
              ] =
                action.payload;
            }
          }
        )

        .addCase(
          updateSubjectAssignment.rejected,

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
        // STATUS
        // ======================================

        .addCase(
          updateSubjectAssignmentStatus.pending,

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
          updateSubjectAssignmentStatus.fulfilled,

          (
            state,
            action
          ) => {

            state.loading =
              false;


            const index =
              state.assignments.findIndex(
                (
                  assignment
                ) =>
                  assignment._id ===
                  action.payload._id
              );


            if (
              index !== -1
            ) {

              state.assignments[
                index
              ] =
                action.payload;
            }


            if (
              state.selectedAssignment
                ?._id ===
              action.payload._id
            ) {

              state.selectedAssignment =
                action.payload;
            }


            const myIndex =
              state.myAssignments.findIndex(
                (
                  assignment
                ) =>
                  assignment._id ===
                  action.payload._id
              );


            if (
              myIndex !== -1
            ) {

              if (
                action.payload.isActive
              ) {

                state.myAssignments[
                  myIndex
                ] =
                  action.payload;

              } else {

                state.myAssignments =
                  state.myAssignments.filter(
                    (
                      assignment
                    ) =>
                      assignment._id !==
                      action.payload._id
                  );
              }
            }
          }
        )

        .addCase(
          updateSubjectAssignmentStatus.rejected,

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
  clearSubjectAssignmentError,

  clearSelectedSubjectAssignment,

  clearMySubjectAssignments,
} =
  subjectAssignmentSlice.actions;


// ============================================
// REDUCER
// ============================================

export default
  subjectAssignmentSlice.reducer;