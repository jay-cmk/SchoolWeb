// import type {
//   Request,
//   Response,
// } from "express";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import {
//   changeHomeworkStatus,
//   createHomework,
//   deleteHomework,
//   getHomeworkById,
//   getHomeworks,
//   getHomeworkStats,
//   updateHomework,
// } from "./homework.service";


// // ============================================
// // CREATE HOMEWORK
// // ============================================

// export const createHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;


//       if (
//         !schoolId
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !userId
//       ) {
//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });
//       }


//       const {
//         sessionId,
//         classId,
//         sectionId,
//         subjectId,
//         teacherId,
//         title,
//         description,
//         assignedDate,
//         dueDate,
//         status,
//         attachment,
//       } = req.body;


//       if (
//         !sessionId ||
//         !classId ||
//         !sectionId ||
//         !subjectId ||
//         !teacherId ||
//         !title ||
//         !description ||
//         !assignedDate ||
//         !dueDate
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Required homework fields are missing",
//         });
//       }


//       const homework =
//         await createHomework(
//           schoolId,
//           userId,
//           {
//             sessionId,

//             classId,

//             sectionId,

//             subjectId,

//             teacherId,

//             title,

//             description,

//             assignedDate,

//             dueDate,

//             ...(status !==
//             undefined
//               ? {
//                   status,
//                 }
//               : {}),

//             ...(attachment !==
//             undefined
//               ? {
//                   attachment,
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         201
//       ).json({
//         success: true,

//         message:
//           "Homework created successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to create homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // GET HOMEWORK LIST
// // ============================================

// export const getHomeworksController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       const filters = {
//         ...(typeof req.query.sessionId ===
//         "string"
//           ? {
//               sessionId:
//                 req.query.sessionId,
//             }
//           : {}),

//         ...(typeof req.query.classId ===
//         "string"
//           ? {
//               classId:
//                 req.query.classId,
//             }
//           : {}),

//         ...(typeof req.query.sectionId ===
//         "string"
//           ? {
//               sectionId:
//                 req.query.sectionId,
//             }
//           : {}),

//         ...(typeof req.query.subjectId ===
//         "string"
//           ? {
//               subjectId:
//                 req.query.subjectId,
//             }
//           : {}),

//         ...(typeof req.query.teacherId ===
//         "string"
//           ? {
//               teacherId:
//                 req.query.teacherId,
//             }
//           : {}),

//         ...(typeof req.query.status ===
//         "string"
//           ? {
//               status:
//                 req.query.status as HomeworkStatus,
//             }
//           : {}),

//         ...(typeof req.query.fromDate ===
//         "string"
//           ? {
//               fromDate:
//                 req.query.fromDate,
//             }
//           : {}),

//         ...(typeof req.query.toDate ===
//         "string"
//           ? {
//               toDate:
//                 req.query.toDate,
//             }
//           : {}),

//         ...(typeof req.query.search ===
//         "string"
//           ? {
//               search:
//                 req.query.search,
//             }
//           : {}),

//         ...(typeof req.query.page ===
//         "string"
//           ? {
//               page:
//                 Number(
//                   req.query.page
//                 ),
//             }
//           : {}),

//         ...(typeof req.query.limit ===
//         "string"
//           ? {
//               limit:
//                 Number(
//                   req.query.limit
//                 ),
//             }
//           : {}),
//       };


//       const result =
//         await getHomeworks(
//           schoolId,
//           filters
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: result,
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // GET HOMEWORK BY ID
// // ============================================

// export const getHomeworkByIdController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const homework =
//         await getHomeworkById(
//           schoolId,
//           homeworkId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // UPDATE HOMEWORK
// // ============================================

// export const updateHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const homework =
//         await updateHomework(
//           schoolId,
//           homeworkId,
//           userId,
//           req.body
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework updated successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // CHANGE HOMEWORK STATUS
// // ============================================

// export const changeHomeworkStatusController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;

//       const {
//         status,
//       } = req.body;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       if (
//         !status
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework status is required",
//         });

//       }


//       if (
//         !Object.values(
//           HomeworkStatus
//         ).includes(
//           status as HomeworkStatus
//         )
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Invalid homework status",
//         });

//       }


//       const homework =
//         await changeHomeworkStatus(
//           schoolId,
//           homeworkId,
//           userId,
//           status as HomeworkStatus
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework status updated successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework status";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // DELETE HOMEWORK
// // ============================================

