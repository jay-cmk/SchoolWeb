import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getSchoolsApi,
  type School,
} from "./school.api";

interface SchoolState {
  schools: School[];
  loading: boolean;
  error: string | null;
}

const initialState: SchoolState = {
  schools: [],
  loading: false,
  error: null,
};

export const getSchools = createAsyncThunk(
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

const schoolSlice = createSlice({
  name: "schools",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        getSchools.fulfilled,
        (state, action) => {
          state.loading = false;
          state.schools = action.payload;
        }
      )

      .addCase(
        getSchools.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );
  },
});

export default schoolSlice.reducer;