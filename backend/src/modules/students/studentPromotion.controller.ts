// import type {
//   Request,
//   Response,
// } from "express";

// import {
//   bulkPromoteStudents,
//   previewBulkPromotion,
//   promoteSingleStudent,
// } from "./studentPromotion.service";

// import {
//   getPromotionCandidates,
//   getStudentEnrollmentHistory,
//   getEnrollmentById,
//   updateEnrollment,
// } from "./studentEnrollment.service";

// import type {
//   IBulkStudentPromotionRequest,
//   ISingleStudentPromotionRequest,
// } from "./studentPromotion.types";

// import type {
//   IUpdateStudentEnrollmentData,
// } from "./studentEnrollment.types";


// /* =====================================================
//    HELPER - AUTH USER
// ===================================================== */

// const getAuthContext = (
//   req: Request
// ): {
//   schoolId: string;
//   userId: string;
// } => {

//   const schoolId =
//     req.user?.schoolId;

//   const userId =
//     req.user?.userId;


//   if (!schoolId) {
//     throw new Error(
//       "School context not found."
//     );
//   }


//   if (!userId) {
//     throw new Error(
//       "Authenticated user not found."
//     );
//   }


//   return {
//     schoolId:
//       schoolId.toString(),

//     userId:
//       userId.toString(),
//   };
// };


// /* =====================================================
//    GET PROMOTION CANDIDATES

//    GET
//    /students/promotions/candidates
// ===================================================== */

// export const getPromotionCandidatesController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//       } = getAuthContext(req);


//       const sessionId =
//         typeof req.query.sessionId ===
//         "string"
//           ? req.query.sessionId
//           : "";


//       const classId =
//         typeof req.query.classId ===
//         "string"
//           ? req.query.classId
//           : "";


//       const sectionId =
//         typeof req.query.sectionId ===
//         "string"
//           ? req.query.sectionId
//           : undefined;


//       if (!sessionId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "sessionId is required.",
//         });

//         return;
//       }


//       if (!classId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "classId is required.",
//         });

//         return;
//       }


//       const students =
//         await getPromotionCandidates(
//           schoolId,
//           sessionId,
//           classId,
//           sectionId
//         );


//       res.status(200).json({
//         success: true,

//         data: students,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to get promotion candidates.",
//       });
//     }
//   };


// /* =====================================================
//    PREVIEW BULK PROMOTION

//    POST
//    /students/promotions/preview
// ===================================================== */

// export const previewBulkPromotionController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         userId,
//       } = getAuthContext(req);


//       const data =
//         req.body as
//           IBulkStudentPromotionRequest;


//       const result =
//         await previewBulkPromotion(
//           schoolId,
//           userId,
//           data
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           result.canPromote
//             ? "Promotion preview validated successfully."
//             : "Promotion preview contains validation errors.",

//         data:
//           result,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to preview student promotion.",
//       });
//     }
//   };


// /* =====================================================
//    BULK PROMOTION

//    POST
//    /students/promotions/bulk
// ===================================================== */

// export const bulkPromoteStudentsController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         userId,
//       } = getAuthContext(req);


//       const data =
//         req.body as
//           IBulkStudentPromotionRequest;


//       const result =
//         await bulkPromoteStudents(
//           schoolId,
//           userId,
//           data
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Student promotion completed successfully.",

//         data:
//           result,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to promote students.",
//       });
//     }
//   };


// /* =====================================================
//    SINGLE STUDENT PROMOTION

//    POST
//    /students/:studentId/promotion
// ===================================================== */

// export const promoteSingleStudentController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         userId,
//       } = getAuthContext(req);


//       const studentId =
//         typeof req.params.studentId ===
//         "string"
//           ? req.params.studentId
//           : "";


//       if (!studentId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "studentId is required.",
//         });

//         return;
//       }


//       const data =
//         req.body as
//           ISingleStudentPromotionRequest;


//       const result =
//         await promoteSingleStudent(
//           schoolId,
//           userId,
//           studentId,
//           data
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Student promotion completed successfully.",

//         data:
//           result,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to promote student.",
//       });
//     }
//   };


// /* =====================================================
//    STUDENT ENROLLMENT HISTORY

//    GET
//    /students/:studentId/enrollments
// ===================================================== */

// export const getStudentEnrollmentHistoryController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//       } = getAuthContext(req);


//       const studentId =
//         typeof req.params.studentId ===
//         "string"
//           ? req.params.studentId
//           : "";


//       if (!studentId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "studentId is required.",
//         });

//         return;
//       }


//       const result =
//         await getStudentEnrollmentHistory(
//           schoolId,
//           studentId
//         );


//       res.status(200).json({
//         success: true,

//         data:
//           result,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to get student enrollment history.",
//       });
//     }
//   };


// /* =====================================================
//    GET ENROLLMENT BY ID

//    GET
//    /students/enrollments/:enrollmentId
// ===================================================== */

// export const getEnrollmentByIdController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//       } = getAuthContext(req);


