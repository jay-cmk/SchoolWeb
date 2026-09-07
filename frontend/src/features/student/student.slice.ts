

// import {
//   createAsyncThunk,
//   createSlice,
// } from "@reduxjs/toolkit";

// import {
//   createStudentAccountApi,
//   createStudentApi,
//   getStudentByIdApi,
//   getStudentsApi,
//   getStudentsByEnrollmentApi,
//   updateStudentApi,
// } from "./student.api";

// import type {
//   CreateStudentAccountData,
// } from "./student.api";

// import type {
//   CreateStudentData,
//   StudentEnrollmentFilters,
//   StudentFilters,
//   StudentState,
//   UpdateStudentData,
// } from "./student.types";


// /* =====================================================
//    INITIAL STATE
// ===================================================== */

// const initialState: StudentState = {
//   students: [],

//   selectedStudent: null,

//   loading: false,

//   error: null,
// };


// /* =====================================================
//    GET STUDENTS

//    Current Student master list.

//    GET /students
// ===================================================== */

// export const getStudents =
//   createAsyncThunk(
//     "students/getStudents",

//     async (
//       filters: StudentFilters | undefined,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getStudentsApi(
//           filters
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to fetch students"
//         );
//       }
//     }
//   );


// /* =====================================================
//    GET STUDENTS BY ENROLLMENT

//    GET /students/enrollments

//    IMPORTANT:
//    Session-wise student list ke liye ye API use hogi.

//    Student ke current sessionId/classId/sectionId
//    par depend nahi karegi.

//    Isliye promotion ke baad bhi old session ke
//    students historical list me visible rahenge.
// ===================================================== */

// export const getStudentsByEnrollment =
//   createAsyncThunk(
//     "students/getStudentsByEnrollment",

//     async (
//       filters: StudentEnrollmentFilters,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getStudentsByEnrollmentApi(
//           filters
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to fetch students by enrollment"
//         );
//       }
//     }
//   );


// /* =====================================================
//    GET STUDENT BY ID
// ===================================================== */

// export const getStudentById =
//   createAsyncThunk(
//     "students/getStudentById",

//     async (
//       studentId: string,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await getStudentByIdApi(
//           studentId
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to fetch student"
//         );
//       }
//     }
//   );


// /* =====================================================
//    CREATE STUDENT
// ===================================================== */

// export const createStudent =
//   createAsyncThunk(
//     "students/createStudent",

//     async (
//       data: CreateStudentData,
//       { rejectWithValue }
//     ) => {
//       try {
//         return await createStudentApi(
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to create student"
//         );
//       }
//     }
//   );


// /* =====================================================
//    CREATE STUDENT LOGIN ACCOUNT

//    Student create hone ke baad returned studentId
//    ke saath ye thunk dispatch hoga.
// ===================================================== */

// export const createStudentAccount =
//   createAsyncThunk(
//     "students/createStudentAccount",

//     async (
//       {
//         studentId,
//         data,
//       }: {
//         studentId: string;

//         data: CreateStudentAccountData;
//       },
//       { rejectWithValue }
//     ) => {
//       try {
//         return await createStudentAccountApi(
//           studentId,
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to create student login account"
//         );
//       }
//     }
//   );


// /* =====================================================
//    UPDATE STUDENT

//    Normal student/profile update only.

//    Academic movement:
//    - session
//    - class
//    - section
//    - roll number

//    Enrollment / Promotion APIs handle karengi.
// ===================================================== */

// export const updateStudent =
//   createAsyncThunk(
//     "students/updateStudent",

//     async (
//       {
//         studentId,
//         data,
//       }: {
//         studentId: string;

//         data: UpdateStudentData;
//       },
//       { rejectWithValue }
//     ) => {
//       try {
//         return await updateStudentApi(
//           studentId,
//           data
//         );
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to update student"
//         );
//       }
//     }
//   );


// /* =====================================================
//    SLICE
// ===================================================== */

// const studentSlice =
//   createSlice({
//     name: "students",

//     initialState,

//     reducers: {
//       clearSelectedStudent:
//         (state) => {
//           state.selectedStudent =
//             null;
//         },

//       clearStudentError:
//         (state) => {
//           state.error =
//             null;
//         },

//       clearStudents:
//         (state) => {
//           state.students = [];
//         },
//     },

//     extraReducers:
//       (builder) => {

//         /* =============================================
//            GET STUDENTS
//         ============================================= */

//         builder
//           .addCase(
//             getStudents.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             getStudents.fulfilled,
//             (state, action) => {
//               state.loading = false;

