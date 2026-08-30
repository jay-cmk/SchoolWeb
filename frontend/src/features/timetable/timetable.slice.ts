import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import type {
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  createTimetableApi,
  getTimetableApi,
  getTimetableByIdApi,
  updateTimetableApi,
  deleteTimetableApi,
  copyTimetableApi,
  getApiErrorMessage,
} from "./timetable.api";

import type {
  Timetable,
  CreateTimetableData,
  UpdateTimetableData,
  TimetableFilters,
  CopyTimetableData,
  CopyTimetableResult,
} from "./timetable.types";


// ============================================
// STATE
// ============================================

interface TimetableState {
  timetable: Timetable[];

  selectedTimetable:
    Timetable | null;

  loading: boolean;

  error:
    string | null;

  copyResult:
    CopyTimetableResult | null;
}


// ============================================
// INITIAL STATE
// ============================================

const initialState:
  TimetableState = {

  timetable: [],

  selectedTimetable: null,

  loading: false,

  error: null,

  copyResult: null,
};


// ============================================
// CREATE
// ============================================

export const createTimetable =
  createAsyncThunk<
    Timetable,
    CreateTimetableData,
    {
      rejectValue: string;
    }
  >(
    "timetable/create",

    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await createTimetableApi(
          data
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// GET ALL
// ============================================

export const getTimetable =
  createAsyncThunk<
    Timetable[],
    TimetableFilters | undefined,
    {
      rejectValue: string;
    }
  >(
    "timetable/getAll",

    async (
      filters,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getTimetableApi(
          filters ?? {}
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// GET ONE
// ============================================

export const getTimetableById =
  createAsyncThunk<
    Timetable,
    string,
    {
      rejectValue: string;
    }
  >(
    "timetable/getById",

    async (
      timetableId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await getTimetableByIdApi(
          timetableId
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// UPDATE
// ============================================

export const updateTimetable =
  createAsyncThunk<
    Timetable,
    {
      timetableId: string;
      data:
        UpdateTimetableData;
    },
    {
      rejectValue: string;
    }
  >(
    "timetable/update",

    async (
      {
        timetableId,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await updateTimetableApi(
          timetableId,
          data
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// DELETE
// ============================================

export const deleteTimetable =
  createAsyncThunk<
    string,
    string,
    {
      rejectValue: string;
    }
  >(
    "timetable/delete",

    async (
      timetableId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await deleteTimetableApi(
          timetableId
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// COPY
// ============================================

export const copyTimetable =
  createAsyncThunk<
    CopyTimetableResult,
    CopyTimetableData,
    {
      rejectValue: string;
    }
  >(
    "timetable/copy",

    async (
      data,
      {
        rejectWithValue,
      }
    ) => {
      try {
        return await copyTimetableApi(
          data
        );

      } catch (error) {
        return rejectWithValue(
          getApiErrorMessage(
            error
          )
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const timetableSlice =
  createSlice({
    name: "timetable",

    initialState,

    reducers: {

      // ========================================
      // CLEAR ERROR
      // ========================================

      clearTimetableError: (
        state
      ) => {
        state.error =
          null;
      },


      // ========================================
      // CLEAR SELECTED
      // ========================================

      clearSelectedTimetable: (
        state
      ) => {
        state.selectedTimetable =
          null;
      },


      // ========================================
      // CLEAR COPY RESULT
      // ========================================

      clearCopyResult: (
        state
      ) => {
        state.copyResult =
          null;
      },


      // ========================================
      // SET SELECTED
      // ========================================

      setSelectedTimetable: (
        state,
        action:
          PayloadAction<
            Timetable | null
          >
      ) => {
        state.selectedTimetable =
          action.payload;
      },
    },


    // ==========================================
    // EXTRA REDUCERS
    // ==========================================

    extraReducers:
      (builder) => {

        // ======================================
        // CREATE
        // ======================================

        builder
          .addCase(
            createTimetable.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            createTimetable.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.timetable.push(
                action.payload
              );

              state.selectedTimetable =
                action.payload;
            }
          )

          .addCase(
            createTimetable.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to create timetable period";
            }
          );


        // ======================================
        // GET ALL
        // ======================================

        builder
          .addCase(
            getTimetable.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            getTimetable.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.timetable =
                action.payload;
            }
          )

          .addCase(
            getTimetable.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to fetch timetable";
            }
          );


        // ======================================
        // GET ONE
        // ======================================

        builder
          .addCase(
            getTimetableById.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            getTimetableById.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.selectedTimetable =
                action.payload;
            }
          )

          .addCase(
            getTimetableById.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to fetch timetable period";
            }
          );


        // ======================================
        // UPDATE
        // ======================================

        builder
          .addCase(
            updateTimetable.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            updateTimetable.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;


              const index =
                state.timetable
                  .findIndex(
                    (item) =>
                      item._id ===
                      action.payload._id
                  );


              if (
                index !== -1
              ) {
                state.timetable[
                  index
                ] =
                  action.payload;
              }


              state.selectedTimetable =
                action.payload;
            }
          )

          .addCase(
            updateTimetable.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to update timetable period";
            }
          );


        // ======================================
        // DELETE
        // ======================================

        builder
          .addCase(
            deleteTimetable.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            deleteTimetable.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;


              state.timetable =
                state.timetable
                  .filter(
                    (item) =>
                      item._id !==
                      action.payload
                  );


              if (
                state
                  .selectedTimetable
                  ?._id ===
                action.payload
              ) {
                state.selectedTimetable =
                  null;
              }
            }
          )

          .addCase(
            deleteTimetable.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to delete timetable period";
            }
          );


        // ======================================
        // COPY
        // ======================================

        builder
          .addCase(
            copyTimetable.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;

              state.copyResult =
                null;
            }
          )

          .addCase(
            copyTimetable.fulfilled,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.copyResult =
                action.payload;
            }
          )

          .addCase(
            copyTimetable.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.payload ??
                "Failed to copy timetable";
            }
          );
      },
  });


// ============================================
// ACTIONS
// ============================================

export const {
  clearTimetableError,
  clearSelectedTimetable,
  clearCopyResult,
  setSelectedTimetable,
} = timetableSlice.actions;


// ============================================
// REDUCER
// ============================================

export default
  timetableSlice.reducer;