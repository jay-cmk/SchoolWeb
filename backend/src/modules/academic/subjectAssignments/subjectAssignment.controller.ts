// import {
//   Request,
//   Response,
// } from "express";

// import {
//   createSubjectAssignment,
//   getSubjectAssignments,
//   getSubjectAssignmentById,
//   updateSubjectAssignment,
//   updateSubjectAssignmentStatus,
// } from "./subjectAssignment.service";


// // ============================================
// // CREATE SUBJECT ASSIGNMENT
// // ============================================

// export const createSubjectAssignmentController =
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
//         subjectId,
//         classId,
//         sectionId,
//         teacherId,
//         weeklyPeriods,
//       } = req.body;


//       // ========================================
//       // REQUIRED FIELDS
//       // ========================================

//       if (
//         !sessionId ||
//         !subjectId ||
//         !classId ||
//         !sectionId ||
//         !teacherId ||
//         weeklyPeriods === undefined
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Session, subject, class, section, teacher and weekly periods are required",
//         });

//         return;
//       }


//       const assignment =
//         await createSubjectAssignment(
//           schoolId,
//           {
//             sessionId,
//             subjectId,
//             classId,
//             sectionId,
//             teacherId,
//             weeklyPeriods,
//           }
//         );


//       res.status(201).json({
//         success: true,

//         message:
//           "Subject assignment created successfully",

//         data: {
//           assignment,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to create subject assignment",
//       });
//     }
//   };


// // ============================================
// // GET ALL SUBJECT ASSIGNMENTS
// // ============================================

// export const getSubjectAssignmentsController =
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


//       // ========================================
//       // HELPER
//       // ========================================

//       const getStringQuery = (
//         value: unknown
//       ): string | undefined => {
//         return typeof value ===
//           "string"
//           ? value
//           : undefined;
//       };


//       // ========================================
//       // READ QUERY PARAMS
//       // ========================================

//       const sessionId =
//         getStringQuery(
//           req.query.sessionId
//         );

//       const subjectId =
//         getStringQuery(
//           req.query.subjectId
//         );

//       const classId =
//         getStringQuery(
//           req.query.classId
//         );

//       const sectionId =
//         getStringQuery(
//           req.query.sectionId
//         );

//       const teacherId =
//         getStringQuery(
//           req.query.teacherId
//         );


//       // ========================================
//       // STATUS FILTER
//       // ========================================

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


//       // ========================================
//       // BUILD FILTERS
//       //
//       // exactOptionalPropertyTypes: true
//       // ke liye undefined properties object
//       // me explicitly nahi bhejenge
//       // ========================================

//       const filters: {
//         sessionId?: string;

//         subjectId?: string;

//         classId?: string;

//         sectionId?: string;

//         teacherId?: string;

//         isActive?: boolean;
//       } = {};


//       if (sessionId) {
//         filters.sessionId =
//           sessionId;
//       }


//       if (subjectId) {
//         filters.subjectId =
//           subjectId;
//       }


//       if (classId) {
//         filters.classId =
//           classId;
//       }


//       if (sectionId) {
//         filters.sectionId =
//           sectionId;
//       }


//       if (teacherId) {
//         filters.teacherId =
//           teacherId;
//       }


//       if (
//         isActive !== undefined
//       ) {
//         filters.isActive =
//           isActive;
//       }


//       // ========================================
//       // GET DATA
//       // ========================================

//       const assignments =
//         await getSubjectAssignments(
//           schoolId,
//           filters
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject assignments fetched successfully",

//         data: {
//           assignments,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to fetch subject assignments",
//       });
//     }
//   };


// // ============================================
// // GET SUBJECT ASSIGNMENT BY ID
// // ============================================

// export const getSubjectAssignmentByIdController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         assignmentId,
//       } = req.params;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,

//           message:
//             "School access required",
//         });

//         return;
//       }


//       if (
//         typeof assignmentId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid assignment ID",
//         });

//         return;
//       }


//       const assignment =
//         await getSubjectAssignmentById(
//           schoolId,
//           assignmentId
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject assignment fetched successfully",

//         data: {
//           assignment,
//         },
//       });

//     } catch (error) {
//       res.status(404).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Subject assignment not found",
//       });
//     }
//   };


// // ============================================
// // UPDATE SUBJECT ASSIGNMENT
// // ============================================

// export const updateSubjectAssignmentController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         assignmentId,
//       } = req.params;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,

