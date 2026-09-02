// import type {
//   Request,
//   Response,
// } from "express";

// import {
//   HomeworkReviewStatus,
//   HomeworkSubmissionStatus,
// } from "./homeworkSubmission.types";

// import {
//   createHomeworkSubmission,
//   deleteHomeworkSubmission,
//   getHomeworkSubmissionById,
//   getHomeworkSubmissions,
//   getHomeworkSubmissionStats,
//   getStudentHomeworkSubmission,
//   reviewHomeworkSubmission,
//   updateHomeworkSubmission,
// } from "./homeworkSubmission.service";


// // ======================================================
// // CREATE HOMEWORK SUBMISSION
// // ======================================================

// export const createHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       const {
//         homeworkId,
//         studentId,
//         submissionText,
//         attachment,
//       } = req.body;


//       if (
//         !homeworkId ||
//         !studentId
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Homework ID and Student ID are required",
//         });
//       }


//       const submission =
//         await createHomeworkSubmission(
//           schoolId,
//           {
//             homeworkId,
//             studentId,

//             ...(submissionText !== undefined
//               ? {
//                   submissionText,
//                 }
//               : {}),

//             ...(attachment !== undefined
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
//           "Homework submitted successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to submit homework";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSIONS
// // ======================================================

// export const getHomeworkSubmissionsController =
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


//       if (!schoolId) {
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


//       const filters = {

//         ...(typeof req.query.studentId ===
//         "string"
//           ? {
//               studentId:
//                 req.query.studentId,
//             }
//           : {}),


//         ...(typeof req.query.submissionStatus ===
//         "string"
//           ? {
//               submissionStatus:
//                 req.query
//                   .submissionStatus as
//                   HomeworkSubmissionStatus,
//             }
//           : {}),


//         ...(typeof req.query.reviewStatus ===
//         "string"
//           ? {
//               reviewStatus:
//                 req.query
//                   .reviewStatus as
//                   HomeworkReviewStatus,
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
//         await getHomeworkSubmissions(
//           schoolId,
//           homeworkId,
//           filters
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,
//         data: result,
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework submissions";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION STATS
// // ======================================================

// export const getHomeworkSubmissionStatsController =
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


//       if (!schoolId) {
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


//       const stats =
//         await getHomeworkSubmissionStats(
//           schoolId,
//           homeworkId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           stats,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch submission stats";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET SINGLE SUBMISSION
// // ======================================================

// export const getHomeworkSubmissionByIdController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const submission =
//         await getHomeworkSubmissionById(
//           schoolId,
//           submissionId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // UPDATE HOMEWORK SUBMISSION
// // ======================================================

// export const updateHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const {
//         submissionText,
//         attachment,
//       } = req.body;


//       const submission =
//         await updateHomeworkSubmission(
//           schoolId,
//           submissionId,
//           {
//             ...(submissionText !== undefined
//               ? {
//                   submissionText,
//                 }
//               : {}),

//             ...(attachment !== undefined
//               ? {
//                   attachment,
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework submission updated successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // REVIEW HOMEWORK SUBMISSION
// // ======================================================

