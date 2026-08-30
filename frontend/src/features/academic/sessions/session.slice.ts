// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   createSessionApi,
//   getSessionsApi,
//   getSessionByIdApi,
//   updateSessionApi,
//   setCurrentSessionApi,
// } from "./session.api";

// import type {
//   AcademicSession,
//   CreateSessionPayload,
//   UpdateSessionPayload,
// } from "./session.types";


// interface SessionState {
//   sessions: AcademicSession[];

//   selectedSession:
//     | AcademicSession
//     | null;

//   loading: boolean;

//   error: string | null;
// }


// const initialState: SessionState = {
//   sessions: [],

//   selectedSession: null,

//   loading: false,

//   error: null,
// };


// // ========================================
// // CREATE SESSION
// // ========================================

// export const createSession =
//   createAsyncThunk(
//     "sessions/createSession",

//     async (
//       data: CreateSessionPayload,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await createSessionApi(
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to create academic session"
//         );
//       }
//     }
//   );


// // ========================================
// // GET ALL SESSIONS
// // ========================================

// export const getSessions =
//   createAsyncThunk(
//     "sessions/getSessions",

//     async (
//       _,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getSessionsApi();
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to fetch academic sessions"
//         );
//       }
//     }
//   );


// // ========================================
// // GET SESSION BY ID
// // ========================================

// export const getSessionById =
//   createAsyncThunk(
//     "sessions/getSessionById",

//     async (
//       sessionId: string,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getSessionByIdApi(
//           sessionId
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to fetch academic session"
//         );
//       }
//     }
//   );


// // ========================================
// // UPDATE SESSION
// // ========================================

// export const updateSession =
//   createAsyncThunk(
//     "sessions/updateSession",

//     async (
//       {
//         sessionId,
//         data,
//       }: {
//         sessionId: string;
//         data: UpdateSessionPayload;
//       },

//       { rejectWithValue }
//     ) => {
//       try {
//         return await updateSessionApi(
//           sessionId,
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to update academic session"
//         );
//       }
//     }
//   );


// // ========================================
// // SET CURRENT SESSION
// // ========================================

// export const setCurrentSession =
//   createAsyncThunk(
//     "sessions/setCurrentSession",

//     async (
//       sessionId: string,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await setCurrentSessionApi(
//           sessionId
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to set current session"
//         );
//       }
//     }
//   );


// // ========================================
// // SLICE
// // ========================================

// const sessionSlice = createSlice({
//   name: "sessions",

//   initialState,

//   reducers: {
//     clearSessionError: (state) => {
//       state.error = null;
//     },

//     clearSelectedSession: (state) => {
//       state.selectedSession = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       // =================================
//       // CREATE
//       // =================================

//       .addCase(
//         createSession.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         createSession.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           state.sessions.unshift(
//             action.payload
//           );
//         }
//       )

//       .addCase(
//         createSession.rejected,
//         (state, action) => {
//           state.loading = false;

//           state.error =
//             action.payload as string;
//         }
//       )


//       // =================================
//       // GET ALL
//       // =================================

//       .addCase(
//         getSessions.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         getSessions.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           state.sessions =
//             action.payload;
//         }
//       )

//       .addCase(
//         getSessions.rejected,
//         (state, action) => {
//           state.loading = false;

//           state.error =
//             action.payload as string;
//         }
//       )


//       // =================================
//       // GET BY ID
//       // =================================

//       .addCase(
//         getSessionById.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         getSessionById.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           state.selectedSession =
//             action.payload;
//         }
//       )

//       .addCase(
//         getSessionById.rejected,
//         (state, action) => {
//           state.loading = false;

//           state.error =
//             action.payload as string;
//         }
//       )


//       // =================================
//       // UPDATE
//       // =================================

//       .addCase(
//         updateSession.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         updateSession.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           const index =
//             state.sessions.findIndex(
//               (session) =>
//                 session._id ===
//                 action.payload._id
//             );

