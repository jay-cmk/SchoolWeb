


// import api from "../../api/axios";

// import type {
//   CreateStudentData,
//   Student,
//   StudentEnrollmentFilters,
//   StudentFilters,
//   StudentStatus,
//   StudentsByEnrollmentData,
//   UpdateStudentData,
// } from "./student.types";

// /* =====================================================
//    STUDENT ACCOUNT TYPES
// ===================================================== */

// export interface CreateStudentAccountData {
//   email: string;
//   password: string;
// }

// export interface CreatedStudentAccount {
//   id: string;
//   name: string;
//   admissionNumber: string;
//   userId: string;
//   email: string;
//   role: string;
//   schoolId: string;
// }

// export interface CreateStudentAccountResult {
//   student: CreatedStudentAccount;
// }


// /* =====================================================
//    BUILD STUDENT FORM DATA
// ===================================================== */

// const buildStudentFormData = (
//   data:
//     | CreateStudentData
//     | UpdateStudentData
// ): FormData => {
//   const formData =
//     new FormData();

//   Object.entries(data).forEach(
//     ([key, value]) => {
//       if (
//         value === undefined ||
//         value === null ||
//         value === ""
//       ) {
//         return;
//       }

//       if (
//         key === "photo" &&
//         value instanceof File
//       ) {
//         formData.append(
//           "photo",
//           value
//         );

//         return;
//       }

//       if (
//         key === "address" ||
//         key === "currentAddress" ||
//         key === "permanentAddress" ||
//         key === "father" ||
//         key === "mother"
//       ) {
//         formData.append(
//           key,
//           JSON.stringify(value)
//         );

//         return;
//       }

//       formData.append(
//         key,
//         String(value)
//       );
//     }
//   );

//   return formData;
// };


// /* =====================================================
//    GET STUDENTS

//    Current student master list.

//    GET /students

//    Supported filters:
//    - page
//    - limit
//    - sessionId
//    - classId
//    - sectionId
//    - search
//    - status
// ===================================================== */

// export const getStudentsApi = async (
//   filters?: StudentFilters
// ): Promise<Student[]> => {
//   const params:
//     Record<string, string> = {};

//   if (
//     filters?.page !== undefined
//   ) {
//     params.page =
//       String(filters.page);
//   }

//   if (
//     filters?.limit !== undefined
//   ) {
//     params.limit =
//       String(filters.limit);
//   }

//   if (filters?.sessionId) {
//     params.sessionId =
//       filters.sessionId;
//   }

//   if (filters?.classId) {
//     params.classId =
//       filters.classId;
//   }

//   if (filters?.sectionId) {
//     params.sectionId =
//       filters.sectionId;
//   }

//   if (filters?.search) {
//     params.search =
//       filters.search;
//   }

//   if (filters?.status) {
//     params.status =
//       filters.status;
//   }

//   const response =
//     await api.get(
//       "/students",
//       {
//         params,
//       }
//     );

//   const students =
//     response.data?.data;

//   if (!Array.isArray(students)) {
//     console.error(
//       "Students API data is not an array:",
//       response.data
//     );

//     return [];
//   }

//   return students;
// };


// /* =====================================================
//    GET STUDENTS BY ENROLLMENT

//    Historical + Current academic student list.

//    GET /students/enrollments

//    sessionId = required
//    classId   = optional
//    sectionId = optional
//    search    = optional

//    IMPORTANT:
//    This API reads academic placement from
//    StudentEnrollment instead of Student's
//    current session/class/section snapshot.

//    Therefore old session students also remain
//    visible after promotion.
// ===================================================== */

// export const getStudentsByEnrollmentApi =
//   async (
//     filters: StudentEnrollmentFilters
//   ): Promise<StudentsByEnrollmentData> => {
//     const params:
//       Record<string, string> = {
//         sessionId:
//           filters.sessionId,
//       };

//     if (filters.classId) {
//       params.classId =
//         filters.classId;
//     }

//     if (filters.sectionId) {
//       params.sectionId =
//         filters.sectionId;
//     }

//     if (filters.search) {
//       params.search =
//         filters.search;
//     }

//     const response =
//       await api.get(
//         "/students/enrollments",
//         {
//           params,
//         }
//       );

//     const data =
//       response.data?.data;

//     if (
//       !data ||
//       !Array.isArray(data.students)
//     ) {
//       console.error(
//         "Students Enrollment API response is invalid:",
//         response.data
//       );

//       throw new Error(
//         "Invalid students enrollment response"
//       );
//     }

//     return {
//       session: data.session,
//       students:
//         data.students,
//       total:
//         typeof data.total === "number"
//           ? data.total
//           : data.students.length,
//     };
//   };


// /* =====================================================
//    GET STUDENT BY ID
// ===================================================== */

// export const getStudentByIdApi =
//   async (
//     studentId: string
//   ): Promise<Student> => {
//     const response =
//       await api.get(
//         `/students/${studentId}`
//       );

//     return response.data
//       .data as Student;
//   };


