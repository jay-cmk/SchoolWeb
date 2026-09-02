// import {
//   Request,
//   Response,
// } from "express";

// import {
//   createSubject,
//   getSubjects,
//   getSubjectById,
//   updateSubject,
//   updateSubjectStatus,
// } from "./subject.service";

// import type {
//   SubjectType,
// } from "./subject.types";


// // ============================================
// // CREATE SUBJECT
// // ============================================

// export const createSubjectController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,
//           message:
//             "School access required",
//         });

//         return;
//       }


//       const {
//         sessionId,
//         name,
//         code,
//         description,
//         subjectType,
//       } = req.body;


//       if (
//         !sessionId ||
//         !name ||
//         !code ||
//         !subjectType
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Session ID, subject name, code and subject type are required",
//         });

//         return;
//       }


//       const subject =
//         await createSubject(
//           schoolId,
//           {
//             sessionId,
//             name,
//             code,
//             subjectType,

//             ...(description !==
//             undefined
//               ? {
//                   description,
//                 }
//               : {}),
//           }
//         );


//       res.status(201).json({
//         success: true,

//         message:
//           "Subject created successfully",

//         data: {
//           subject,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to create subject",
//       });
//     }
//   };


// // ============================================
// // GET ALL SUBJECTS
// // ============================================

// export const getSubjectsController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,
//           message:
//             "School access required",
//         });

//         return;
//       }


//       const sessionId =
//         typeof req.query
//           .sessionId ===
//         "string"
//           ? req.query
//               .sessionId
//           : undefined;


//       const subjectType =
//         typeof req.query
//           .subjectType ===
//         "string"
//           ? (
//               req.query
//                 .subjectType as SubjectType
//             )
//           : undefined;


//       let isActive:
//         | boolean
//         | undefined;


//       if (
//         req.query.isActive ===
//         "true"
//       ) {
//         isActive = true;
//       }


//       if (
//         req.query.isActive ===
//         "false"
//       ) {
//         isActive = false;
//       }


//       const subjects =
//         await getSubjects(
//           schoolId,
//           sessionId,
//           subjectType,
//           isActive
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subjects fetched successfully",

//         data: {
//           subjects,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch subjects",
//       });
//     }
//   };


// // ============================================
// // GET SUBJECT BY ID
// // ============================================

// export const getSubjectByIdController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const {
//         subjectId,
//       } = req.params;


//       if (
//         !schoolId ||
//         typeof subjectId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
//         });

//         return;
//       }


//       const subject =
//         await getSubjectById(
//           schoolId,
//           subjectId
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject fetched successfully",

//         data: {
//           subject,
//         },
//       });

//     } catch (error) {
//       res.status(404).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Subject not found",
//       });
//     }
//   };


// // ============================================
// // UPDATE SUBJECT
// // ============================================

// export const updateSubjectController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const {
//         subjectId,
//       } = req.params;


//       if (
//         !schoolId ||
//         typeof subjectId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
//         });

//         return;
//       }


//       const subject =
//         await updateSubject(
//           schoolId,
//           subjectId,
//           req.body
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject updated successfully",

//         data: {
//           subject,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update subject",
//       });
//     }
//   };


// // ============================================
// // UPDATE STATUS
// // ============================================

// export const updateSubjectStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;

//       const {
//         subjectId,
//       } = req.params;

//       const {
//         isActive,
//       } = req.body;


//       if (
//         !schoolId ||
//         typeof subjectId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid request",
//         });

//         return;
//       }


//       if (
//         typeof isActive !==
//         "boolean"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "isActive must be boolean",
//         });

//         return;
//       }


//       const subject =
//         await updateSubjectStatus(
//           schoolId,
//           subjectId,
//           isActive
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject status updated successfully",

//         data: {
//           subject,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update subject status",
//       });
//     }
//   };








import {
  Request,
  Response,
} from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  updateSubjectStatus,
  getMySubjects,
} from "./subject.service";

import type {
  SubjectType,
} from "./subject.types";


// ============================================
// CREATE SUBJECT
// ============================================