//               state.students =
//                 Array.isArray(
//                   action.payload
//                 )
//                   ? action.payload
//                   : [];
//             }
//           )

//           .addCase(
//             getStudents.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.students = [];

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to fetch students";
//             }
//           );


//         /* =============================================
//            GET STUDENTS BY ENROLLMENT
//         ============================================= */

//         builder
//           .addCase(
//             getStudentsByEnrollment.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             getStudentsByEnrollment.fulfilled,
//             (state, action) => {
//               state.loading = false;

//               const students =
//                 action.payload?.students;

//               state.students =
//                 Array.isArray(students)
//                   ? students
//                   : [];
//             }
//           )

//           .addCase(
//             getStudentsByEnrollment.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.students = [];

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to fetch students by enrollment";
//             }
//           );


//         /* =============================================
//            GET STUDENT BY ID
//         ============================================= */

//         builder
//           .addCase(
//             getStudentById.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             getStudentById.fulfilled,
//             (state, action) => {
//               state.loading = false;

//               state.selectedStudent =
//                 action.payload ?? null;
//             }
//           )

//           .addCase(
//             getStudentById.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to fetch student";
//             }
//           );


//         /* =============================================
//            CREATE STUDENT
//         ============================================= */

//         builder
//           .addCase(
//             createStudent.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             createStudent.fulfilled,
//             (state, action) => {
//               state.loading = false;

//               if (action.payload) {
//                 state.students.unshift(
//                   action.payload
//                 );
//               }
//             }
//           )

//           .addCase(
//             createStudent.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to create student";
//             }
//           );


//         /* =============================================
//            CREATE STUDENT LOGIN ACCOUNT
//         ============================================= */

//         builder
//           .addCase(
//             createStudentAccount.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             createStudentAccount.fulfilled,
//             (state) => {
//               state.loading = false;
//             }
//           )

//           .addCase(
//             createStudentAccount.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to create student login account";
//             }
//           );


//         /* =============================================
//            UPDATE STUDENT
//         ============================================= */

//         builder
//           .addCase(
//             updateStudent.pending,
//             (state) => {
//               state.loading = true;

//               state.error = null;
//             }
//           )

//           .addCase(
//             updateStudent.fulfilled,
//             (state, action) => {
//               state.loading = false;

//               const updatedStudent =
//                 action.payload;

//               if (!updatedStudent) {
//                 return;
//               }


//               const index =
//                 state.students.findIndex(
//                   (student) =>
//                     student._id ===
//                     updatedStudent._id
//                 );


//               if (index !== -1) {
//                 /*
//                  * Student list enrollment-based ho
//                  * sakti hai.
//                  *
//                  * Isliye existing academic placement
//                  * information preserve kar rahe hain.
//                  */

//                 const existingStudent =
//                   state.students[index];

//                 if (existingStudent) {
//                   state.students[index] = {
//                     ...existingStudent,
//                     ...updatedStudent,

//                     sessionId:
//                       existingStudent.sessionId,

//                     classId:
//                       existingStudent.classId,

//                     sectionId:
//                       existingStudent.sectionId,

//                     rollNumber:
//                       existingStudent.rollNumber,

//                     enrollment:
//                       existingStudent.enrollment,
//                   };
//                 }
//               }


//               if (
//                 state.selectedStudent?._id ===
//                 updatedStudent._id
//               ) {
//                 state.selectedStudent =
//                   updatedStudent;
//               }
//             }
//           )

//           .addCase(
//             updateStudent.rejected,
//             (state, action) => {
//               state.loading = false;

//               state.error =
//                 (action.payload as string) ||
//                 "Failed to update student";
//             }
//           );
//       },
//   });


// /* =====================================================
//    ACTIONS
// ===================================================== */

// export const {
//   clearSelectedStudent,
//   clearStudentError,
//   clearStudents,
// } = studentSlice.actions;


// /* =====================================================
//    REDUCER
// ===================================================== */

// export default studentSlice.reducer;











import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  createStudentAccountApi,
  createStudentApi,
  getStudentByIdApi,
  getStudentsApi,
  getStudentsByEnrollmentApi,
  updateStudentApi,
  updateStudentStatusApi,
} from "./student.api";

import type {
  CreateStudentAccountData,
} from "./student.api";

import type {
  CreateStudentData,
  StudentEnrollmentFilters,
  StudentFilters,
  StudentState,
  StudentStatus,
  UpdateStudentData,
} from "./student.types";


/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: StudentState = {
  students: [],

  selectedStudent: null,

  loading: false,

  error: null,
};