// /* =====================================================
//    CREATE STUDENT

//    Student creation also creates the initial
//    academic enrollment on backend.

//    sessionId
//    classId
//    sectionId
//    rollNumber

//    are valid during initial admission.

//    apaarId is automatically included in
//    FormData when present in CreateStudentData.
// ===================================================== */

// export const createStudentApi =
//   async (
//     data: CreateStudentData
//   ): Promise<Student> => {
//     const formData =
//       buildStudentFormData(data);

//     const response =
//       await api.post(
//         "/students",
//         formData
//       );

//     return response.data
//       .data as Student;
//   };


// /* =====================================================
//    CREATE STUDENT LOGIN ACCOUNT

//    Call after createStudentApi succeeds.

//    POST /students/:studentId/account
// ===================================================== */

// export const createStudentAccountApi =
//   async (
//     studentId: string,
//     data: CreateStudentAccountData
//   ): Promise<CreateStudentAccountResult> => {
//     const response =
//       await api.post(
//         `/students/${studentId}/account`,
//         data
//       );

//     return response.data
//       .data as CreateStudentAccountResult;
//   };


// /* =====================================================
//    UPDATE STUDENT

//    Normal profile update only.

//    Academic movement such as:

//    sessionId
//    classId
//    sectionId
//    rollNumber

//    is handled through enrollment /
//    promotion APIs.

//    apaarId is automatically included in
//    FormData when present in UpdateStudentData.
// ===================================================== */

// export const updateStudentApi =
//   async (
//     studentId: string,
//     data: UpdateStudentData
//   ): Promise<Student> => {
//     const formData =
//       buildStudentFormData(data);

//     const response =
//       await api.patch(
//         `/students/${studentId}`,
//         formData
//       );

//     return response.data
//       .data as Student;
//   };


// /* =====================================================
//    UPDATE STUDENT STATUS

//    PATCH /students/:studentId/status
// ===================================================== */

// export const updateStudentStatusApi =
//   async (
//     studentId: string,
//     status: StudentStatus
//   ): Promise<Student> => {
//     const response =
//       await api.patch(
//         `/students/${studentId}/status`,
//         {
//           status,
//         }
//       );

//     return response.data
//       .data as Student;
//   };


// /* =====================================================
//    DELETE STUDENT
// ===================================================== */

// /*
//  * TEMPORARY COMPATIBILITY ONLY
//  *
//  * Current backend does NOT have:
//  *
//  * DELETE /students/:studentId
//  *
//  * This function is kept temporarily because
//  * the current student.slice.ts still imports it.
//  *
//  * Do NOT call this function from UI.
//  *
//  * When student.slice.ts is updated next,
//  * deleteStudent thunk will be removed and then
//  * this function can also be removed completely.
//  */

// export const deleteStudentApi =
//   async (
//     studentId: string
//   ): Promise<string> => {
//     await api.delete(
//       `/students/${studentId}`
//     );

//     return studentId;
//   };





import api from "../../api/axios";

import type {
  CreateStudentData,
  Student,
  StudentEnrollmentFilters,
  StudentFilters,
  StudentStatus,
  StudentsByEnrollmentData,
  UpdateStudentData,
} from "./student.types";

/* =====================================================
   STUDENT ACCOUNT TYPES
===================================================== */

export interface CreateStudentAccountData {
  email: string;
  password: string;
}

export interface CreatedStudentAccount {
  id: string;
  name: string;
  admissionNumber: string;
  userId: string;
  email: string;
  role: string;
  schoolId: string;
}

export interface CreateStudentAccountResult {
  student: CreatedStudentAccount;
}


/* =====================================================
   BUILD STUDENT FORM DATA
===================================================== */

const buildStudentFormData = (
  data:
    | CreateStudentData
    | UpdateStudentData
): FormData => {
  const formData =
    new FormData();

  Object.entries(data).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      if (
        key === "photo" &&
        value instanceof File
      ) {
        formData.append(
          "photo",
          value
        );

        return;
      }

      if (
        key === "address" ||
        key === "currentAddress" ||
        key === "permanentAddress" ||
        key === "father" ||
        key === "mother"
      ) {
        formData.append(
          key,
          JSON.stringify(value)
        );

        return;
      }

      formData.append(
        key,
        String(value)
      );
    }
  );

  return formData;
};


/* =====================================================
   GET STUDENTS

   Current student master list.

   GET /students

   Supported filters:
   - page
   - limit
   - sessionId
   - classId
   - sectionId
   - search
   - status
===================================================== */