//           message:
//             "School access required",
//         });

//         return;
//       }


//       if (
//         typeof assignmentId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid assignment ID",
//         });

//         return;
//       }


//       const {
//         teacherId,
//         weeklyPeriods,
//       } = req.body;


//       // ========================================
//       // BUILD UPDATE DATA SAFELY
//       // ========================================

//       const updateData: {
//         teacherId?: string;

//         weeklyPeriods?: number;
//       } = {};


//       if (
//         teacherId !==
//         undefined
//       ) {
//         updateData.teacherId =
//           teacherId;
//       }


//       if (
//         weeklyPeriods !==
//         undefined
//       ) {
//         updateData.weeklyPeriods =
//           weeklyPeriods;
//       }


//       // ========================================
//       // EMPTY UPDATE CHECK
//       // ========================================

//       if (
//         Object.keys(
//           updateData
//         ).length === 0
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "At least one field is required to update",
//         });

//         return;
//       }


//       const assignment =
//         await updateSubjectAssignment(
//           schoolId,
//           assignmentId,
//           updateData
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject assignment updated successfully",

//         data: {
//           assignment,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update subject assignment",
//       });
//     }
//   };


// // ============================================
// // UPDATE SUBJECT ASSIGNMENT STATUS
// // ============================================

// export const updateSubjectAssignmentStatusController =
//   async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const schoolId =
//         req.user?.schoolId;


//       const {
//         assignmentId,
//       } = req.params;


//       const {
//         isActive,
//       } = req.body;


//       if (!schoolId) {
//         res.status(403).json({
//           success: false,

//           message:
//             "School access required",
//         });

//         return;
//       }


//       if (
//         typeof assignmentId !==
//           "string"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "Invalid assignment ID",
//         });

//         return;
//       }


//       if (
//         typeof isActive !==
//           "boolean"
//       ) {
//         res.status(400).json({
//           success: false,

//           message:
//             "isActive must be boolean",
//         });

//         return;
//       }


//       const assignment =
//         await updateSubjectAssignmentStatus(
//           schoolId,
//           assignmentId,
//           isActive
//         );


//       res.status(200).json({
//         success: true,

//         message:
//           "Subject assignment status updated successfully",

//         data: {
//           assignment,
//         },
//       });

//     } catch (error) {
//       res.status(400).json({
//         success: false,

//         message:
//           error instanceof Error
//             ? error.message
//             : "Failed to update subject assignment status",
//       });
//     }
//   };







import {
  Request,
  Response,
} from "express";

import {
  createSubjectAssignment,
  getSubjectAssignments,
  getMySubjectAssignments,
  getSubjectAssignmentById,
  updateSubjectAssignment,
  updateSubjectAssignmentStatus,
} from "./subjectAssignment.service";


// ============================================
// CREATE SUBJECT ASSIGNMENT
// ============================================

export const createSubjectAssignmentController =
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
        subjectId,
        classId,
        sectionId,
        teacherId,
        weeklyPeriods,
      } = req.body;


      if (
        !sessionId ||
        !subjectId ||
        !classId ||
        !sectionId ||
        !teacherId ||
        weeklyPeriods === undefined
      ) {

        res.status(400).json({
          success: false,

          message:
            "Session, subject, class, section, teacher and weekly periods are required",
        });

        return;
      }


      const assignment =
        await createSubjectAssignment(
          schoolId,
          {
            sessionId,
            subjectId,
            classId,
            sectionId,
            teacherId,
            weeklyPeriods,
          }
        );


      res.status(201).json({
        success: true,

        message:
          "Subject assignment created successfully",

        data: {
          assignment,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to create subject assignment",
      });
    }
  };


// ============================================
// GET ALL SUBJECT ASSIGNMENTS
// ============================================

