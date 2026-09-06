import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  bulkPromoteStudentsApi,
  getEnrollmentByIdApi,
  getPromotionCandidatesApi,
  getStudentEnrollmentHistoryApi,
  previewBulkPromotionApi,
  promoteSingleStudentApi,
  updateEnrollmentApi,
} from "./studentPromotion.api";

import type {
  BulkPromotionSummary,
  BulkStudentPromotionRequest,
  PromotionCandidate,
  PromotionCandidateFilters,
  PromotionPreviewResult,
  SingleStudentPromotionRequest,
  StudentEnrollment,
  UpdateStudentEnrollmentData,
} from "./studentPromotion.types";

// =====================================================
// STATE
// =====================================================

interface StudentPromotionState {
  candidates: PromotionCandidate[];

  preview: PromotionPreviewResult | null;

  promotionSummary: BulkPromotionSummary | null;

  enrollmentHistory: StudentEnrollment[];

  selectedEnrollment: StudentEnrollment | null;

  candidatesLoading: boolean;

  previewLoading: boolean;

  promotionLoading: boolean;

  enrollmentHistoryLoading: boolean;

  enrollmentLoading: boolean;

  enrollmentUpdating: boolean;

  error: string | null;
}

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: StudentPromotionState = {
  candidates: [],

  preview: null,

  promotionSummary: null,

  enrollmentHistory: [],

  selectedEnrollment: null,

  candidatesLoading: false,

  previewLoading: false,

  promotionLoading: false,

  enrollmentHistoryLoading: false,

  enrollmentLoading: false,

  enrollmentUpdating: false,

  error: null,
};

// =====================================================
// ERROR HELPER
// =====================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return axiosError.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// =====================================================
// 1. GET PROMOTION CANDIDATES
// =====================================================

export const getPromotionCandidates = createAsyncThunk<
  PromotionCandidate[],
  PromotionCandidateFilters,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/getPromotionCandidates",

  async (filters, { rejectWithValue }) => {
    try {
      return await getPromotionCandidatesApi(filters);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch promotion candidates."),
      );
    }
  },
);

// =====================================================
// 2. PREVIEW BULK PROMOTION
// =====================================================

export const previewBulkPromotion = createAsyncThunk<
  PromotionPreviewResult,
  BulkStudentPromotionRequest,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/previewBulkPromotion",

  async (data, { rejectWithValue }) => {
    try {
      return await previewBulkPromotionApi(data);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to preview student promotion."),
      );
    }
  },
);

// =====================================================
// 3. BULK PROMOTE STUDENTS
// =====================================================

export const bulkPromoteStudents = createAsyncThunk<
  BulkPromotionSummary,
  BulkStudentPromotionRequest,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/bulkPromoteStudents",

  async (data, { rejectWithValue }) => {
    try {
      return await bulkPromoteStudentsApi(data);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to promote students."),
      );
    }
  },
);

// =====================================================
// 4. SINGLE STUDENT PROMOTION
// =====================================================

interface PromoteSingleStudentPayload {
  studentId: string;

  data: SingleStudentPromotionRequest;
}

export const promoteSingleStudent = createAsyncThunk<
  BulkPromotionSummary,
  PromoteSingleStudentPayload,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/promoteSingleStudent",

  async ({ studentId, data }, { rejectWithValue }) => {
    try {
      return await promoteSingleStudentApi(studentId, data);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to promote student."),
      );
    }
  },
);

// =====================================================
// 5. GET STUDENT ENROLLMENT HISTORY
// =====================================================

export const getStudentEnrollmentHistory = createAsyncThunk<
  StudentEnrollment[],
  string,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/getStudentEnrollmentHistory",

  async (studentId, { rejectWithValue }) => {
    try {
      return await getStudentEnrollmentHistoryApi(studentId);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch student enrollment history."),
      );
    }
  },
);

// =====================================================
// 6. GET ENROLLMENT BY ID
// =====================================================

export const getEnrollmentById = createAsyncThunk<
  StudentEnrollment,
  string,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/getEnrollmentById",

  async (enrollmentId, { rejectWithValue }) => {
    try {
      return await getEnrollmentByIdApi(enrollmentId);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch enrollment."),
      );
    }
  },
);

// =====================================================
// 7. UPDATE ENROLLMENT
// =====================================================

interface UpdateEnrollmentPayload {
  enrollmentId: string;

  data: UpdateStudentEnrollmentData;
}

export const updateEnrollment = createAsyncThunk<
  StudentEnrollment,
  UpdateEnrollmentPayload,
  {
    rejectValue: string;
  }
>(
  "studentPromotion/updateEnrollment",

  async ({ enrollmentId, data }, { rejectWithValue }) => {
    try {
      return await updateEnrollmentApi(enrollmentId, data);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update enrollment."),
      );
    }
  },
);

// =====================================================
// SLICE
// =====================================================

