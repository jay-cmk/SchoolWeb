// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   createTeacherApi,
//   getTeachersApi,
//   getTeacherByIdApi,
//   updateTeacherApi,
//   updateTeacherStatusApi,
// } from "./teacher.api";

// import type {
//   TeacherState,
//   CreateTeacherPayload,
//   UpdateTeacherPayload,
//   GetTeachersParams,
// } from "./teacher.types";


// // ============================================
// // INITIAL STATE
// // ============================================

// const initialState: TeacherState = {
//   teachers: [],

//   selectedTeacher: null,

//   loading: false,

//   error: null,
// };


// // ============================================
// // CREATE TEACHER
// // ============================================

// export const createTeacher =
//   createAsyncThunk(
//     "teachers/createTeacher",

//     async (
//       data: CreateTeacherPayload,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await createTeacherApi(
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to create teacher"
//         );
//       }
//     }
//   );


// // ============================================
// // GET ALL TEACHERS
// // ============================================

// export const getTeachers =
//   createAsyncThunk(
//     "teachers/getTeachers",

//     async (
//       params:
//         | GetTeachersParams
//         | undefined,

//       { rejectWithValue }
//     ) => {
//       try {
//         return await getTeachersApi(
//           params
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to fetch teachers"
//         );
//       }
//     }
//   );


// // ============================================
// // GET TEACHER BY ID
// // ============================================

// export const getTeacherById =
//   createAsyncThunk(
//     "teachers/getTeacherById",

//     async (
//       teacherId: string,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getTeacherByIdApi(
//           teacherId
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to fetch teacher"
//         );
//       }
//     }
//   );


// // ============================================
// // UPDATE TEACHER
// // ============================================

// export const updateTeacher =
//   createAsyncThunk(
//     "teachers/updateTeacher",

//     async (
//       {
//         teacherId,
//         data,
//       }: {
//         teacherId: string;

//         data: UpdateTeacherPayload;
//       },

//       { rejectWithValue }
//     ) => {
//       try {
//         return await updateTeacherApi(
//           teacherId,
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to update teacher"
//         );
//       }
//     }
//   );


// // ============================================
// // UPDATE TEACHER STATUS
// // ============================================

// export const updateTeacherStatus =
//   createAsyncThunk(
//     "teachers/updateTeacherStatus",

//     async (
//       {
//         teacherId,
//         isActive,
//       }: {
//         teacherId: string;

//         isActive: boolean;
//       },

//       { rejectWithValue }
//     ) => {
//       try {
//         return await updateTeacherStatusApi(
//           teacherId,
//           isActive
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             "Failed to update teacher status"
//         );
//       }
//     }
//   );


// // ============================================
// // SLICE
// // ============================================

// const teacherSlice =
//   createSlice({
//     name: "teachers",

//     initialState,

//     reducers: {
//       clearTeacherError: (
//         state
//       ) => {
//         state.error = null;
//       },

//       clearSelectedTeacher: (
//         state
//       ) => {
//         state.selectedTeacher =
//           null;
//       },
//     },

//     extraReducers: (
//       builder
//     ) => {
//       builder

//         // ======================================
//         // CREATE
//         // ======================================

//         .addCase(
//           createTeacher.pending,
//           (state) => {
//             state.loading = true;

//             state.error = null;
//           }
//         )

//         .addCase(
//           createTeacher.fulfilled,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.teachers.push(
//               action.payload
//             );
//           }
//         )

//         .addCase(
//           createTeacher.rejected,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.error =
//               action.payload as string;
//           }
//         )


//         // ======================================
//         // GET ALL
//         // ======================================

//         .addCase(
//           getTeachers.pending,
//           (state) => {
//             state.loading = true;

//             state.error = null;
//           }
//         )

//         .addCase(
//           getTeachers.fulfilled,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.teachers =
//               action.payload;
//           }
//         )

//         .addCase(
//           getTeachers.rejected,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.error =
//               action.payload as string;
//           }
//         )


//         // ======================================
//         // GET BY ID
//         // ======================================

//         .addCase(
//           getTeacherById.pending,
//           (state) => {
//             state.loading = true;

//             state.error = null;
//           }
//         )