//       const enrollmentId =
//         typeof req.params.enrollmentId ===
//         "string"
//           ? req.params.enrollmentId
//           : "";


//       if (!enrollmentId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "enrollmentId is required.",
//         });

//         return;
//       }


//       const enrollment =
//         await getEnrollmentById(
//           schoolId,
//           enrollmentId
//         );


//       res.status(200).json({
//         success: true,

//         data:
//           enrollment,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to get student enrollment.",
//       });
//     }
//   };


// /* =====================================================
//    UPDATE ENROLLMENT

//    PATCH
//    /students/enrollments/:enrollmentId
// ===================================================== */

// export const updateEnrollmentController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {

//     try {

//       const {
//         schoolId,
//         userId,
//       } = getAuthContext(req);


//       const enrollmentId =
//         typeof req.params.enrollmentId ===
//         "string"
//           ? req.params.enrollmentId
//           : "";


//       if (!enrollmentId) {

//         res.status(400).json({
//           success: false,
//           message:
//             "enrollmentId is required.",
//         });

//         return;
//       }


//       /*
//        * updatedBy request body se nahi lenge.
//        * Logged-in School Admin ke JWT se aayega.
//        */

//       const body =
//         req.body as
//           Omit<
//             IUpdateStudentEnrollmentData,
//             "updatedBy"
//           >;


//       const data:
//         IUpdateStudentEnrollmentData = {
//         ...body,

//         updatedBy:
//           userId,
//       };


//       const enrollment =
//         await updateEnrollment(
//           schoolId,
//           enrollmentId,
//           data
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Student enrollment updated successfully.",

//         data:
//           enrollment,
//       });

//     } catch (error) {

//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update student enrollment.",
//       });
//     }
//   };



import type {
  Request,
  Response,
} from "express";

import {
  bulkPromoteStudents,
  previewBulkPromotion,
  promoteSingleStudent,
} from "./studentPromotion.service";

import {
  getPromotionCandidates,
  getStudentEnrollmentHistory,
  getEnrollmentById,
  updateEnrollment,
  getStudentsByEnrollment,
} from "./studentEnrollment.service";

import type {
  IBulkStudentPromotionRequest,
  ISingleStudentPromotionRequest,
} from "./studentPromotion.types";

import type {
  IUpdateStudentEnrollmentData,
} from "./studentEnrollment.types";


/* =====================================================
   HELPER - AUTH USER
===================================================== */

const getAuthContext = (
  req: Request
): {
  schoolId: string;
  userId: string;
} => {

  const schoolId =
    req.user?.schoolId;

  const userId =
    req.user?.userId;


  if (!schoolId) {
    throw new Error(
      "School context not found."
    );
  }


  if (!userId) {
    throw new Error(
      "Authenticated user not found."
    );
  }


  return {
    schoolId:
      schoolId.toString(),

    userId:
      userId.toString(),
  };
};


/* =====================================================
   GET PROMOTION CANDIDATES

   GET
   /students/promotions/candidates
===================================================== */

export const getPromotionCandidatesController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
      } = getAuthContext(req);


      const sessionId =
        typeof req.query.sessionId ===
        "string"
          ? req.query.sessionId
          : "";


      const classId =
        typeof req.query.classId ===
        "string"
          ? req.query.classId
          : "";


      const sectionId =
        typeof req.query.sectionId ===
        "string"
          ? req.query.sectionId
          : undefined;


      if (!sessionId) {

        res.status(400).json({
          success: false,
          message:
            "sessionId is required.",
        });

        return;
      }


      if (!classId) {

        res.status(400).json({
          success: false,
          message:
            "classId is required.",
        });

        return;
      }


      const students =
        await getPromotionCandidates(
          schoolId,
          sessionId,
          classId,
          sectionId
        );


      res.status(200).json({
        success: true,

        data: students,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to get promotion candidates.",
      });
    }
  };


/* =====================================================
   GET STUDENTS BY ENROLLMENT

   GET
   /students/enrollments

   Query:
   sessionId  - required
   classId    - optional
   sectionId  - optional
   search     - optional

   IMPORTANT:
   This endpoint uses StudentEnrollment history.

   Therefore old academic sessions continue to show
   students even after they have been promoted.
===================================================== */

export const getStudentsByEnrollmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
      } = getAuthContext(req);


      /* ===============================================
         SESSION
      =============================================== */

      const sessionId =
        typeof req.query.sessionId ===
        "string"
          ? req.query.sessionId
          : "";


      if (!sessionId) {

        res.status(400).json({
          success: false,

          message:
            "sessionId is required.",
        });

        return;
      }


      /* ===============================================
         OPTIONAL CLASS
      =============================================== */

      const classId =
        typeof req.query.classId ===
        "string" &&
        req.query.classId.trim()
          ? req.query.classId.trim()
          : undefined;


      /* ===============================================
         OPTIONAL SECTION
      =============================================== */

      const sectionId =
        typeof req.query.sectionId ===
        "string" &&
        req.query.sectionId.trim()
          ? req.query.sectionId.trim()
          : undefined;


      /* ===============================================
         OPTIONAL SEARCH
      =============================================== */

      const search =
        typeof req.query.search ===
        "string" &&
        req.query.search.trim()
          ? req.query.search.trim()
          : undefined;


      /* ===============================================
         SECTION REQUIRES CLASS
      =============================================== */

      if (
        sectionId &&
        !classId
      ) {

        res.status(400).json({
          success: false,

          message:
            "classId is required when sectionId is provided.",
        });

        return;
      }


      /* ===============================================
         SERVICE
      =============================================== */

      const result =
        await getStudentsByEnrollment(
          schoolId,
          sessionId,
          classId,
          sectionId,
          search
        );


      /* ===============================================
         RESPONSE
      =============================================== */

      res.status(200).json({
        success: true,

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to get students by academic session.",
      });
    }
  };


