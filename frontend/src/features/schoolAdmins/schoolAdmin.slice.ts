import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSchoolAdminApi,
  getSchoolAdminsApi,
  updateSchoolAdminApi,
  updateSchoolAdminStatusApi,
} from "./schoolAdmin.api";

import type {
  SchoolAdmin,
  CreateSchoolAdminPayload,
  UpdateSchoolAdminPayload,
} from "./schoolAdmin.types";

interface SchoolAdminState {
  admins: SchoolAdmin[];
  loading: boolean;
  error: string | null;
}

const initialState: SchoolAdminState = {
  admins: [],
  loading: false,
  error: null,
};

// CREATE SCHOOL ADMIN
export const createSchoolAdmin = createAsyncThunk<
  SchoolAdmin,
  {
    schoolId: string;
    data: CreateSchoolAdminPayload;
  },
  { rejectValue: string }
>(
  "schoolAdmins/create",
  async (
    { schoolId, data },
    { rejectWithValue }
  ) => {
    try {
      return await createSchoolAdminApi(
        schoolId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create school admin"
      );
    }
  }
);

// GET SCHOOL ADMINS
export const getSchoolAdmins = createAsyncThunk<
  SchoolAdmin[],
  string,
  { rejectValue: string }
>(
  "schoolAdmins/get",
  async (
    schoolId,
    { rejectWithValue }
  ) => {
    try {
      return await getSchoolAdminsApi(
        schoolId
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch admins"
      );
    }
  }
);

// UPDATE SCHOOL ADMIN
export const updateSchoolAdmin = createAsyncThunk<
  SchoolAdmin,
  {
    schoolId: string;
    adminId: string;
    data: UpdateSchoolAdminPayload;
  },
  { rejectValue: string }
>(
  "schoolAdmins/update",
  async (
    {
      schoolId,
      adminId,
      data,
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateSchoolAdminApi(
        schoolId,
        adminId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update admin"
      );
    }
  }
);

// UPDATE SCHOOL ADMIN STATUS
export const updateSchoolAdminStatus = createAsyncThunk<
  SchoolAdmin,
  {
    schoolId: string;
    adminId: string;
    isActive: boolean;
  },
  { rejectValue: string }
>(
  "schoolAdmins/status",
  async (
    {
      schoolId,
      adminId,
      isActive,
    },
    { rejectWithValue }
  ) => {
    try {
      return await updateSchoolAdminStatusApi(
        schoolId,
        adminId,
        isActive
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update admin status"
      );
    }
  }
);

const schoolAdminSlice = createSlice({
  name: "schoolAdmins",

  initialState,

  reducers: {
    clearSchoolAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE SCHOOL ADMIN
      .addCase(createSchoolAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createSchoolAdmin.fulfilled,
        (state, action) => {
          state.loading = false;

          // Newly created admin list में add होगा
          state.admins.unshift(action.payload);
        }
      )

      .addCase(
        createSchoolAdmin.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to create school admin";
        }
      )

      // GET SCHOOL ADMINS
      .addCase(getSchoolAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        getSchoolAdmins.fulfilled,
        (state, action) => {
          state.loading = false;
          state.admins = action.payload;
        }
      )

      .addCase(
        getSchoolAdmins.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch admins";
        }
      )

      // UPDATE SCHOOL ADMIN
      .addCase(updateSchoolAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

     .addCase(
  updateSchoolAdmin.fulfilled,
  (state, action) => {
    state.loading = false;

    const index = state.admins.findIndex(
      (admin) =>
        admin.id === action.payload.id
    );

    if (index !== -1) {
      state.admins[index] = action.payload;
    }
  }
)

      .addCase(
        updateSchoolAdmin.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to update admin";
        }
      )

      // UPDATE SCHOOL ADMIN STATUS
      .addCase(
        updateSchoolAdminStatus.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

    .addCase(
  updateSchoolAdminStatus.fulfilled,
  (state, action) => {
    state.loading = false;

    const index = state.admins.findIndex(
      (admin) =>
        admin.id === action.payload.id
    );

    if (index !== -1) {
      state.admins[index] = action.payload;
    }
  }
)

      .addCase(
        updateSchoolAdminStatus.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to update admin status";
        }
      );
  },
});

export const {
  clearSchoolAdminError,
} = schoolAdminSlice.actions;

export default schoolAdminSlice.reducer;