const studentPromotionSlice = createSlice({
  name: "studentPromotion",

  initialState,

  reducers: {
    clearPromotionError: (state) => {
      state.error = null;
    },

    clearPromotionPreview: (state) => {
      state.preview = null;
    },

    clearPromotionSummary: (state) => {
      state.promotionSummary = null;
    },

    clearPromotionCandidates: (state) => {
      state.candidates = [];
    },

    clearEnrollmentHistory: (state) => {
      state.enrollmentHistory = [];
    },

    clearSelectedEnrollment: (state) => {
      state.selectedEnrollment = null;
    },

    resetStudentPromotionState: (state) => {
      state.candidates = [];

      state.preview = null;

      state.promotionSummary = null;

      state.enrollmentHistory = [];

      state.selectedEnrollment = null;

      state.candidatesLoading = false;

      state.previewLoading = false;

      state.promotionLoading = false;

      state.enrollmentHistoryLoading = false;

      state.enrollmentLoading = false;

      state.enrollmentUpdating = false;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // 1. GET PROMOTION CANDIDATES
    // =================================================

    builder
      .addCase(getPromotionCandidates.pending, (state) => {
        state.candidatesLoading = true;

        state.error = null;

        state.preview = null;

        state.promotionSummary = null;
      })

      .addCase(getPromotionCandidates.fulfilled, (state, action) => {
        state.candidatesLoading = false;

        state.candidates = action.payload;
      })

      .addCase(getPromotionCandidates.rejected, (state, action) => {
        state.candidatesLoading = false;

        state.error = action.payload ?? "Failed to fetch promotion candidates.";
      });

    // =================================================
    // 2. PREVIEW BULK PROMOTION
    // =================================================

    builder
      .addCase(previewBulkPromotion.pending, (state) => {
        state.previewLoading = true;

        state.error = null;

        state.preview = null;
      })

      .addCase(previewBulkPromotion.fulfilled, (state, action) => {
        state.previewLoading = false;

        state.preview = action.payload;
      })

      .addCase(previewBulkPromotion.rejected, (state, action) => {
        state.previewLoading = false;

        state.error = action.payload ?? "Failed to preview student promotion.";
      });

    // =================================================
    // 3. BULK PROMOTION
    // =================================================

    builder
      .addCase(bulkPromoteStudents.pending, (state) => {
        state.promotionLoading = true;

        state.error = null;

        state.promotionSummary = null;
      })

      .addCase(bulkPromoteStudents.fulfilled, (state, action) => {
        state.promotionLoading = false;

        state.promotionSummary = action.payload;

        state.preview = null;
      })

      .addCase(bulkPromoteStudents.rejected, (state, action) => {
        state.promotionLoading = false;

        state.error = action.payload ?? "Failed to promote students.";
      });

    // =================================================
    // 4. SINGLE STUDENT PROMOTION
    // =================================================

    builder
      .addCase(promoteSingleStudent.pending, (state) => {
        state.promotionLoading = true;

        state.error = null;

        state.promotionSummary = null;
      })

      .addCase(promoteSingleStudent.fulfilled, (state, action) => {
        state.promotionLoading = false;

        state.promotionSummary = action.payload;
      })

      .addCase(promoteSingleStudent.rejected, (state, action) => {
        state.promotionLoading = false;

        state.error = action.payload ?? "Failed to promote student.";
      });

    // =================================================
    // 5. ENROLLMENT HISTORY
    // =================================================

    builder
      .addCase(getStudentEnrollmentHistory.pending, (state) => {
        state.enrollmentHistoryLoading = true;

        state.error = null;
      })

      .addCase(getStudentEnrollmentHistory.fulfilled, (state, action) => {
        state.enrollmentHistoryLoading = false;

        state.enrollmentHistory = action.payload;
      })

      .addCase(getStudentEnrollmentHistory.rejected, (state, action) => {
        state.enrollmentHistoryLoading = false;

        state.error =
          action.payload ?? "Failed to fetch student enrollment history.";
      });

    // =================================================
    // 6. GET ENROLLMENT BY ID
    // =================================================

    builder
      .addCase(getEnrollmentById.pending, (state) => {
        state.enrollmentLoading = true;

        state.error = null;

        state.selectedEnrollment = null;
      })

      .addCase(getEnrollmentById.fulfilled, (state, action) => {
        state.enrollmentLoading = false;

        state.selectedEnrollment = action.payload;
      })

      .addCase(getEnrollmentById.rejected, (state, action) => {
        state.enrollmentLoading = false;

        state.error = action.payload ?? "Failed to fetch enrollment.";
      });

    // =================================================
    // 7. UPDATE ENROLLMENT
    // =================================================

    builder
      .addCase(updateEnrollment.pending, (state) => {
        state.enrollmentUpdating = true;

        state.error = null;
      })

      .addCase(updateEnrollment.fulfilled, (state, action) => {
        state.enrollmentUpdating = false;

        state.selectedEnrollment = action.payload;

        const index = state.enrollmentHistory.findIndex(
          (enrollment) => enrollment._id === action.payload._id,
        );

        if (index !== -1) {
          state.enrollmentHistory[index] = action.payload;
        }
      })

      .addCase(updateEnrollment.rejected, (state, action) => {
        state.enrollmentUpdating = false;

        state.error = action.payload ?? "Failed to update enrollment.";
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearPromotionError,
  clearPromotionPreview,
  clearPromotionSummary,
  clearPromotionCandidates,
  clearEnrollmentHistory,
  clearSelectedEnrollment,
  resetStudentPromotionState,
} = studentPromotionSlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default studentPromotionSlice.reducer;