/* =====================================================
   PREVIEW BULK PROMOTION

   POST
   /students/promotions/preview
===================================================== */

export const previewBulkPromotionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        userId,
      } = getAuthContext(req);


      const data =
        req.body as
          IBulkStudentPromotionRequest;


      const result =
        await previewBulkPromotion(
          schoolId,
          userId,
          data
        );


      res.status(200).json({
        success: true,

        message:
          result.canPromote
            ? "Promotion preview validated successfully."
            : "Promotion preview contains validation errors.",

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to preview student promotion.",
      });
    }
  };


/* =====================================================
   BULK PROMOTION

   POST
   /students/promotions/bulk
===================================================== */

export const bulkPromoteStudentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        userId,
      } = getAuthContext(req);


      const data =
        req.body as
          IBulkStudentPromotionRequest;


      const result =
        await bulkPromoteStudents(
          schoolId,
          userId,
          data
        );


      res.status(200).json({
        success: true,

        message:
          "Student promotion completed successfully.",

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to promote students.",
      });
    }
  };


/* =====================================================
   SINGLE STUDENT PROMOTION

   POST
   /students/:studentId/promotion
===================================================== */

export const promoteSingleStudentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        userId,
      } = getAuthContext(req);


      const studentId =
        typeof req.params.studentId ===
        "string"
          ? req.params.studentId
          : "";


      if (!studentId) {

        res.status(400).json({
          success: false,
          message:
            "studentId is required.",
        });

        return;
      }


      const data =
        req.body as
          ISingleStudentPromotionRequest;


      const result =
        await promoteSingleStudent(
          schoolId,
          userId,
          studentId,
          data
        );


      res.status(200).json({
        success: true,

        message:
          "Student promotion completed successfully.",

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to promote student.",
      });
    }
  };


/* =====================================================
   STUDENT ENROLLMENT HISTORY

   GET
   /students/:studentId/enrollments
===================================================== */

export const getStudentEnrollmentHistoryController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
      } = getAuthContext(req);


      const studentId =
        typeof req.params.studentId ===
        "string"
          ? req.params.studentId
          : "";


      if (!studentId) {

        res.status(400).json({
          success: false,
          message:
            "studentId is required.",
        });

        return;
      }


      const result =
        await getStudentEnrollmentHistory(
          schoolId,
          studentId
        );


      res.status(200).json({
        success: true,

        data:
          result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to get student enrollment history.",
      });
    }
  };


/* =====================================================
   GET ENROLLMENT BY ID

   GET
   /students/enrollments/:enrollmentId
===================================================== */

export const getEnrollmentByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
      } = getAuthContext(req);


      const enrollmentId =
        typeof req.params.enrollmentId ===
        "string"
          ? req.params.enrollmentId
          : "";


      if (!enrollmentId) {

        res.status(400).json({
          success: false,
          message:
            "enrollmentId is required.",
        });

        return;
      }


      const enrollment =
        await getEnrollmentById(
          schoolId,
          enrollmentId
        );


      res.status(200).json({
        success: true,

        data:
          enrollment,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to get student enrollment.",
      });
    }
  };


/* =====================================================
   UPDATE ENROLLMENT

   PATCH
   /students/enrollments/:enrollmentId
===================================================== */

export const updateEnrollmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        schoolId,
        userId,
      } = getAuthContext(req);


      const enrollmentId =
        typeof req.params.enrollmentId ===
        "string"
          ? req.params.enrollmentId
          : "";


      if (!enrollmentId) {

        res.status(400).json({
          success: false,
          message:
            "enrollmentId is required.",
        });

        return;
      }


      /*
       * updatedBy request body se nahi lenge.
       * Logged-in School Admin ke JWT se aayega.
       */

      const body =
        req.body as
          Omit<
            IUpdateStudentEnrollmentData,
            "updatedBy"
          >;


      const data:
        IUpdateStudentEnrollmentData = {
        ...body,

        updatedBy:
          userId,
      };


      const enrollment =
        await updateEnrollment(
          schoolId,
          enrollmentId,
          data
        );


      res.status(200).json({
        success: true,

        message:
          "Student enrollment updated successfully.",

        data:
          enrollment,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update student enrollment.",
      });
    }
  };