export const getStudentsApi = async (
  filters?: StudentFilters
): Promise<Student[]> => {
  const params:
    Record<string, string> = {};

  if (
    filters?.page !== undefined
  ) {
    params.page =
      String(filters.page);
  }

  if (
    filters?.limit !== undefined
  ) {
    params.limit =
      String(filters.limit);
  }

  if (filters?.sessionId) {
    params.sessionId =
      filters.sessionId;
  }

  if (filters?.classId) {
    params.classId =
      filters.classId;
  }

  if (filters?.sectionId) {
    params.sectionId =
      filters.sectionId;
  }

  if (filters?.search) {
    params.search =
      filters.search;
  }

  if (filters?.status) {
    params.status =
      filters.status;
  }

  const response =
    await api.get(
      "/students",
      {
        params,
      }
    );

  const students =
    response.data?.data;

  if (!Array.isArray(students)) {
    console.error(
      "Students API data is not an array:",
      response.data
    );

    return [];
  }

  return students;
};


/* =====================================================
   GET STUDENTS BY ENROLLMENT

   Historical + Current academic student list.

   GET /students/enrollments

   sessionId = required
   classId   = optional
   sectionId = optional
   search    = optional

   IMPORTANT:
   This API reads academic placement from
   StudentEnrollment instead of Student's
   current session/class/section snapshot.

   Therefore old session students also remain
   visible after promotion.
===================================================== */

export const getStudentsByEnrollmentApi =
  async (
    filters: StudentEnrollmentFilters
  ): Promise<StudentsByEnrollmentData> => {
    const params:
      Record<string, string> = {
        sessionId:
          filters.sessionId,
      };

    if (filters.classId) {
      params.classId =
        filters.classId;
    }

    if (filters.sectionId) {
      params.sectionId =
        filters.sectionId;
    }

    if (filters.search) {
      params.search =
        filters.search;
    }

    const response =
      await api.get(
        "/students/enrollments",
        {
          params,
        }
      );

    const data =
      response.data?.data;

    if (
      !data ||
      !Array.isArray(data.students)
    ) {
      console.error(
        "Students Enrollment API response is invalid:",
        response.data
      );

      throw new Error(
        "Invalid students enrollment response"
      );
    }

    return {
      session: data.session,
      students:
        data.students,
      total:
        typeof data.total === "number"
          ? data.total
          : data.students.length,
    };
  };


/* =====================================================
   GET STUDENT BY ID
===================================================== */

export const getStudentByIdApi =
  async (
    studentId: string
  ): Promise<Student> => {
    const response =
      await api.get(
        `/students/${studentId}`
      );

    return response.data
      .data as Student;
  };


/* =====================================================
   CREATE STUDENT

   Student creation also creates the initial
   academic enrollment on backend.

   sessionId
   classId
   sectionId
   rollNumber

   are valid during initial admission.

   apaarId, penNumber and stream are
   automatically included in FormData when
   present in CreateStudentData.

   Address objects are JSON serialized, so
   countryCode, stateCode and districtCode
   are also preserved.
===================================================== */

export const createStudentApi =
  async (
    data: CreateStudentData
  ): Promise<Student> => {
    const formData =
      buildStudentFormData(data);

    const response =
      await api.post(
        "/students",
        formData
      );

    return response.data
      .data as Student;
  };


/* =====================================================
   CREATE STUDENT LOGIN ACCOUNT

   Call after createStudentApi succeeds.

   POST /students/:studentId/account
===================================================== */

export const createStudentAccountApi =
  async (
    studentId: string,
    data: CreateStudentAccountData
  ): Promise<CreateStudentAccountResult> => {
    const response =
      await api.post(
        `/students/${studentId}/account`,
        data
      );

    return response.data
      .data as CreateStudentAccountResult;
  };


/* =====================================================
   UPDATE STUDENT

   Normal profile update only.

   Academic movement such as:

   sessionId
   classId
   sectionId
   rollNumber

   is handled through enrollment /
   promotion APIs.

   apaarId and penNumber are automatically
   included in FormData when present in
   UpdateStudentData.

   Updated address objects preserve location
   names and their master codes.
===================================================== */

export const updateStudentApi =
  async (
    studentId: string,
    data: UpdateStudentData
  ): Promise<Student> => {
    const formData =
      buildStudentFormData(data);

    const response =
      await api.patch(
        `/students/${studentId}`,
        formData
      );

    return response.data
      .data as Student;
  };


/* =====================================================
   UPDATE STUDENT STATUS

   PATCH /students/:studentId/status
===================================================== */

export const updateStudentStatusApi =
  async (
    studentId: string,
    status: StudentStatus
  ): Promise<Student> => {
    const response =
      await api.patch(
        `/students/${studentId}/status`,
        {
          status,
        }
      );

    return response.data
      .data as Student;
  };


/* =====================================================
   DELETE STUDENT
===================================================== */

/*
 * TEMPORARY COMPATIBILITY ONLY
 *
 * Current backend does NOT have:
 *
 * DELETE /students/:studentId
 *
 * This function is kept temporarily because
 * the current student.slice.ts still imports it.
 *
 * Do NOT call this function from UI.
 *
 * When student.slice.ts is updated next,
 * deleteStudent thunk will be removed and then
 * this function can also be removed completely.
 */

export const deleteStudentApi =
  async (
    studentId: string
  ): Promise<string> => {
    await api.delete(
      `/students/${studentId}`
    );

    return studentId;
  };