export const createSubjectController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        res.status(403).json({
          success: false,
          message:
            "School access required",
        });

        return;
      }


      const {
        sessionId,
        name,
        code,
        description,
        subjectType,
      } = req.body;


      if (
        !sessionId ||
        !name ||
        !code ||
        !subjectType
      ) {
        res.status(400).json({
          success: false,

          message:
            "Session ID, subject name, code and subject type are required",
        });

        return;
      }


      const subject =
        await createSubject(
          schoolId,
          {
            sessionId,
            name,
            code,
            subjectType,

            ...(description !==
            undefined
              ? {
                  description,
                }
              : {}),
          }
        );


      res.status(201).json({
        success: true,

        message:
          "Subject created successfully",

        data: {
          subject,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to create subject",
      });
    }
  };


// ============================================
// GET ALL SUBJECTS
// ============================================

export const getSubjectsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        res.status(403).json({
          success: false,
          message:
            "School access required",
        });

        return;
      }


      const sessionId =
        typeof req.query
          .sessionId ===
        "string"
          ? req.query
              .sessionId
          : undefined;


      const subjectType =
        typeof req.query
          .subjectType ===
        "string"
          ? (
              req.query
                .subjectType as SubjectType
            )
          : undefined;


      let isActive:
        | boolean
        | undefined;


      if (
        req.query.isActive ===
        "true"
      ) {
        isActive = true;
      }


      if (
        req.query.isActive ===
        "false"
      ) {
        isActive = false;
      }


      const subjects =
        await getSubjects(
          schoolId,
          sessionId,
          subjectType,
          isActive
        );


      res.status(200).json({
        success: true,

        message:
          "Subjects fetched successfully",

        data: {
          subjects,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch subjects",
      });
    }
  };


// ============================================
// STUDENT - MY SUBJECTS
//
// GET /api/v1/subjects/me
// ============================================

export const getMySubjectsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {

      const schoolId =
        req.user?.schoolId;

      const studentId =
        req.user?.studentId;


      if (!schoolId) {
        res.status(401).json({
          success: false,

          message:
            "School ID not found in token",
        });

        return;
      }


      if (!studentId) {
        res.status(401).json({
          success: false,

          message:
            "Student ID not found in token",
        });

        return;
      }


      const data =
        await getMySubjects(
          schoolId,
          studentId
        );


      res.status(200).json({
        success: true,

        message:
          "My subjects fetched successfully",

        data,
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch my subjects",
      });
    }
  };


// ============================================
// GET SUBJECT BY ID
// ============================================

export const getSubjectByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        subjectId,
      } = req.params;


      if (
        !schoolId ||
        typeof subjectId !==
          "string"
      ) {
        res.status(400).json({
          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      const subject =
        await getSubjectById(
          schoolId,
          subjectId
        );


      res.status(200).json({
        success: true,

        message:
          "Subject fetched successfully",

        data: {
          subject,
        },
      });

    } catch (error) {
      res.status(404).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Subject not found",
      });
    }
  };


// ============================================
// UPDATE SUBJECT
// ============================================

export const updateSubjectController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        subjectId,
      } = req.params;


      if (
        !schoolId ||
        typeof subjectId !==
          "string"
      ) {
        res.status(400).json({
          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      const subject =
        await updateSubject(
          schoolId,
          subjectId,
          req.body
        );


      res.status(200).json({
        success: true,

        message:
          "Subject updated successfully",

        data: {
          subject,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update subject",
      });
    }
  };


// ============================================
// UPDATE STATUS
// ============================================

export const updateSubjectStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const schoolId =
        req.user?.schoolId;

      const {
        subjectId,
      } = req.params;

      const {
        isActive,
      } = req.body;


      if (
        !schoolId ||
        typeof subjectId !==
          "string"
      ) {
        res.status(400).json({
          success: false,

          message:
            "Invalid request",
        });

        return;
      }


      if (
        typeof isActive !==
        "boolean"
      ) {
        res.status(400).json({
          success: false,

          message:
            "isActive must be boolean",
        });

        return;
      }


      const subject =
        await updateSubjectStatus(
          schoolId,
          subjectId,
          isActive
        );


      res.status(200).json({
        success: true,

        message:
          "Subject status updated successfully",

        data: {
          subject,
        },
      });

    } catch (error) {
      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update subject status",
      });
    }
  };
