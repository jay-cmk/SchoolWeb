import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSubjectApi,
  getSubjectsApi,
  getSubjectByIdApi,
  updateSubjectApi,
  updateSubjectStatusApi,
} from "./subject.api";

import type {
  SubjectState,
  CreateSubjectPayload,
  UpdateSubjectPayload,
  GetSubjectsParams,
} from "./subject.types";


const initialState: SubjectState = {
  subjects: [],

  selectedSubject: null,

  loading: false,

  error: null,
};


// CREATE
export const createSubject =
  createAsyncThunk(
    "subjects/createSubject",

    async (
      data: CreateSubjectPayload,
      { rejectWithValue }
    ) => {
      try {
        return await createSubjectApi(
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create subject"
        );
      }
    }
  );


// GET ALL
export const getSubjects =
  createAsyncThunk(
    "subjects/getSubjects",

    async (
      params:
        | GetSubjectsParams
        | undefined,

      { rejectWithValue }
    ) => {
      try {
        return await getSubjectsApi(
          params
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch subjects"
        );
      }
    }
  );


// GET BY ID
export const getSubjectById =
  createAsyncThunk(
    "subjects/getSubjectById",

    async (
      subjectId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getSubjectByIdApi(
          subjectId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch subject"
        );
      }
    }
  );


// UPDATE
export const updateSubject =
  createAsyncThunk(
    "subjects/updateSubject",

    async (
      {
        subjectId,
        data,
      }: {
        subjectId: string;
        data: UpdateSubjectPayload;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateSubjectApi(
          subjectId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update subject"
        );
      }
    }
  );


// STATUS
export const updateSubjectStatus =
  createAsyncThunk(
    "subjects/updateSubjectStatus",

    async (
      {
        subjectId,
        isActive,
      }: {
        subjectId: string;
        isActive: boolean;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateSubjectStatusApi(
          subjectId,
          isActive
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update subject status"
        );
      }
    }
  );


// SLICE
const subjectSlice =
  createSlice({
    name: "subjects",

    initialState,

    reducers: {
      clearSubjectError: (
        state
      ) => {
        state.error = null;
      },

      clearSelectedSubject: (
        state
      ) => {
        state.selectedSubject =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // CREATE
        .addCase(
          createSubject.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createSubject.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.subjects.push(
              action.payload
            );
          }
        )

        .addCase(
          createSubject.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // GET ALL
        .addCase(
          getSubjects.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getSubjects.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.subjects =
              action.payload;
          }
        )

        .addCase(
          getSubjects.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // GET BY ID
        .addCase(
          getSubjectById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getSubjectById.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.selectedSubject =
              action.payload;
          }
        )

        .addCase(
          getSubjectById.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // UPDATE
        .addCase(
          updateSubject.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const index =
              state.subjects.findIndex(
                (subject) =>
                  subject._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.subjects[index] =
                action.payload;
            }

            if (
              state.selectedSubject
                ?._id ===
              action.payload._id
            ) {
              state.selectedSubject =
                action.payload;
            }
          }
        )

        .addCase(
          updateSubject.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateSubject.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // STATUS
        .addCase(
          updateSubjectStatus.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateSubjectStatus.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const index =
              state.subjects.findIndex(
                (subject) =>
                  subject._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.subjects[index] =
                action.payload;
            }

            if (
              state.selectedSubject
                ?._id ===
              action.payload._id
            ) {
              state.selectedSubject =
                action.payload;
            }
          }
        )

        .addCase(
          updateSubjectStatus.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload as string;
          }
        );
    },
  });


export const {
  clearSubjectError,
  clearSelectedSubject,
} = subjectSlice.actions;


export default subjectSlice.reducer;