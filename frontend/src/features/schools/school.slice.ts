// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   getSchoolsApi,
//   type School,
// } from "./school.api";

// interface SchoolState {
//   schools: School[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: SchoolState = {
//   schools: [],
//   loading: false,
//   error: null,
// };

// export const getSchools = createAsyncThunk(
//   "schools/getSchools",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await getSchoolsApi();
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message ||
//           "Failed to fetch schools"
//       );
//     }
//   }
// );

// const schoolSlice = createSlice({
//   name: "schools",

//   initialState,

//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       .addCase(getSchools.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(
//         getSchools.fulfilled,
//         (state, action) => {
//           state.loading = false;
//           state.schools = action.payload;
//         }
//       )

//       .addCase(
//         getSchools.rejected,
//         (state, action) => {
//           state.loading = false;
//           state.error =
//             action.payload as string;
//         }
//       );
//   },
// });

// export default schoolSlice.reducer;



import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSchoolApi,
  getSchoolsApi,
  getSchoolByIdApi,
  updateSchoolApi,
  updateSchoolStatusApi,
} from "./school.api";

import type {
  School,
  SchoolStatus,
  CreateSchoolPayload,
  UpdateSchoolPayload,
} from "./school.types";

interface SchoolState {
  schools: School[];
  selectedSchool: School | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  schools: [],
  selectedSchool: null,
  loading: false,
  error: null,
};

// CREATE SCHOOL
export const createSchool = createAsyncThunk<
  School,
  CreateSchoolPayload,
  { rejectValue: string }
>(
  "schools/createSchool",
  async (data, { rejectWithValue }) => {
    try {
      return await createSchoolApi(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create school"
      );
    }
  }
);

// GET ALL SCHOOLS
export const getSchools = createAsyncThunk<
  School[],
  void,
  { rejectValue: string }
>(
  "schools/getSchools",
  async (_, { rejectWithValue }) => {
    try {
      return await getSchoolsApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch schools"
      );
    }
  }
);

// GET SINGLE SCHOOL
export const getSchoolById = createAsyncThunk<
  School,
  string,
  { rejectValue: string }
>(
  "schools/getSchoolById",
  async (schoolId, { rejectWithValue }) => {
    try {
      return await getSchoolByIdApi(schoolId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch school"
      );
    }
  }
);

// UPDATE SCHOOL
export const updateSchool = createAsyncThunk<
  School,
  {
    schoolId: string;
    data: UpdateSchoolPayload;
  },
  { rejectValue: string }
>(
  "schools/updateSchool",
  async (
    { schoolId, data },
    { rejectWithValue }
  ) => {
    try {
      return await updateSchoolApi(
        schoolId,
        data
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update school"
      );
    }
  }
);

// UPDATE SCHOOL STATUS
export const updateSchoolStatus = createAsyncThunk<
  School,
  {
    schoolId: string;
    status: SchoolStatus;
  },
  { rejectValue: string }
>(
  "schools/updateStatus",
  async (
    { schoolId, status },
    { rejectWithValue }
  ) => {
    try {
      return await updateSchoolStatusApi(
        schoolId,
        status
      );
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update school status"
      );
    }
  }
);

const schoolSlice = createSlice({
  name: "schools",

  initialState,

  reducers: {
    clearSchoolError: (state) => {
      state.error = null;
    },

    clearSelectedSchool: (state) => {
      state.selectedSchool = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE SCHOOL
      .addCase(createSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createSchool.fulfilled, (state, action) => {
        state.loading = false;

        // Newly created school list में add होगा
        state.schools.unshift(action.payload);

        // School Admin create करने के लिए इसकी _id मिलेगी
        state.selectedSchool = action.payload;
      })

      .addCase(createSchool.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to create school";
      })

      // GET ALL SCHOOLS
      .addCase(getSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload;
      })

      .addCase(getSchools.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch schools";
      })

      // GET SINGLE SCHOOL
      .addCase(getSchoolById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchool = action.payload;
      })

      .addCase(getSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to fetch school";
      })

      // UPDATE SCHOOL
      .addCase(updateSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateSchool.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchool = action.payload;

        const index = state.schools.findIndex(
          (school) =>
            school._id === action.payload._id
        );

        if (index !== -1) {
          state.schools[index] = action.payload;
        }
      })

      .addCase(updateSchool.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Failed to update school";
      })

      // UPDATE SCHOOL STATUS
      .addCase(updateSchoolStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        updateSchoolStatus.fulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedSchool = action.payload;

          const index = state.schools.findIndex(
            (school) =>
              school._id === action.payload._id
          );

          if (index !== -1) {
            state.schools[index] = action.payload;
          }
        }
      )

      .addCase(
        updateSchoolStatus.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to update school status";
        }
      );
  },
});

export const {
  clearSchoolError,
  clearSelectedSchool,
} = schoolSlice.actions;

export default schoolSlice.reducer;