// export const deleteHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const result =
//         await deleteHomework(
//           schoolId,
//           homeworkId,
//           userId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         ...result,
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to delete homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // HOMEWORK STATS
// // ============================================

// export const getHomeworkStatsController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       const stats =
//         await getHomeworkStats(
//           schoolId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           stats,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework stats";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };








// import type {
//   Request,
//   Response,
// } from "express";

// import {
//   HomeworkStatus,
// } from "./homework.types";

// import {
//   changeHomeworkStatus,
//   createHomework,
//   deleteHomework,
//   getHomeworkById,
//   getHomeworks,
//   getHomeworkStats,
//   getMyHomeworks,
//   updateHomework,
// } from "./homework.service";


// // ============================================
// // CREATE HOMEWORK
// // ============================================

// export const createHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;


//       if (
//         !schoolId
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !userId
//       ) {
//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });
//       }


//       const {
//         sessionId,
//         classId,
//         sectionId,
//         subjectId,
//         teacherId,
//         title,
//         description,
//         assignedDate,
//         dueDate,
//         status,
//         attachment,
//       } = req.body;


//       if (
//         !sessionId ||
//         !classId ||
//         !sectionId ||
//         !subjectId ||
//         !teacherId ||
//         !title ||
//         !description ||
//         !assignedDate ||
//         !dueDate
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Required homework fields are missing",
//         });
//       }


//       const homework =
//         await createHomework(
//           schoolId,
//           userId,
//           {
//             sessionId,

//             classId,

//             sectionId,

//             subjectId,

//             teacherId,

//             title,

//             description,

//             assignedDate,

//             dueDate,

//             ...(status !==
//             undefined
//               ? {
//                   status,
//                 }
//               : {}),

//             ...(attachment !==
//             undefined
//               ? {
//                   attachment,
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         201
//       ).json({
//         success: true,

//         message:
//           "Homework created successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to create homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // GET HOMEWORK LIST
// // ============================================

// export const getHomeworksController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       const filters = {
//         ...(typeof req.query.sessionId ===
//         "string"
//           ? {
//               sessionId:
//                 req.query.sessionId,
//             }
//           : {}),

//         ...(typeof req.query.classId ===
//         "string"
//           ? {
//               classId:
//                 req.query.classId,
//             }
//           : {}),

//         ...(typeof req.query.sectionId ===
//         "string"
//           ? {
//               sectionId:
//                 req.query.sectionId,
//             }
//           : {}),

//         ...(typeof req.query.subjectId ===
//         "string"
//           ? {
//               subjectId:
//                 req.query.subjectId,
//             }
//           : {}),

//         ...(typeof req.query.teacherId ===
//         "string"
//           ? {
//               teacherId:
//                 req.query.teacherId,
//             }
//           : {}),

//         ...(typeof req.query.status ===
//         "string"
//           ? {
//               status:
//                 req.query.status as HomeworkStatus,
//             }
//           : {}),

//         ...(typeof req.query.fromDate ===
//         "string"
//           ? {
//               fromDate:
//                 req.query.fromDate,
//             }
//           : {}),

//         ...(typeof req.query.toDate ===
//         "string"
//           ? {
//               toDate:
//                 req.query.toDate,
//             }
//           : {}),

//         ...(typeof req.query.search ===
//         "string"
//           ? {
//               search:
//                 req.query.search,
//             }
//           : {}),

//         ...(typeof req.query.page ===
//         "string"
//           ? {
//               page:
//                 Number(
//                   req.query.page
//                 ),
//             }
//           : {}),

//         ...(typeof req.query.limit ===
//         "string"
//           ? {
//               limit:
//                 Number(
//                   req.query.limit
//                 ),
//             }
//           : {}),
//       };


//       const result =
//         await getHomeworks(
//           schoolId,
//           filters
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: result,
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // GET HOMEWORK BY ID
// // ============================================

// export const getHomeworkByIdController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const homework =
//         await getHomeworkById(
//           schoolId,
//           homeworkId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // UPDATE HOMEWORK
// // ============================================

// export const updateHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const homework =
//         await updateHomework(
//           schoolId,
//           homeworkId,
//           userId,
//           req.body
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework updated successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // CHANGE HOMEWORK STATUS
// // ============================================

// export const changeHomeworkStatusController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;

//       const {
//         status,
//       } = req.body;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       if (
//         !status
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework status is required",
//         });

//       }


