// ============================================
// CLASS SLICE (class.slice.ts)
// ============================================

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createClassApi,
  getClassesApi,
  getClassByIdApi,
  updateClassApi,
  updateClassStatusApi,
} from "./class.api";

import type {
  ClassState,
  CreateClassPayload,
  GetClassesParams,
  UpdateClassPayload,
} from "./class.types";


// ============================================
// INITIAL STATE
// ============================================

const initialState: ClassState = {
  classes: [],

  selectedClass: null,

  loading: false,

  error: null,
};


// ============================================
// CREATE CLASS
// POST /api/v1/academic/classes
// ============================================

export const createClass =
  createAsyncThunk(
    "classes/createClass",

    async (
      data: CreateClassPayload,
      { rejectWithValue }
    ) => {
      try {
        return await createClassApi(
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to create class"
        );
      }
    }
  );


// ============================================
// GET CLASSES
// GET /api/v1/academic/classes
//
// Supports:
// getClasses()
// getClasses({ sessionId })
// ============================================

export const getClasses =
  createAsyncThunk(
    "classes/getClasses",

    async (
      params: GetClassesParams | undefined,
      { rejectWithValue }
    ) => {
      try {
        return await getClassesApi(
          params
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch classes"
        );
      }
    }
  );


// ============================================
// GET CLASS BY ID
// GET /api/v1/academic/classes/:classId
// ============================================

export const getClassById =
  createAsyncThunk(
    "classes/getClassById",

    async (
      classId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getClassByIdApi(
          classId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch class"
        );
      }
    }
  );


// ============================================
// UPDATE CLASS
// PUT /api/v1/academic/classes/:classId
// ============================================

export const updateClass =
  createAsyncThunk(
    "classes/updateClass",

    async (
      {
        classId,
        data,
      }: {
        classId: string;
        data: UpdateClassPayload;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateClassApi(
          classId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update class"
        );
      }
    }
  );


// ============================================
// UPDATE CLASS STATUS
// PATCH /api/v1/academic/classes/:classId/status
// ============================================

export const updateClassStatus =
  createAsyncThunk(
    "classes/updateClassStatus",

    async (
      {
        classId,
        isActive,
      }: {
        classId: string;
        isActive: boolean;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateClassStatusApi(
          classId,
          isActive
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update class status"
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const classSlice = createSlice({
  name: "classes",

  initialState,

  reducers: {
    clearClassError: (state) => {
      state.error = null;
    },

    clearSelectedClass: (
      state
    ) => {
      state.selectedClass = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================================
      // CREATE CLASS
      // ========================================

      .addCase(
        createClass.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createClass.fulfilled,
        (state, action) => {
          state.loading = false;

          state.classes.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createClass.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )


      // ========================================
      // GET CLASSES
      // ========================================

      .addCase(
        getClasses.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getClasses.fulfilled,
        (state, action) => {
          state.loading = false;

          /*
           * Important:
           *
           * Selected session change hone par
           * old session ki classes replace hongi.
           *
           * Isliye append nahi karna.
           */

          state.classes =
            action.payload;
        }
      )

      .addCase(
        getClasses.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )


      // ========================================
      // GET CLASS BY ID
      // ========================================

      .addCase(
        getClassById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getClassById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedClass =
            action.payload;
        }
      )

      .addCase(
        getClassById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )


      // ========================================
      // UPDATE CLASS
      // ========================================

      .addCase(
        updateClass.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateClass.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.classes.findIndex(
              (cls) =>
                cls._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.classes[index] =
              action.payload;
          }

          if (
            state.selectedClass
              ?._id ===
            action.payload._id
          ) {
            state.selectedClass =
              action.payload;
          }
        }
      )

      .addCase(
        updateClass.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      )


      // ========================================
      // UPDATE CLASS STATUS
      // ========================================

      .addCase(
        updateClassStatus.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateClassStatus.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.classes.findIndex(
              (item) =>
                item._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.classes[index] =
              action.payload;
          }

          if (
            state.selectedClass
              ?._id ===
            action.payload._id
          ) {
            state.selectedClass =
              action.payload;
          }
        }
      )

      .addCase(
        updateClassStatus.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );
  },
});


// ============================================
// EXPORTS
// ============================================

export const {
  clearClassError,
  clearSelectedClass,
} = classSlice.actions;

export default classSlice.reducer;