// export const reviewHomeworkSubmissionController =
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
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (!userId) {
//         return res.status(
//           401
//         ).json({
//           success: false,
//           message:
//             "User ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const {
//         remarks,
//         marks,
//       } = req.body;


//       const submission =
//         await reviewHomeworkSubmission(
//           schoolId,
//           submissionId,
//           userId,
//           {
//             ...(remarks !== undefined
//               ? {
//                   remarks,
//                 }
//               : {}),

//             ...(marks !== undefined
//               ? {
//                   marks:
//                     Number(marks),
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework submission reviewed successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to review homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // DELETE HOMEWORK SUBMISSION
// // ======================================================

// export const deleteHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const result =
//         await deleteHomeworkSubmission(
//           schoolId,
//           submissionId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,
//         ...result,
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to delete homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET STUDENT SUBMISSION FOR HOMEWORK
// // ======================================================

// export const getStudentHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         homeworkId,
//         studentId,
//       } = req.params;


//       if (!schoolId) {
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


//       if (
//         !studentId ||
//         typeof studentId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Student ID is required",
//         });
//       }


//       const submission =
//         await getStudentHomeworkSubmission(
//           schoolId,
//           homeworkId,
//           studentId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch student homework submission";


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
//   HomeworkReviewStatus,
//   HomeworkSubmissionStatus,
// } from "./homeworkSubmission.types";

// import {
//   createHomeworkSubmission,
//   createMyHomeworkSubmission,
//   deleteHomeworkSubmission,
//   getHomeworkSubmissionById,
//   getHomeworkSubmissions,
//   getHomeworkSubmissionStats,
//   getMyHomeworkSubmissions,
//   getStudentHomeworkSubmission,
//   reviewHomeworkSubmission,
//   updateHomeworkSubmission,
//   updateMyHomeworkSubmission,
// } from "./homeworkSubmission.service";


// // ======================================================
// // CREATE HOMEWORK SUBMISSION
// // ======================================================

// export const createHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       const {
//         homeworkId,
//         studentId,
//         submissionText,
//         attachment,
//       } = req.body;


//       if (
//         !homeworkId ||
//         !studentId
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Homework ID and Student ID are required",
//         });
//       }


//       const submission =
//         await createHomeworkSubmission(
//           schoolId,
//           {
//             homeworkId,
//             studentId,

//             ...(submissionText !== undefined
//               ? {
//                   submissionText,
//                 }
//               : {}),

//             ...(attachment !== undefined
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
//           "Homework submitted successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to submit homework";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSIONS
// // ======================================================

// export const getHomeworkSubmissionsController =
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


//       if (!schoolId) {
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


//       const filters = {

//         ...(typeof req.query.studentId ===
//         "string"
//           ? {
//               studentId:
//                 req.query.studentId,
//             }
//           : {}),


//         ...(typeof req.query.submissionStatus ===
//         "string"
//           ? {
//               submissionStatus:
//                 req.query
//                   .submissionStatus as
//                   HomeworkSubmissionStatus,
//             }
//           : {}),


//         ...(typeof req.query.reviewStatus ===
//         "string"
//           ? {
//               reviewStatus:
//                 req.query
//                   .reviewStatus as
//                   HomeworkReviewStatus,
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
//         await getHomeworkSubmissions(
//           schoolId,
//           homeworkId,
//           filters
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,
//         data: result,
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework submissions";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET HOMEWORK SUBMISSION STATS
// // ======================================================

// export const getHomeworkSubmissionStatsController =
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


//       if (!schoolId) {
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


//       const stats =
//         await getHomeworkSubmissionStats(
//           schoolId,
//           homeworkId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           stats,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch submission stats";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET SINGLE SUBMISSION
// // ======================================================

// export const getHomeworkSubmissionByIdController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const submission =
//         await getHomeworkSubmissionById(
//           schoolId,
//           submissionId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // UPDATE HOMEWORK SUBMISSION
// // ======================================================

// export const updateHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const {
//         submissionText,
//         attachment,
//       } = req.body;


//       const submission =
//         await updateHomeworkSubmission(
//           schoolId,
//           submissionId,
//           {
//             ...(submissionText !== undefined
//               ? {
//                   submissionText,
//                 }
//               : {}),

//             ...(attachment !== undefined
//               ? {
//                   attachment,
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework submission updated successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // REVIEW HOMEWORK SUBMISSION
// // ======================================================

// export const reviewHomeworkSubmissionController =
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
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (!userId) {
//         return res.status(
//           401
//         ).json({
//           success: false,
//           message:
//             "User ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const {
//         remarks,
//         marks,
//       } = req.body;


//       const submission =
//         await reviewHomeworkSubmission(
//           schoolId,
//           submissionId,
//           userId,
//           {
//             ...(remarks !== undefined
//               ? {
//                   remarks,
//                 }
//               : {}),

//             ...(marks !== undefined
//               ? {
//                   marks:
//                     Number(marks),
//                 }
//               : {}),
//           }
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework submission reviewed successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to review homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // DELETE HOMEWORK SUBMISSION
// // ======================================================

// export const deleteHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         submissionId,
//       } = req.params;


//       if (!schoolId) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "School ID not found in token",
//         });
//       }


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Submission ID is required",
//         });
//       }


//       const result =
//         await deleteHomeworkSubmission(
//           schoolId,
//           submissionId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,
//         ...result,
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to delete homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };


// // ======================================================
// // GET STUDENT SUBMISSION FOR HOMEWORK
// // ======================================================

// export const getStudentHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const {
//         homeworkId,
//         studentId,
//       } = req.params;


//       if (!schoolId) {
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


//       if (
//         !studentId ||
//         typeof studentId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,
//           message:
//             "Student ID is required",
//         });
//       }


//       const submission =
//         await getStudentHomeworkSubmission(
//           schoolId,
//           homeworkId,
//           studentId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch student homework submission";


//       return res.status(
//         400
//       ).json({
//         success: false,
//         message,
//       });
//     }
//   };

// // ======================================================
// // STUDENT - SUBMIT MY HOMEWORK
// //
// // POST /api/v1/homework-submissions/me
// // ======================================================

// export const createMyHomeworkSubmissionController =
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


//       const {
//         homeworkId,
//         submissionText,
//         attachment,
//       } = req.body;


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


//       const submission =
//         await createMyHomeworkSubmission(
//           schoolId,
//           studentId,
//           {
//             homeworkId,

//             ...(submissionText !==
//             undefined
//               ? {
//                   submissionText,
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
//           "Homework submitted successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to submit homework";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });
//     }
//   };


// // ======================================================
// // STUDENT - GET MY SUBMISSIONS
// //
// // GET /api/v1/homework-submissions/me
// // ======================================================

// export const getMyHomeworkSubmissionsController =
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


//       const submissions =
//         await getMyHomeworkSubmissions(
//           schoolId,
//           studentId
//         );


//       return res.status(
//         200
//       ).json({
//         success: true,

//         message:
//           "My homework submissions fetched successfully",

//         data: {
//           submissions,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch my homework submissions";


//       return res.status(
//         400
//       ).json({
//         success: false,

//         message,
//       });
//     }
//   };


// // ======================================================
// // STUDENT - UPDATE MY SUBMISSION
// //
// // PUT /api/v1/homework-submissions/me/:submissionId
// // ======================================================

// export const updateMyHomeworkSubmissionController =
//   async (
//     req: Request,
//     res: Response
//   ) => {

//     try {

//       const schoolId =
//         req.user?.schoolId;

//       const studentId =
//         req.user?.studentId;

//       const {
//         submissionId,
//       } = req.params;


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


//       if (
//         !submissionId ||
//         typeof submissionId !==
//           "string"
//       ) {
//         return res.status(
//           400
//         ).json({
//           success: false,

//           message:
//             "Submission ID is required",
//         });
//       }


//       const {
//         submissionText,
//         attachment,
//       } = req.body;


//       const submission =
//         await updateMyHomeworkSubmission(
//           schoolId,
//           studentId,
//           submissionId,
//           {
//             ...(submissionText !==
//             undefined
//               ? {
//                   submissionText,
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
//         200
//       ).json({
//         success: true,

//         message:
//           "Homework submission updated successfully",

//         data: {
//           submission,
//         },
//       });

//     } catch (error) {

//       const message =
//         error instanceof Error
//           ? error.message
//           : "Failed to update homework submission";


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
  HomeworkReviewStatus,
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";

import {
  createHomeworkSubmission,
  createMyHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkSubmissionById,
  getHomeworkSubmissions,
  getHomeworkSubmissionStats,
  getMyHomeworkSubmissions,
  getStudentHomeworkSubmission,
  reviewHomeworkSubmission,
  updateHomeworkSubmission,
  updateMyHomeworkSubmission,
} from "./homeworkSubmission.service";


// ======================================================
// HELPER: GET TEACHER ID FROM JWT
//
// SCHOOL_ADMIN:
// returns undefined.
//
// TEACHER:
// teacherId is mandatory in JWT.
// ======================================================

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


// ======================================================
// CREATE HOMEWORK SUBMISSION
//
// Existing School Admin/internal endpoint.
// Teacher should NOT use this endpoint.
// Student uses /me.
// ======================================================

export const createHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;


      if (!schoolId) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      const {
        homeworkId,
        studentId,
        submissionText,
        attachment,
      } = req.body;


      if (
        !homeworkId ||
        !studentId
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Homework ID and Student ID are required",
        });
      }


      const submission =
        await createHomeworkSubmission(
          schoolId,
          {

            homeworkId,

            studentId,

            ...(submissionText !==
            undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !==
            undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        201
      ).json({

        success: true,

        message:
          "Homework submitted successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit homework";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// GET HOMEWORK SUBMISSIONS
//
// SCHOOL_ADMIN:
// Any homework in own school.
//
// TEACHER:
// Only own homework.
// ======================================================

export const getHomeworkSubmissionsController =
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

        return res.status(
          400
        ).json({

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

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Homework ID is required",
        });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      // Teacher identity validation
      // also checks teacherId + userId relation.

      if (
        actorTeacherId &&
        !userId
      ) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "User ID not found in token",
        });
      }


      const filters = {

        ...(typeof req.query.studentId ===
        "string"
          ? {
              studentId:
                req.query.studentId,
            }
          : {}),


        ...(typeof req.query.submissionStatus ===
        "string"
          ? {
              submissionStatus:
                req.query
                  .submissionStatus as
                  HomeworkSubmissionStatus,
            }
          : {}),


        ...(typeof req.query.reviewStatus ===
        "string"
          ? {
              reviewStatus:
                req.query
                  .reviewStatus as
                  HomeworkReviewStatus,
            }
          : {}),


        ...(typeof req.query.search ===
        "string"
          ? {
              search:
                req.query.search,
            }
          : {}),


        ...(typeof req.query.page ===
        "string"
          ? {
              page:
                Number(
                  req.query.page
                ),
            }
          : {}),


        ...(typeof req.query.limit ===
        "string"
          ? {
              limit:
                Number(
                  req.query.limit
                ),
            }
          : {}),
      };


      const result =
        await getHomeworkSubmissions(
          schoolId,
          homeworkId,
          filters,
          actorTeacherId,
          actorTeacherId
            ? userId
            : undefined
        );


      return res.status(
        200
      ).json({

        success: true,

        data:
          result,
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework submissions";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// GET HOMEWORK SUBMISSION STATS
//
// TEACHER:
// Only own homework stats.
// ======================================================

export const getHomeworkSubmissionStatsController =
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

        return res.status(
          400
        ).json({

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

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Homework ID is required",
        });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      if (
        actorTeacherId &&
        !userId
      ) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "User ID not found in token",
        });
      }


      const stats =
        await getHomeworkSubmissionStats(
          schoolId,
          homeworkId,
          actorTeacherId,
          actorTeacherId
            ? userId
            : undefined
        );


      return res.status(
        200
      ).json({

        success: true,

        data: {
          stats,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch submission stats";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// GET SINGLE SUBMISSION
//
// TEACHER:
// Can access only submission belonging to own homework.
// ======================================================

export const getHomeworkSubmissionByIdController =
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
        submissionId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Submission ID is required",
        });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      if (
        actorTeacherId &&
        !userId
      ) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "User ID not found in token",
        });
      }


      const submission =
        await getHomeworkSubmissionById(
          schoolId,
          submissionId,
          actorTeacherId,
          actorTeacherId
            ? userId
            : undefined
        );


      return res.status(
        200
      ).json({

        success: true,

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// UPDATE HOMEWORK SUBMISSION
//
// Existing Admin/internal endpoint.
//
// Teacher should NOT edit student's submission.
// Student uses /me/:submissionId.
// ======================================================

export const updateHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Submission ID is required",
        });
      }


      const {
        submissionText,
        attachment,
      } = req.body;


      const submission =
        await updateHomeworkSubmission(
          schoolId,
          submissionId,
          {

            ...(submissionText !==
            undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !==
            undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        200
      ).json({

        success: true,

        message:
          "Homework submission updated successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// REVIEW HOMEWORK SUBMISSION
//
// SCHOOL_ADMIN:
// Can review school submission.
//
// TEACHER:
// Can review only submission from own homework.
//
// reviewedBy = User._id
// ======================================================

export const reviewHomeworkSubmissionController =
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
        submissionId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (!userId) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "User ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Submission ID is required",
        });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      const {
        remarks,
        marks,
      } = req.body;


      // ==================================================
      // MARKS VALIDATION
      // ==================================================

      if (
        marks !== undefined &&
        (
          Number.isNaN(
            Number(marks)
          ) ||
          Number(marks) < 0
        )
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Marks must be a valid non-negative number",
        });
      }


      const submission =
        await reviewHomeworkSubmission(
          schoolId,
          submissionId,
          userId,
          {

            ...(remarks !==
            undefined
              ? {
                  remarks:
                    String(
                      remarks
                    ),
                }
              : {}),

            ...(marks !==
            undefined
              ? {
                  marks:
                    Number(
                      marks
                    ),
                }
              : {}),
          },
          actorTeacherId,
          actorTeacherId
            ? userId
            : undefined
        );


      return res.status(
        200
      ).json({

        success: true,

        message:
          "Homework submission reviewed successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to review homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// DELETE HOMEWORK SUBMISSION
//
// Teacher should NOT get this route permission.
// ======================================================

export const deleteHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Submission ID is required",
        });
      }


      const result =
        await deleteHomeworkSubmission(
          schoolId,
          submissionId
        );


      return res.status(
        200
      ).json({

        success: true,

        ...result,
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// GET STUDENT SUBMISSION FOR HOMEWORK
//
// TEACHER:
// Only students belonging to own homework.
// ======================================================

export const getStudentHomeworkSubmissionController =
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
        studentId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          400
        ).json({

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

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Homework ID is required",
        });
      }


      if (
        !studentId ||
        typeof studentId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Student ID is required",
        });
      }


      const actorTeacherId =
        getActorTeacherId(
          req
        );


      if (
        actorTeacherId &&
        !userId
      ) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "User ID not found in token",
        });
      }


      const submission =
        await getStudentHomeworkSubmission(
          schoolId,
          homeworkId,
          studentId,
          actorTeacherId,
          actorTeacherId
            ? userId
            : undefined
        );


      return res.status(
        200
      ).json({

        success: true,

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch student homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// STUDENT - SUBMIT MY HOMEWORK
//
// POST /api/v1/homework-submissions/me
// ======================================================

export const createMyHomeworkSubmissionController =
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

        return res.status(
          401
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (!studentId) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "Student ID not found in token",
        });
      }


      const {
        homeworkId,
        submissionText,
        attachment,
      } = req.body;


      if (
        !homeworkId ||
        typeof homeworkId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Homework ID is required",
        });
      }


      const submission =
        await createMyHomeworkSubmission(
          schoolId,
          studentId,
          {

            homeworkId,

            ...(submissionText !==
            undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !==
            undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        201
      ).json({

        success: true,

        message:
          "Homework submitted successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit homework";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// STUDENT - GET MY SUBMISSIONS
//
// GET /api/v1/homework-submissions/me
// ======================================================

export const getMyHomeworkSubmissionsController =
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

        return res.status(
          401
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (!studentId) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "Student ID not found in token",
        });
      }


      const submissions =
        await getMyHomeworkSubmissions(
          schoolId,
          studentId
        );


      return res.status(
        200
      ).json({

        success: true,

        message:
          "My homework submissions fetched successfully",

        data: {
          submissions,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch my homework submissions";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };


// ======================================================
// STUDENT - UPDATE MY SUBMISSION
//
// PUT /api/v1/homework-submissions/me/:submissionId
// ======================================================

export const updateMyHomeworkSubmissionController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const schoolId =
        req.user?.schoolId;

      const studentId =
        req.user?.studentId;

      const {
        submissionId,
      } = req.params;


      if (!schoolId) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "School ID not found in token",
        });
      }


      if (!studentId) {

        return res.status(
          401
        ).json({

          success: false,

          message:
            "Student ID not found in token",
        });
      }


      if (
        !submissionId ||
        typeof submissionId !==
          "string"
      ) {

        return res.status(
          400
        ).json({

          success: false,

          message:
            "Submission ID is required",
        });
      }


      const {
        submissionText,
        attachment,
      } = req.body;


      const submission =
        await updateMyHomeworkSubmission(
          schoolId,
          studentId,
          submissionId,
          {

            ...(submissionText !==
            undefined
              ? {
                  submissionText,
                }
              : {}),

            ...(attachment !==
            undefined
              ? {
                  attachment,
                }
              : {}),
          }
        );


      return res.status(
        200
      ).json({

        success: true,

        message:
          "Homework submission updated successfully",

        data: {
          submission,
        },
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update homework submission";


      return res.status(
        400
      ).json({

        success: false,

        message,
      });
    }
  };