//           if (index !== -1) {
//             state.sessions[index] =
//               action.payload;
//           }

//           if (
//             state.selectedSession?._id ===
//             action.payload._id
//           ) {
//             state.selectedSession =
//               action.payload;
//           }
//         }
//       )

//       .addCase(
//         updateSession.rejected,
//         (state, action) => {
//           state.loading = false;

//           state.error =
//             action.payload as string;
//         }
//       )


//       // =================================
//       // SET CURRENT
//       // =================================

//       .addCase(
//         setCurrentSession.pending,
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )

//       .addCase(
//         setCurrentSession.fulfilled,
//         (state, action) => {
//           state.loading = false;

//           // Pehle sab sessions false
//           state.sessions.forEach(
//             (session) => {
//               session.isCurrent = false;
//             }
//           );

//           // Current session update
//           const index =
//             state.sessions.findIndex(
//               (session) =>
//                 session._id ===
//                 action.payload._id
//             );

//           if (index !== -1) {
//             state.sessions[index] =
//               action.payload;
//           }

//           state.selectedSession =
//             action.payload;
//         }
//       )

//       .addCase(
//         setCurrentSession.rejected,
//         (state, action) => {
//           state.loading = false;

//           state.error =
//             action.payload as string;
//         }
//       );
//   },
// });


// export const {
//   clearSessionError,
//   clearSelectedSession,
// } = sessionSlice.actions;


// export default sessionSlice.reducer;











import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createSessionApi,
  getSessionsApi,
  getSessionByIdApi,
  updateSessionApi,
  setCurrentSessionApi,
} from "./session.api";

import type {
  AcademicSession,
  CreateSessionPayload,
  UpdateSessionPayload,
} from "./session.types";

interface SessionState {
  sessions: AcademicSession[];
  selectedSession: AcademicSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
};

// ========================================
// CREATE SESSION
// ========================================
export const createSession = createAsyncThunk(
  "sessions/createSession",
  async (data: CreateSessionPayload, { rejectWithValue }) => {
    try {
      return await createSessionApi(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create academic session"
      );
    }
  }
);

// ========================================
// GET ALL SESSIONS
// ========================================
export const getSessions = createAsyncThunk(
  "sessions/getSessions",
  async (_, { rejectWithValue }) => {
    try {
      return await getSessionsApi();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch academic sessions"
      );
    }
  }
);

// ========================================
// GET SESSION BY ID
// ========================================
export const getSessionById = createAsyncThunk(
  "sessions/getSessionById",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await getSessionByIdApi(sessionId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch academic session"
      );
    }
  }
);

// ========================================
// UPDATE SESSION
// ========================================
export const updateSession = createAsyncThunk(
  "sessions/updateSession",
  async (
    { sessionId, data }: { sessionId: string; data: UpdateSessionPayload },
    { rejectWithValue }
  ) => {
    try {
      return await updateSessionApi(sessionId, data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update academic session"
      );
    }
  }
);

// ========================================
// SET CURRENT SESSION
// ========================================
export const setCurrentSession = createAsyncThunk(
  "sessions/setCurrentSession",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      return await setCurrentSessionApi(sessionId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to set current session"
      );
    }
  }
);

// ========================================
// SLICE
// ========================================
const sessionSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    clearSelectedSession: (state) => {
      state.selectedSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.unshift(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET ALL
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET BY ID
      .addCase(getSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSession = action.payload;
      })
      .addCase(getSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sessions.findIndex(
          (session) => session._id === action.payload._id
        );
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        if (state.selectedSession?._id === action.payload._id) {
          state.selectedSession = action.payload;
        }
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SET CURRENT
      .addCase(setCurrentSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCurrentSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.forEach((session) => {
          session.isCurrent = false;
        });
        const index = state.sessions.findIndex(
          (session) => session._id === action.payload._id
        );
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
        state.selectedSession = action.payload;
      })
      .addCase(setCurrentSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSessionError, clearSelectedSession } = sessionSlice.actions;
export default sessionSlice.reducer;