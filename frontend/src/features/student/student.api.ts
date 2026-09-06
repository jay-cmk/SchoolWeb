




// import api from "../../api/axios";

// import type {
//   CreateStudentData,
//   Student,
//   StudentFilters,
//   UpdateStudentData,
// } from "./student.types";


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
// ===================================================== */

// export const getStudentsApi = async (
//   filters?: StudentFilters
// ): Promise<Student[]> => {

//   const params:
//     Record<string, string> = {};


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
//    UPDATE STUDENT
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
//    DELETE STUDENT
// ===================================================== */

// /*
//  * NOTE:
//  *
//  * Current backend student.routes.ts
//  * does not have DELETE /students/:studentId.
//  *
//  * Function is temporarily kept so existing
//  * imports do not break.
//  *
//  * Do not call it until DELETE backend API
//  * is implemented.
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
  StudentsByEnrollmentData,
  UpdateStudentData,
} from "./student.types";


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
   UPDATE STUDENT

   Normal profile update only.

   Academic movement such as:

   sessionId
   classId
   sectionId
   rollNumber

   is handled through enrollment /
   promotion APIs.
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