//       if (
//         !Object.values(
//           HomeworkStatus
//         ).includes(
//           status as HomeworkStatus
//         )
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Invalid homework status",
//         });

//       }


//       const homework =
//         await changeHomeworkStatus(
//           schoolId,
//           homeworkId,
//           userId,
//           status as HomeworkStatus
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework status updated successfully",

//         data: {
//           homework,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework status";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // DELETE HOMEWORK
// // ============================================

// export const deleteHomeworkController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const userId =
//         req.user?.userId;

//       const {
//         homeworkId,
//       } = req.params;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       if (
//         !userId
//       ) {

//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "User ID not found in token",
//         });

//       }


//       if (
//         !homeworkId ||
//         typeof homeworkId !==
//           "string"
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Homework ID is required",
//         });

//       }


//       const result =
//         await deleteHomework(
//           schoolId,
//           homeworkId,
//           userId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         ...result,
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to delete homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };


// // ============================================
// // HOMEWORK STATS
// // ============================================

// export const getHomeworkStatsController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (
//         !schoolId
//       ) {

//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });

//       }


//       const stats =
//         await getHomeworkStats(
//           schoolId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           stats,
//         },
//       });

//     } catch (
//       error
//     ) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework stats";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };

// // ============================================
// // STUDENT - MY HOMEWORK
// //
// // GET /api/v1/homework/me
// // ============================================

// export const getMyHomeworksController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const studentId =
//         req.user?.studentId;


//       if (!schoolId) {
//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "School ID not found in token",
//         });
//       }


//       if (!studentId) {
//         return res.status(
//           401
//         ).json({
//           success: false,

//           message:
//             "Student ID not found in token",
//         });
//       }


//       const result =
//         await getMyHomeworks(
//           schoolId,
//           studentId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "My homework fetched successfully",

//         data:
//           result,
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch my homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });

//     }

//   };







import type {
  Request,
  Response,
} from "express";

import {
  UserRole,
} from "../../constants/roles";

import {
  HomeworkStatus,
} from "./homework.types";

import type {
  CreateHomeworkData,
  HomeworkFilters,
  UpdateHomeworkData,
} from "./homework.types";

import {
  changeHomeworkStatus,
  createHomework,
  deleteHomework,
  getHomeworkById,
  getHomeworks,
  getHomeworkStats,
  getMyHomeworks,
  updateHomework,
} from "./homework.service";


// ============================================
// HELPER
// GET TEACHER ID FOR TEACHER REQUEST
//
// SCHOOL_ADMIN:
// returns undefined
//
// TEACHER:
// teacherId MUST exist in JWT
// ============================================

const getActorTeacherId = (
  req: Request
): string | undefined => {

  if (
    req.user?.role !==
    UserRole.TEACHER
  ) {
    return undefined;
  }


  const teacherId =
    req.user?.teacherId;


  if (!teacherId) {
    throw new Error(
      "Teacher ID not found in token"
    );
  }


  return teacherId;
};


// ============================================
// CREATE HOMEWORK
//
// SCHOOL_ADMIN:
// teacherId comes from request body.
//
// TEACHER:
// teacherId comes from JWT.
// Body teacherId cannot override it.
// ============================================

export const createHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      // ========================================
      // BODY
      // ========================================

      const {
        sessionId,
        classId,
        sectionId,
        subjectId,
        teacherId,
        title,
        description,
        assignedDate,
        dueDate,
        status,
        attachment,
      } = req.body;


      // ========================================
      // COMMON REQUIRED FIELDS
      // ========================================

      if (
        typeof sessionId !==
          "string" ||
        !sessionId ||
        typeof classId !==
          "string" ||
        !classId ||
        typeof sectionId !==
          "string" ||
        !sectionId ||
        typeof subjectId !==
          "string" ||
        !subjectId ||
        typeof title !==
          "string" ||
        !title ||
        typeof description !==
          "string" ||
        !description ||
        !assignedDate ||
        !dueDate
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Required homework fields are missing",
          });
      }


      // ========================================
      // SCHOOL ADMIN MUST PROVIDE teacherId
      //
      // Teacher does NOT need body teacherId.
      // ========================================

      if (
        !actorTeacherId &&
        (
          typeof teacherId !==
            "string" ||
          !teacherId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Teacher ID is required",
          });
      }


      // ========================================
      // STATUS VALIDATION
      // ========================================

      if (
        status !==
          undefined &&
        !Object.values(
          HomeworkStatus
        ).includes(
          status as HomeworkStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid homework status",
          });
      }


      // ========================================
      // BUILD PAYLOAD
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const payload:
        CreateHomeworkData = {

        sessionId,

        classId,

        sectionId,

        subjectId,

        // School Admin:
        // actual body teacherId
        //
        // Teacher:
        // service will override with actorTeacherId
        teacherId:
          typeof teacherId ===
            "string" &&
          teacherId
            ? teacherId
            : actorTeacherId!,

        title,

        description,

        assignedDate,

        dueDate,
      };


      if (
        status !==
        undefined
      ) {
        payload.status =
          status as HomeworkStatus;
      }


      if (
        attachment !==
        undefined
      ) {
        payload.attachment =
          attachment;
      }


      // ========================================
      // SERVICE
      // ========================================

      const homework =
        await createHomework(
          schoolId,
          userId,
          payload,
          actorTeacherId
        );


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Homework created successfully",

          data: {
            homework,
          },
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// GET HOMEWORK LIST
//
// SCHOOL_ADMIN:
// Can view school homework.
//
// TEACHER:
// Service forces JWT teacherId.
// ============================================

