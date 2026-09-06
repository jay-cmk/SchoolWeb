import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface SessionSelectionState {
  selectedSessionId: string | null;
}

const getInitialSelectedSessionId = (): string | null => {
  const savedSessionId =
    localStorage.getItem("selectedSessionId");

  return savedSessionId || null;
};

const initialState: SessionSelectionState = {
  selectedSessionId:
    getInitialSelectedSessionId(),
};

const sessionSelectionSlice =
  createSlice({
    name: "sessionSelection",

    initialState,

    reducers: {
      setSelectedSessionId: (
        state,
        action: PayloadAction<string>
      ) => {
        state.selectedSessionId =
          action.payload;

        localStorage.setItem(
          "selectedSessionId",
          action.payload
        );
      },

      clearSelectedSessionId: (
        state
      ) => {
        state.selectedSessionId =
          null;

        localStorage.removeItem(
          "selectedSessionId"
        );
      },
    },
  });

export const {
  setSelectedSessionId,
  clearSelectedSessionId,
} =
  sessionSelectionSlice.actions;

export default
  sessionSelectionSlice.reducer;