/* =====================================================
   GET STUDENTS

   Current Student master list.

   GET /students
===================================================== */

export const getStudents =
  createAsyncThunk(
    "students/getStudents",

    async (
      filters: StudentFilters | undefined,
      { rejectWithValue }
    ) => {
      try {
        return await getStudentsApi(
          filters
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch students"
        );
      }
    }
  );


/* =====================================================
   GET STUDENTS BY ENROLLMENT

   GET /students/enrollments

   IMPORTANT:
   Session-wise student list ke liye ye API use hogi.

   Student ke current sessionId/classId/sectionId
   par depend nahi karegi.

   Isliye promotion ke baad bhi old session ke
   students historical list me visible rahenge.
===================================================== */

export const getStudentsByEnrollment =
  createAsyncThunk(
    "students/getStudentsByEnrollment",

    async (
      filters: StudentEnrollmentFilters,
      { rejectWithValue }
    ) => {
      try {
        return await getStudentsByEnrollmentApi(
          filters
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch students by enrollment"
        );
      }
    }
  );


/* =====================================================
   GET STUDENT BY ID
===================================================== */

export const getStudentById =
  createAsyncThunk(
    "students/getStudentById",

    async (
      studentId: string,
      { rejectWithValue }
    ) => {
      try {
        return await getStudentByIdApi(
          studentId
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch student"
        );
      }
    }
  );


/* =====================================================
   CREATE STUDENT
===================================================== */

export const createStudent =
  createAsyncThunk(
    "students/createStudent",

    async (
      data: CreateStudentData,
      { rejectWithValue }
    ) => {
      try {
        return await createStudentApi(
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to create student"
        );
      }
    }
  );


/* =====================================================
   CREATE STUDENT LOGIN ACCOUNT

   Student create hone ke baad returned studentId
   ke saath ye thunk dispatch hoga.
===================================================== */

export const createStudentAccount =
  createAsyncThunk(
    "students/createStudentAccount",

    async (
      {
        studentId,
        data,
      }: {
        studentId: string;

        data: CreateStudentAccountData;
      },
      { rejectWithValue }
    ) => {
      try {
        return await createStudentAccountApi(
          studentId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to create student login account"
        );
      }
    }
  );


/* =====================================================
   UPDATE STUDENT

   Normal student/profile update only.

   Academic movement:
   - session
   - class
   - section
   - roll number

   Enrollment / Promotion APIs handle karengi.
===================================================== */

export const updateStudent =
  createAsyncThunk(
    "students/updateStudent",

    async (
      {
        studentId,
        data,
      }: {
        studentId: string;

        data: UpdateStudentData;
      },
      { rejectWithValue }
    ) => {
      try {
        return await updateStudentApi(
          studentId,
          data
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to update student"
        );
      }
    }
  );


/* =====================================================
   UPDATE STUDENT STATUS

   ACTIVE / INACTIVE status action.
===================================================== */

export const updateStudentStatus =
  createAsyncThunk(
    "students/updateStudentStatus",

    async (
      {
        studentId,
        status,
      }: {
        studentId: string;
        status: StudentStatus;
      },
      { rejectWithValue }
    ) => {
      try {
        return await updateStudentStatusApi(
          studentId,
          status
        );
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to update student status"
        );
      }
    }
  );


/* =====================================================
   SLICE
===================================================== */

