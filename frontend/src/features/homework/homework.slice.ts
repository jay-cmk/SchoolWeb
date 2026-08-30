import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
  CreateHomeworkData,
  Homework,
  HomeworkFilters,
  HomeworkPagination,
  HomeworkStats,
  HomeworkStatus,
  UpdateHomeworkData,
} from "./homework.types";

import {
  changeHomeworkStatusApi,
  createHomeworkApi,
  deleteHomeworkApi,
  getHomeworkByIdApi,
  getHomeworksApi,
  getHomeworkStatsApi,
  updateHomeworkApi,
} from "./homework.api";


// ======================================================
// STATE
// ======================================================

interface HomeworkState {
  homeworks: Homework[];

  selectedHomework: Homework | null;

  stats: HomeworkStats | null;

  pagination: HomeworkPagination | null;

  loading: boolean;

  error: string | null;
}


const initialState: HomeworkState = {
  homeworks: [],

  selectedHomework: null,

  stats: null,

  pagination: null,

  loading: false,

  error: null,
};


// ======================================================
// GET HOMEWORK LIST
// ======================================================

export const getHomeworks = createAsyncThunk(
  "homework/getHomeworks",

  async (
    filters: HomeworkFilters | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await getHomeworksApi(
        filters
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch homework"
      );
    }
  }
);


// ======================================================
// GET HOMEWORK STATS
// ======================================================

export const getHomeworkStats = createAsyncThunk(
  "homework/getHomeworkStats",

  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      return await getHomeworkStatsApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch homework stats"
      );
    }
  }
);


// ======================================================
// GET HOMEWORK BY ID
// ======================================================

export const getHomeworkById = createAsyncThunk(
  "homework/getHomeworkById",

  async (
    homeworkId: string,
    { rejectWithValue }
  ) => {
    try {
      return await getHomeworkByIdApi(
        homeworkId
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch homework details"
      );
    }
  }
);


// ======================================================
// CREATE HOMEWORK
// ======================================================

export const createHomework = createAsyncThunk(
  "homework/createHomework",

  async (
    data: CreateHomeworkData,
    { rejectWithValue }
  ) => {
    try {
      return await createHomeworkApi(
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create homework"
      );
    }
  }
);


// ======================================================
// UPDATE HOMEWORK
// ======================================================

export const updateHomework = createAsyncThunk(
  "homework/updateHomework",

  async (
    {
      homeworkId,
      data,
    }: {
      homeworkId: string;
      data: UpdateHomeworkData;
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateHomeworkApi(
        homeworkId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update homework"
      );
    }
  }
);


// ======================================================
// CHANGE HOMEWORK STATUS
// ======================================================

export const changeHomeworkStatus =
  createAsyncThunk(
    "homework/changeHomeworkStatus",

    async (
      {
        homeworkId,
        status,
      }: {
        homeworkId: string;
        status: HomeworkStatus;
      },
      { rejectWithValue }
    ) => {
      try {
        return await changeHomeworkStatusApi(
          homeworkId,
          status
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to change homework status"
        );
      }
    }
  );


// ======================================================
// DELETE HOMEWORK
// ======================================================

export const deleteHomework = createAsyncThunk(
  "homework/deleteHomework",

  async (
    homeworkId: string,
    { rejectWithValue }
  ) => {
    try {
      await deleteHomeworkApi(
        homeworkId
      );

      return homeworkId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete homework"
      );
    }
  }
);


// ======================================================
// SLICE
// ======================================================

const homeworkSlice = createSlice({
  name: "homework",

  initialState,

  reducers: {
    clearHomeworkError: (
      state
    ) => {
      state.error = null;
    },

    clearSelectedHomework: (
      state
    ) => {
      state.selectedHomework =
        null;
    },
  },

  extraReducers: (builder) => {

    // ==================================================
    // GET HOMEWORK LIST
    // ==================================================

    builder
      .addCase(
        getHomeworks.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getHomeworks.fulfilled,
        (state, action) => {
          state.loading = false;

          state.homeworks =
            action.payload.homeworks;

          state.pagination =
            action.payload.pagination ??
            null;
        }
      )

      .addCase(
        getHomeworks.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // GET HOMEWORK STATS
    // ==================================================

    builder
      .addCase(
        getHomeworkStats.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        getHomeworkStats.fulfilled,
        (state, action) => {
          state.stats =
            action.payload;
        }
      )

      .addCase(
        getHomeworkStats.rejected,
        (state, action) => {
          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // GET HOMEWORK BY ID
    // ==================================================

    builder
      .addCase(
        getHomeworkById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getHomeworkById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedHomework =
            action.payload;
        }
      )

      .addCase(
        getHomeworkById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // CREATE HOMEWORK
    // ==================================================

    builder
      .addCase(
        createHomework.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createHomework.fulfilled,
        (state, action) => {
          state.loading = false;

          state.homeworks.unshift(
            action.payload
          );
        }
      )

      .addCase(
        createHomework.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // UPDATE HOMEWORK
    // ==================================================

    builder
      .addCase(
        updateHomework.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateHomework.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.homeworks.findIndex(
              (homework) =>
                homework._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.homeworks[index] =
              action.payload;
          }

          if (
            state.selectedHomework?._id ===
            action.payload._id
          ) {
            state.selectedHomework =
              action.payload;
          }
        }
      )

      .addCase(
        updateHomework.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // CHANGE HOMEWORK STATUS
    // ==================================================

    builder
      .addCase(
        changeHomeworkStatus.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        changeHomeworkStatus.fulfilled,
        (state, action) => {
          state.loading = false;

          const index =
            state.homeworks.findIndex(
              (homework) =>
                homework._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.homeworks[index] =
              action.payload;
          }

          if (
            state.selectedHomework?._id ===
            action.payload._id
          ) {
            state.selectedHomework =
              action.payload;
          }
        }
      )

      .addCase(
        changeHomeworkStatus.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload as string;
        }
      );


    // ==================================================
    // DELETE HOMEWORK
    // ==================================================

    builder
      .addCase(
        deleteHomework.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteHomework.fulfilled,
        (state, action) => {
          state.loading = false;

          state.homeworks =
            state.homeworks.filter(
              (homework) =>
                homework._id !==
                action.payload
            );

          if (
            state.selectedHomework?._id ===
            action.payload
          ) {
            state.selectedHomework =
              null;
          }
        }
      )

      .addCase(
        deleteHomework.rejected,
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
  clearHomeworkError,
  clearSelectedHomework,
} = homeworkSlice.actions;


// ======================================================
// REDUCER
// ======================================================

export default homeworkSlice.reducer;