export const getSubjectAssignmentsController =
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


      const getStringQuery = (
        value: unknown
      ): string | undefined => {

        return typeof value ===
          "string"
          ? value
          : undefined;
      };


      const sessionId =
        getStringQuery(
          req.query.sessionId
        );

      const subjectId =
        getStringQuery(
          req.query.subjectId
        );

      const classId =
        getStringQuery(
          req.query.classId
        );

      const sectionId =
        getStringQuery(
          req.query.sectionId
        );

      const teacherId =
        getStringQuery(
          req.query.teacherId
        );


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


      const filters: {
        sessionId?: string;

        subjectId?: string;

        classId?: string;

        sectionId?: string;

        teacherId?: string;

        isActive?: boolean;
      } = {};


      if (sessionId) {
        filters.sessionId =
          sessionId;
      }


      if (subjectId) {
        filters.subjectId =
          subjectId;
      }


      if (classId) {
        filters.classId =
          classId;
      }


      if (sectionId) {
        filters.sectionId =
          sectionId;
      }


      if (teacherId) {
        filters.teacherId =
          teacherId;
      }


      if (
        isActive !== undefined
      ) {
        filters.isActive =
          isActive;
      }


      const assignments =
        await getSubjectAssignments(
          schoolId,
          filters
        );


      res.status(200).json({
        success: true,

        message:
          "Subject assignments fetched successfully",

        data: {
          assignments,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch subject assignments",
      });
    }
  };


// ============================================
// TEACHER - MY SUBJECTS / CLASSES
// ============================================

export const getMySubjectAssignmentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;

      const teacherId =
        req.user?.teacherId;

      const userId =
        req.user?.userId;


      if (
        !schoolId ||
        !teacherId ||
        !userId
      ) {

        res.status(403).json({
          success: false,

          message:
            "Teacher access required",
        });

        return;
      }


      const result =
        await getMySubjectAssignments(
          schoolId,
          teacherId,
          userId
        );


      res.status(200).json({
        success: true,

        message:
          "Teacher subject assignments fetched successfully",

        data: result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch teacher assignments",
      });
    }
  };


// ============================================
// GET SUBJECT ASSIGNMENT BY ID
// ============================================

export const getSubjectAssignmentByIdController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        assignmentId,
      } = req.params;


      if (!schoolId) {

        res.status(403).json({
          success: false,

          message:
            "School access required",
        });

        return;
      }


      if (
        typeof assignmentId !==
          "string"
      ) {

        res.status(400).json({
          success: false,

          message:
            "Invalid assignment ID",
        });

        return;
      }


      const assignment =
        await getSubjectAssignmentById(
          schoolId,
          assignmentId
        );


      res.status(200).json({
        success: true,

        message:
          "Subject assignment fetched successfully",

        data: {
          assignment,
        },
      });

    } catch (error) {

      res.status(404).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Subject assignment not found",
      });
    }
  };


// ============================================
// UPDATE SUBJECT ASSIGNMENT
// ============================================

export const updateSubjectAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        assignmentId,
      } = req.params;


      if (!schoolId) {

        res.status(403).json({
          success: false,

          message:
            "School access required",
        });

        return;
      }


      if (
        typeof assignmentId !==
          "string"
      ) {

        res.status(400).json({
          success: false,

          message:
            "Invalid assignment ID",
        });

        return;
      }


      const {
        teacherId,
        weeklyPeriods,
      } = req.body;


      const updateData: {
        teacherId?: string;

        weeklyPeriods?: number;
      } = {};


      if (
        teacherId !==
        undefined
      ) {
        updateData.teacherId =
          teacherId;
      }


      if (
        weeklyPeriods !==
        undefined
      ) {
        updateData.weeklyPeriods =
          weeklyPeriods;
      }


      if (
        Object.keys(
          updateData
        ).length === 0
      ) {

        res.status(400).json({
          success: false,

          message:
            "At least one field is required to update",
        });

        return;
      }


      const assignment =
        await updateSubjectAssignment(
          schoolId,
          assignmentId,
          updateData
        );


      res.status(200).json({
        success: true,

        message:
          "Subject assignment updated successfully",

        data: {
          assignment,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update subject assignment",
      });
    }
  };


// ============================================
// UPDATE SUBJECT ASSIGNMENT STATUS
// ============================================

export const updateSubjectAssignmentStatusController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        assignmentId,
      } = req.params;


      const {
        isActive,
      } = req.body;


      if (!schoolId) {

        res.status(403).json({
          success: false,

          message:
            "School access required",
        });

        return;
      }


      if (
        typeof assignmentId !==
          "string"
      ) {

        res.status(400).json({
          success: false,

          message:
            "Invalid assignment ID",
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


      const assignment =
        await updateSubjectAssignmentStatus(
          schoolId,
          assignmentId,
          isActive
        );


      res.status(200).json({
        success: true,

        message:
          "Subject assignment status updated successfully",

        data: {
          assignment,
        },
      });

    } catch (error) {

      res.status(400).json({
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update subject assignment status",
      });
    }
  };