//         .addCase(
//           getTeacherById.fulfilled,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.selectedTeacher =
//               action.payload;
//           }
//         )

//         .addCase(
//           getTeacherById.rejected,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.error =
//               action.payload as string;
//           }
//         )


//         // ======================================
//         // UPDATE
//         // ======================================

//         .addCase(
//           updateTeacher.pending,
//           (state) => {
//             state.loading = true;

//             state.error = null;
//           }
//         )

//         .addCase(
//           updateTeacher.fulfilled,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;


//             const index =
//               state.teachers.findIndex(
//                 (teacher) =>
//                   teacher._id ===
//                   action.payload._id
//               );


//             if (
//               index !== -1
//             ) {
//               state.teachers[index] =
//                 action.payload;
//             }


//             if (
//               state.selectedTeacher
//                 ?._id ===
//               action.payload._id
//             ) {
//               state.selectedTeacher =
//                 action.payload;
//             }
//           }
//         )

//         .addCase(
//           updateTeacher.rejected,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.error =
//               action.payload as string;
//           }
//         )


//         // ======================================
//         // STATUS
//         // ======================================

//         .addCase(
//           updateTeacherStatus.pending,
//           (state) => {
//             state.loading = true;

//             state.error = null;
//           }
//         )

//         .addCase(
//           updateTeacherStatus.fulfilled,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;


//             const index =
//               state.teachers.findIndex(
//                 (teacher) =>
//                   teacher._id ===
//                   action.payload._id
//               );


//             if (
//               index !== -1
//             ) {
//               state.teachers[index] =
//                 action.payload;
//             }


//             if (
//               state.selectedTeacher
//                 ?._id ===
//               action.payload._id
//             ) {
//               state.selectedTeacher =
//                 action.payload;
//             }
//           }
//         )

//         .addCase(
//           updateTeacherStatus.rejected,
//           (
//             state,
//             action
//           ) => {
//             state.loading = false;

//             state.error =
//               action.payload as string;
//           }
//         );
//     },
//   });


// // ============================================
// // ACTIONS
// // ============================================

// export const {
//   clearTeacherError,
//   clearSelectedTeacher,
// } = teacherSlice.actions;


// // ============================================
// // REDUCER
// // ============================================

// export default teacherSlice.reducer;







import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createTeacherApi,
  getTeachersApi,
  getMyTeacherProfileApi,
  getTeacherByIdApi,
  updateTeacherApi,
  updateTeacherStatusApi,
} from "./teacher.api";

import type {
  TeacherState,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  GetTeachersParams,
} from "./teacher.types";


// ============================================
// INITIAL STATE
// ============================================

const initialState: TeacherState = {
  teachers: [],

  selectedTeacher: null,

  // Logged-in Teacher own profile
  myTeacher: null,

  loading: false,

  error: null,
};


// ============================================
// CREATE TEACHER
//
// SCHOOL_ADMIN
// ============================================

export const createTeacher =
  createAsyncThunk(
    "teachers/createTeacher",

    async (
      data: CreateTeacherPayload,
      { rejectWithValue }
    ) => {

      try {

        return await createTeacherApi(
          data
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to create teacher"
        );
      }
    }
  );


// ============================================
// GET ALL TEACHERS
//
// SCHOOL_ADMIN
// ============================================

export const getTeachers =
  createAsyncThunk(
    "teachers/getTeachers",

    async (
      params:
        | GetTeachersParams
        | undefined,

      { rejectWithValue }
    ) => {

      try {

        return await getTeachersApi(
          params
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch teachers"
        );
      }
    }
  );


// ============================================
// GET MY TEACHER PROFILE
//
// TEACHER
// GET /teachers/me
// ============================================

export const getMyTeacherProfile =
  createAsyncThunk(
    "teachers/getMyTeacherProfile",

    async (
      _,
      { rejectWithValue }
    ) => {

      try {

        return await getMyTeacherProfileApi();

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch teacher profile"
        );
      }
    }
  );


// ============================================
// GET TEACHER BY ID
//
// SCHOOL_ADMIN
// ============================================

export const getTeacherById =
  createAsyncThunk(
    "teachers/getTeacherById",

    async (
      teacherId: string,
      { rejectWithValue }
    ) => {

      try {

        return await getTeacherByIdApi(
          teacherId
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch teacher"
        );
      }
    }
  );


