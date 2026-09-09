import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getMyTeacherAttendanceApi,
  getSingleTeacherAttendanceSummaryApi,
  getTeacherAttendanceApi,
  getTeacherAttendanceMonthlySummaryApi,
  markBulkTeacherAttendanceApi,
  updateTeacherAttendanceApi,
} from "./teacherAttendance.api";

import type {
  BulkTeacherAttendancePayload,
  GetTeacherAttendanceParams,
  MyTeacherAttendanceParams,
  SingleTeacherAttendanceSummaryData,
  TeacherAttendanceData,
  TeacherAttendanceMonthlyParams,
  TeacherAttendanceMonthlySummaryData,
  TeacherAttendanceState,
  UpdateTeacherAttendancePayload,
} from "./teacherAttendance.types";

const initialState: TeacherAttendanceState = {
  attendance: [],
  monthlySummary: null,
  selectedTeacherSummary: null,
  myAttendance: null,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return apiError.response?.data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const markBulkTeacherAttendance = createAsyncThunk<
  TeacherAttendanceData[],
  BulkTeacherAttendancePayload,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/markBulk",
  async (data, { rejectWithValue }) => {
    try {
      return await markBulkTeacherAttendanceApi(data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to save teacher attendance."),
      );
    }
  },
);

export const getTeacherAttendance = createAsyncThunk<
  TeacherAttendanceData[],
  GetTeacherAttendanceParams | undefined,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/getAll",
  async (params, { rejectWithValue }) => {
    try {
      return await getTeacherAttendanceApi(params);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch teacher attendance."),
      );
    }
  },
);

interface UpdateTeacherAttendanceThunkPayload {
  attendanceId: string;
  data: UpdateTeacherAttendancePayload;
}

export const updateTeacherAttendance = createAsyncThunk<
  TeacherAttendanceData,
  UpdateTeacherAttendanceThunkPayload,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/update",
  async ({ attendanceId, data }, { rejectWithValue }) => {
    try {
      return await updateTeacherAttendanceApi(attendanceId, data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update teacher attendance."),
      );
    }
  },
);

export const getTeacherAttendanceMonthlySummary = createAsyncThunk<
  TeacherAttendanceMonthlySummaryData,
  TeacherAttendanceMonthlyParams,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/getMonthlySummary",
  async (params, { rejectWithValue }) => {
    try {
      return await getTeacherAttendanceMonthlySummaryApi(params);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch monthly attendance summary."),
      );
    }
  },
);

interface SingleTeacherSummaryThunkPayload {
  teacherId: string;
  month: number;
  year: number;
}

export const getSingleTeacherAttendanceSummary = createAsyncThunk<
  SingleTeacherAttendanceSummaryData,
  SingleTeacherSummaryThunkPayload,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/getTeacherSummary",
  async ({ teacherId, month, year }, { rejectWithValue }) => {
    try {
      return await getSingleTeacherAttendanceSummaryApi(
        teacherId,
        month,
        year,
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch teacher attendance summary."),
      );
    }
  },
);

export const getMyTeacherAttendance = createAsyncThunk<
  SingleTeacherAttendanceSummaryData,
  MyTeacherAttendanceParams | undefined,
  {
    rejectValue: string;
  }
>(
  "teacherAttendance/getMine",
  async (params, { rejectWithValue }) => {
    try {
      return await getMyTeacherAttendanceApi(params);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch my attendance."),
      );
    }
  },
);

const teacherAttendanceSlice = createSlice({
  name: "teacherAttendance",
  initialState,
  reducers: {
    clearTeacherAttendanceError: (state) => {
      state.error = null;
    },

    clearTeacherAttendanceSuccess: (state) => {
      state.successMessage = null;
    },

    clearTeacherAttendanceList: (state) => {
      state.attendance = [];
    },

    clearTeacherAttendanceMonthlySummary: (state) => {
      state.monthlySummary = null;
    },

    clearSelectedTeacherAttendanceSummary: (state) => {
      state.selectedTeacherSummary = null;
    },

    clearMyTeacherAttendance: (state) => {
      state.myAttendance = null;
    },

    resetTeacherAttendanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(markBulkTeacherAttendance.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(markBulkTeacherAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.attendance = action.payload;
        state.successMessage = "Teacher attendance saved successfully.";
      })
      .addCase(markBulkTeacherAttendance.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? "Failed to save teacher attendance.";
      });

    builder
      .addCase(getTeacherAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(getTeacherAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch teacher attendance.";
      });

    builder
      .addCase(updateTeacherAttendance.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateTeacherAttendance.fulfilled, (state, action) => {
        state.saving = false;

        const index = state.attendance.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.attendance[index] = action.payload;
        } else {
          state.attendance.unshift(action.payload);
        }

        state.successMessage = "Teacher attendance updated successfully.";
      })
      .addCase(updateTeacherAttendance.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? "Failed to update teacher attendance.";
      });

    builder
      .addCase(getTeacherAttendanceMonthlySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTeacherAttendanceMonthlySummary.fulfilled,
        (state, action) => {
          state.loading = false;
          state.monthlySummary = action.payload;
        },
      )
      .addCase(
        getTeacherAttendanceMonthlySummary.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ?? "Failed to fetch monthly attendance summary.";
        },
      );

    builder
      .addCase(getSingleTeacherAttendanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTeacherSummary = null;
      })
      .addCase(
        getSingleTeacherAttendanceSummary.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedTeacherSummary = action.payload;
        },
      )
      .addCase(
        getSingleTeacherAttendanceSummary.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ?? "Failed to fetch teacher attendance summary.";
        },
      );

    builder
      .addCase(getMyTeacherAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.myAttendance = null;
      })
      .addCase(getMyTeacherAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendance = action.payload;
      })
      .addCase(getMyTeacherAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch my attendance.";
      });
  },
});

export const {
  clearTeacherAttendanceError,
  clearTeacherAttendanceSuccess,
  clearTeacherAttendanceList,
  clearTeacherAttendanceMonthlySummary,
  clearSelectedTeacherAttendanceSummary,
  clearMyTeacherAttendance,
  resetTeacherAttendanceState,
} = teacherAttendanceSlice.actions;

export default teacherAttendanceSlice.reducer;

