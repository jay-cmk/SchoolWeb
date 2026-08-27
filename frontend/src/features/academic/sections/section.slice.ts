import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSectionApi,
  getSectionsApi,
  getSectionByIdApi,
  updateSectionApi,
  updateSectionStatusApi,
} from "./section.api";

import type {
  SectionState,
  CreateSectionPayload,
  UpdateSectionPayload,
  GetSectionsParams,
} from "./section.types";


const initialState: SectionState = {
  sections: [],

  selectedSection: null,

  loading: false,

  error: null,
};


// ============================================
// CREATE
// ============================================

export const createSection =
  createAsyncThunk(
    "sections/createSection",

    async (
      data: CreateSectionPayload,
      { rejectWithValue }
    ) => {
      try {
        return await createSectionApi(
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create section"
        );
      }
    }
  );


// ============================================
// GET ALL
// ============================================

export const getSections =
  createAsyncThunk(
    "sections/getSections",

    async (
      params:
        | GetSectionsParams
        | undefined,
      { rejectWithValue }
    ) => {
      try {
        return await getSectionsApi(
          params
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch sections"
        );
      }
    }
  );


// ============================================
// GET BY ID
// ============================================

export const getSectionById =
  createAsyncThunk(
    "sections/getSectionById",

    async (
      sectionId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getSectionByIdApi(
          sectionId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch section"
        );
      }
    }
  );


// ============================================
// UPDATE
// ============================================

export const updateSection =
  createAsyncThunk(
    "sections/updateSection",

    async (
      {
        sectionId,
        data,
      }: {
        sectionId: string;
        data: UpdateSectionPayload;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateSectionApi(
          sectionId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update section"
        );
      }
    }
  );


// ============================================
// STATUS
// ============================================

export const updateSectionStatus =
  createAsyncThunk(
    "sections/updateSectionStatus",

    async (
      {
        sectionId,
        isActive,
      }: {
        sectionId: string;
        isActive: boolean;
      },

      { rejectWithValue }
    ) => {
      try {
        return await updateSectionStatusApi(
          sectionId,
          isActive
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update section status"
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const sectionSlice =
  createSlice({
    name: "sections",

    initialState,

    reducers: {
      clearSectionError: (
        state
      ) => {
        state.error = null;
      },

      clearSelectedSection: (
        state
      ) => {
        state.selectedSection =
          null;
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        // CREATE
        .addCase(
          createSection.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createSection.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.sections.push(
              action.payload
            );
          }
        )

        .addCase(
          createSection.rejected,
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
          getSections.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getSections.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.sections =
              action.payload;
          }
        )

        .addCase(
          getSections.rejected,
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
          getSectionById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getSectionById.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.selectedSection =
              action.payload;
          }
        )

        .addCase(
          getSectionById.rejected,
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
          updateSection.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateSection.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const index =
              state.sections.findIndex(
                (section) =>
                  section._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.sections[index] =
                action.payload;
            }

            if (
              state.selectedSection
                ?._id ===
              action.payload._id
            ) {
              state.selectedSection =
                action.payload;
            }
          }
        )

        .addCase(
          updateSection.rejected,
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
          updateSectionStatus.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateSectionStatus.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const index =
              state.sections.findIndex(
                (section) =>
                  section._id ===
                  action.payload._id
              );

            if (index !== -1) {
              state.sections[index] =
                action.payload;
            }

            if (
              state.selectedSection
                ?._id ===
              action.payload._id
            ) {
              state.selectedSection =
                action.payload;
            }
          }
        )

        .addCase(
          updateSectionStatus.rejected,
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
  clearSectionError,
  clearSelectedSection,
} = sectionSlice.actions;


export default sectionSlice.reducer;