// ============================================
// UPDATE TEACHER
//
// SCHOOL_ADMIN
// ============================================

export const updateTeacher =
  createAsyncThunk(
    "teachers/updateTeacher",

    async (
      {
        teacherId,
        data,
      }: {
        teacherId: string;
        data: UpdateTeacherPayload;
      },

      { rejectWithValue }
    ) => {

      try {

        return await updateTeacherApi(
          teacherId,
          data
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update teacher"
        );
      }
    }
  );


// ============================================
// UPDATE TEACHER STATUS
//
// SCHOOL_ADMIN
// ============================================

export const updateTeacherStatus =
  createAsyncThunk(
    "teachers/updateTeacherStatus",

    async (
      {
        teacherId,
        isActive,
      }: {
        teacherId: string;
        isActive: boolean;
      },

      { rejectWithValue }
    ) => {

      try {

        return await updateTeacherStatusApi(
          teacherId,
          isActive
        );

      } catch (error: any) {

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update teacher status"
        );
      }
    }
  );


// ============================================
// SLICE
// ============================================

const teacherSlice =
  createSlice({

    name: "teachers",

    initialState,

    reducers: {

      clearTeacherError: (
        state
      ) => {

        state.error = null;
      },


      clearSelectedTeacher: (
        state
      ) => {

        state.selectedTeacher =
          null;
      },


      clearMyTeacher: (
        state
      ) => {

        state.myTeacher =
          null;
      },
    },


    extraReducers: (
      builder
    ) => {

      builder

        // ======================================
        // CREATE TEACHER
        // ======================================

        .addCase(
          createTeacher.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          createTeacher.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.teachers.push(
              action.payload
            );
          }
        )

        .addCase(
          createTeacher.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // GET ALL TEACHERS
        // ======================================

        .addCase(
          getTeachers.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          getTeachers.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.teachers =
              action.payload;
          }
        )

        .addCase(
          getTeachers.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // GET MY TEACHER PROFILE
        // ======================================

        .addCase(
          getMyTeacherProfile.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          getMyTeacherProfile.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.myTeacher =
              action.payload;
          }
        )

        .addCase(
          getMyTeacherProfile.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // GET TEACHER BY ID
        // ======================================

        .addCase(
          getTeacherById.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          getTeacherById.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.selectedTeacher =
              action.payload;
          }
        )

        .addCase(
          getTeacherById.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // UPDATE TEACHER
        // ======================================

        .addCase(
          updateTeacher.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          updateTeacher.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;


            const index =
              state.teachers.findIndex(
                (teacher) =>
                  teacher._id ===
                  action.payload._id
              );


            if (
              index !== -1
            ) {

              state.teachers[index] =
                action.payload;
            }


            if (
              state.selectedTeacher
                ?._id ===
              action.payload._id
            ) {

              state.selectedTeacher =
                action.payload;
            }


            // In case currently logged-in teacher
            // is affected by a future shared update.
            if (
              state.myTeacher
                ?._id ===
              action.payload._id
            ) {

              state.myTeacher =
                action.payload;
            }
          }
        )

        .addCase(
          updateTeacher.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )


        // ======================================
        // UPDATE TEACHER STATUS
        // ======================================

        .addCase(
          updateTeacherStatus.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          updateTeacherStatus.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;


            const index =
              state.teachers.findIndex(
                (teacher) =>
                  teacher._id ===
                  action.payload._id
              );


            if (
              index !== -1
            ) {

              state.teachers[index] =
                action.payload;
            }


            if (
              state.selectedTeacher
                ?._id ===
              action.payload._id
            ) {

              state.selectedTeacher =
                action.payload;
            }


            if (
              state.myTeacher
                ?._id ===
              action.payload._id
            ) {

              state.myTeacher =
                action.payload;
            }
          }
        )

        .addCase(
          updateTeacherStatus.rejected,

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


// ============================================
// ACTIONS
// ============================================

export const {
  clearTeacherError,
  clearSelectedTeacher,
  clearMyTeacher,
} = teacherSlice.actions;


// ============================================
// REDUCER
// ============================================

export default teacherSlice.reducer;