export const getHomeworksController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      // ========================================
      // AUTH
      // ========================================

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      // ========================================
      // FILTERS
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const filters:
        HomeworkFilters = {};


      // ========================================
      // SESSION
      // ========================================

      if (
        typeof req.query.sessionId ===
          "string"
      ) {
        filters.sessionId =
          req.query.sessionId;
      }


      // ========================================
      // CLASS
      // ========================================

      if (
        typeof req.query.classId ===
          "string"
      ) {
        filters.classId =
          req.query.classId;
      }


      // ========================================
      // SECTION
      // ========================================

      if (
        typeof req.query.sectionId ===
          "string"
      ) {
        filters.sectionId =
          req.query.sectionId;
      }


      // ========================================
      // SUBJECT
      // ========================================

      if (
        typeof req.query.subjectId ===
          "string"
      ) {
        filters.subjectId =
          req.query.subjectId;
      }


      // ========================================
      // TEACHER FILTER
      //
      // SCHOOL_ADMIN only.
      //
      // Teacher query teacherId will be ignored
      // by service because actorTeacherId wins.
      // ========================================

      if (
        typeof req.query.teacherId ===
          "string"
      ) {
        filters.teacherId =
          req.query.teacherId;
      }


      // ========================================
      // STATUS
      // ========================================

      if (
        typeof req.query.status ===
          "string"
      ) {

        if (
          !Object.values(
            HomeworkStatus
          ).includes(
            req.query.status as HomeworkStatus
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid homework status",
            });
        }


        filters.status =
          req.query.status as HomeworkStatus;
      }


      // ========================================
      // FROM DATE
      // ========================================

      if (
        typeof req.query.fromDate ===
          "string"
      ) {
        filters.fromDate =
          req.query.fromDate;
      }


      // ========================================
      // TO DATE
      // ========================================

      if (
        typeof req.query.toDate ===
          "string"
      ) {
        filters.toDate =
          req.query.toDate;
      }


      // ========================================
      // SEARCH
      // ========================================

      if (
        typeof req.query.search ===
          "string"
      ) {
        filters.search =
          req.query.search;
      }


      // ========================================
      // PAGE
      // ========================================

      if (
        typeof req.query.page ===
          "string"
      ) {

        const page =
          Number(
            req.query.page
          );


        if (
          !Number.isInteger(
            page
          ) ||
          page < 1
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid page",
            });
        }


        filters.page =
          page;
      }


      // ========================================
      // LIMIT
      // ========================================

      if (
        typeof req.query.limit ===
          "string"
      ) {

        const limit =
          Number(
            req.query.limit
          );


        if (
          !Number.isInteger(
            limit
          ) ||
          limit < 1
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid limit",
            });
        }


        filters.limit =
          limit;
      }


      // ========================================
      // SERVICE
      // ========================================

      const result =
        await getHomeworks(
          schoolId,
          filters,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Homework fetched successfully",

          data:
            result,
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// GET HOMEWORK BY ID
//
// Teacher can access only own homework.
// ============================================

export const getHomeworkByIdController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      const {
        homeworkId,
      } = req.params;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Homework ID is required",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      const homework =
        await getHomeworkById(
          schoolId,
          homeworkId,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Homework fetched successfully",

          data: {
            homework,
          },
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// UPDATE HOMEWORK
//
// Teacher can update only own homework.
// Teacher cannot change homework teacherId.
// ============================================

export const updateHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Homework ID is required",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      // ========================================
      // BUILD UPDATE PAYLOAD
      //
      // exactOptionalPropertyTypes safe
      // ========================================

      const payload:
        UpdateHomeworkData = {};


      if (
        typeof req.body.sessionId ===
          "string"
      ) {
        payload.sessionId =
          req.body.sessionId;
      }


      if (
        typeof req.body.classId ===
          "string"
      ) {
        payload.classId =
          req.body.classId;
      }


      if (
        typeof req.body.sectionId ===
          "string"
      ) {
        payload.sectionId =
          req.body.sectionId;
      }


      if (
        typeof req.body.subjectId ===
          "string"
      ) {
        payload.subjectId =
          req.body.subjectId;
      }


      // ========================================
      // TEACHER ID
      //
      // School Admin can change teacher.
      //
      // Teacher cannot transfer homework.
      // Service also protects this.
      // ========================================

      if (
        !actorTeacherId &&
        typeof req.body.teacherId ===
          "string"
      ) {
        payload.teacherId =
          req.body.teacherId;
      }


      if (
        typeof req.body.title ===
          "string"
      ) {
        payload.title =
          req.body.title;
      }


      if (
        typeof req.body.description ===
          "string"
      ) {
        payload.description =
          req.body.description;
      }


      if (
        req.body.assignedDate !==
        undefined
      ) {
        payload.assignedDate =
          req.body.assignedDate;
      }


      if (
        req.body.dueDate !==
        undefined
      ) {
        payload.dueDate =
          req.body.dueDate;
      }


      // ========================================
      // STATUS
      // ========================================

      if (
        req.body.status !==
        undefined
      ) {

        if (
          !Object.values(
            HomeworkStatus
          ).includes(
            req.body.status as HomeworkStatus
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Invalid homework status",
            });
        }


        payload.status =
          req.body.status as HomeworkStatus;
      }


      // ========================================
      // ATTACHMENT
      // ========================================

      if (
        req.body.attachment !==
        undefined
      ) {
        payload.attachment =
          req.body.attachment;
      }


      // ========================================
      // SERVICE
      // ========================================

      const homework =
        await updateHomework(
          schoolId,
          homeworkId,
          userId,
          payload,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Homework updated successfully",

          data: {
            homework,
          },
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// CHANGE HOMEWORK STATUS
//
// Teacher can change status only
// for own homework.
// ============================================

export const changeHomeworkStatusController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;

      const {
        status,
      } = req.body;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Homework ID is required",
          });
      }


      if (!status) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Homework status is required",
          });
      }


      if (
        !Object.values(
          HomeworkStatus
        ).includes(
          status as HomeworkStatus
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid homework status",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      const homework =
        await changeHomeworkStatus(
          schoolId,
          homeworkId,
          userId,
          status as HomeworkStatus,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Homework status updated successfully",

          data: {
            homework,
          },
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework status";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// DELETE HOMEWORK
//
// Teacher can soft-delete only own homework.
// ============================================

export const deleteHomeworkController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const userId =
        req.user?.userId;

      const {
        homeworkId,
      } = req.params;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "User ID not found in token",
          });
      }


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Homework ID is required",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      const result =
        await deleteHomework(
          schoolId,
          homeworkId,
          userId,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          ...result,
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// HOMEWORK STATS
//
// SCHOOL_ADMIN:
// Whole school.
//
// TEACHER:
// Own homework only.
// ============================================

export const getHomeworkStatsController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      const stats =
        await getHomeworkStats(
          schoolId,
          actorTeacherId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Homework stats fetched successfully",

          data: {
            stats,
          },
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework stats";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };


// ============================================
// STUDENT - MY HOMEWORK
//
// GET /api/v1/homework/me
//
// IMPORTANT:
// Existing Student flow remains unchanged.
// ============================================

export const getMyHomeworksController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const studentId =
        req.user?.studentId;


      if (!schoolId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "School ID not found in token",
          });
      }


      if (!studentId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Student ID not found in token",
          });
      }


      const result =
        await getMyHomeworks(
          schoolId,
          studentId
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "My homework fetched successfully",

          data:
            result,
        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch my homework";


      return res
        .status(400)
        .json({
          success: false,

          message,
        });
    }

  };