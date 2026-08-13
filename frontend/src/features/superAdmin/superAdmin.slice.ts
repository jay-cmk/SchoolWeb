import { createSlice } from "@reduxjs/toolkit";

interface SuperAdminState {
  loading: boolean;
  error: string | null;
}

const initialState: SuperAdminState = {
  loading: false,
  error: null,
};

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {},
});

export default superAdminSlice.reducer;