const studentSlice =
  createSlice({
    name: "students",

    initialState,

    reducers: {
      clearSelectedStudent:
        (state) => {
          state.selectedStudent =
            null;
        },

      clearStudentError:
        (state) => {
          state.error =
            null;
        },

      clearStudents:
        (state) => {
          state.students = [];
        },
    },

    extraReducers:
      (builder) => {

        /* =============================================
           GET STUDENTS
        ============================================= */

        builder
          .addCase(
            getStudents.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            getStudents.fulfilled,
            (state, action) => {
              state.loading = false;

              state.students =
                Array.isArray(
                  action.payload
                )
                  ? action.payload
                  : [];
            }
          )

          .addCase(
            getStudents.rejected,
            (state, action) => {
              state.loading = false;

              state.students = [];

              state.error =
                (action.payload as string) ||
                "Failed to fetch students";
            }
          );


        /* =============================================
           GET STUDENTS BY ENROLLMENT
        ============================================= */

        builder
          .addCase(
            getStudentsByEnrollment.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            getStudentsByEnrollment.fulfilled,
            (state, action) => {
              state.loading = false;

              const students =
                action.payload?.students;

              state.students =
                Array.isArray(students)
                  ? students
                  : [];
            }
          )

          .addCase(
            getStudentsByEnrollment.rejected,
            (state, action) => {
              state.loading = false;

              state.students = [];

              state.error =
                (action.payload as string) ||
                "Failed to fetch students by enrollment";
            }
          );


        /* =============================================
           GET STUDENT BY ID
        ============================================= */

        builder
          .addCase(
            getStudentById.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            getStudentById.fulfilled,
            (state, action) => {
              state.loading = false;

              state.selectedStudent =
                action.payload ?? null;
            }
          )

          .addCase(
            getStudentById.rejected,
            (state, action) => {
              state.loading = false;

              state.error =
                (action.payload as string) ||
                "Failed to fetch student";
            }
          );


        /* =============================================
           CREATE STUDENT
        ============================================= */

        builder
          .addCase(
            createStudent.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            createStudent.fulfilled,
            (state, action) => {
              state.loading = false;

              if (action.payload) {
                state.students.unshift(
                  action.payload
                );
              }
            }
          )

          .addCase(
            createStudent.rejected,
            (state, action) => {
              state.loading = false;

              state.error =
                (action.payload as string) ||
                "Failed to create student";
            }
          );


        /* =============================================
           CREATE STUDENT LOGIN ACCOUNT
        ============================================= */

        builder
          .addCase(
            createStudentAccount.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            createStudentAccount.fulfilled,
            (state) => {
              state.loading = false;
            }
          )

          .addCase(
            createStudentAccount.rejected,
            (state, action) => {
              state.loading = false;

              state.error =
                (action.payload as string) ||
                "Failed to create student login account";
            }
          );


        /* =============================================
           UPDATE STUDENT
        ============================================= */

        builder
          .addCase(
            updateStudent.pending,
            (state) => {
              state.loading = true;

              state.error = null;
            }
          )

          .addCase(
            updateStudent.fulfilled,
            (state, action) => {
              state.loading = false;

              const updatedStudent =
                action.payload;

              if (!updatedStudent) {
                return;
              }


              const index =
                state.students.findIndex(
                  (student) =>
                    student._id ===
                    updatedStudent._id
                );


              if (index !== -1) {
                /*
                 * Student list enrollment-based ho
                 * sakti hai.
                 *
                 * Isliye existing academic placement
                 * information preserve kar rahe hain.
                 */

                const existingStudent =
                  state.students[index];

                if (existingStudent) {
                  state.students[index] = {
                    ...existingStudent,
                    ...updatedStudent,

                    sessionId:
                      existingStudent.sessionId,

                    classId:
                      existingStudent.classId,

                    sectionId:
                      existingStudent.sectionId,

                    rollNumber:
                      existingStudent.rollNumber,

                    enrollment:
                      existingStudent.enrollment,
                  };
                }
              }


              if (
                state.selectedStudent?._id ===
                updatedStudent._id
              ) {
                state.selectedStudent =
                  updatedStudent;
              }
            }
          )

          .addCase(
            updateStudent.rejected,
            (state, action) => {
              state.loading = false;

              state.error =
                (action.payload as string) ||
                "Failed to update student";
            }
          );


        /* =============================================
           UPDATE STUDENT STATUS
        ============================================= */

        builder
          .addCase(
            updateStudentStatus.pending,
            (state) => {
              state.error = null;
            }
          )

          .addCase(
            updateStudentStatus.fulfilled,
            (state, action) => {
              const updatedStudent =
                action.payload;

              const updatedStatus =
                updatedStudent.status ??
                action.meta.arg.status;

              const index =
                state.students.findIndex(
                  (student) =>
                    student._id ===
                    updatedStudent._id
                );

              if (index !== -1) {
                const existingStudent =
                  state.students[index];

                if (existingStudent) {
                  state.students[index] = {
                    ...existingStudent,
                    status:
                      updatedStatus,
                  };
                }
              }

              if (
                state.selectedStudent?._id ===
                updatedStudent._id
              ) {
                state.selectedStudent = {
                  ...state.selectedStudent,
                  status:
                    updatedStatus,
                };
              }
            }
          )

          .addCase(
            updateStudentStatus.rejected,
            (state, action) => {
              state.error =
                (action.payload as string) ||
                "Failed to update student status";
            }
          );
      },
  });


/* =====================================================
   ACTIONS
===================================================== */

export const {
  clearSelectedStudent,
  clearStudentError,
  clearStudents,
} = studentSlice.actions;


/* =====================================================
   REDUCER
===================================================== */

export default studentSlice.reducer;
