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
  HomeworkSubmissionMode,
  HomeworkSubmissionStatus,
} from "./homeworkSubmission.types";

import {
  bulkReviewHomework,
  createHomeworkSubmission,
  createMyHomeworkSubmission,
  deleteHomeworkSubmission,
  getHomeworkSubmissionById,
  getHomeworkSubmissions,
  getHomeworkSubmissionStats,
  getMyHomeworkSubmissions,
  getStudentHomeworkSubmission,
  markOfflineHomework,
  reviewHomeworkSubmission,
  updateHomeworkSubmission,
  updateMyHomeworkSubmission,
} from "./homeworkSubmission.service";


// ======================================================
// HELPER: GET TEACHER ID FROM JWT
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
// HELPER: REVIEW STATUS
// ======================================================

const isAllowedReviewStatus = (
  value: unknown
): value is HomeworkReviewStatus => {
  return (
    value ===
      HomeworkReviewStatus.COMPLETED ||
    value ===
      HomeworkReviewStatus.INCOMPLETE ||
    value ===
      HomeworkReviewStatus.REDO_REQUIRED
  );
};


// ======================================================
// CREATE HOMEWORK SUBMISSION
// SCHOOL ADMIN
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
        typeof homeworkId !==
          "string" ||
        !studentId ||
        typeof studentId !==
          "string"
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
                  submissionText:
                    String(
                      submissionText
                    ),
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
// SCHOOL ADMIN + TEACHER
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

        ...(typeof req.query.submissionMode ===
        "string"
          ? {
              submissionMode:
                req.query
                  .submissionMode as
                  HomeworkSubmissionMode,
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
// SCHOOL ADMIN ONLY
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
                  submissionText:
                    String(
                      submissionText
                    ),
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
// REVIEW ONLINE SUBMISSION
// SCHOOL ADMIN + TEACHER
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

      const {
        reviewStatus,
        remarks,
        marks,
      } = req.body;

      if (
        !isAllowedReviewStatus(
          reviewStatus
        )
      ) {
        return res.status(
          400
        ).json({
          success: false,

          message:
            "Review status must be COMPLETED, INCOMPLETE or REDO_REQUIRED",
        });
      }

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

      const actorTeacherId =
        getActorTeacherId(
          req
        );

      const submission =
        await reviewHomeworkSubmission(
          schoolId,
          submissionId,
          userId,
          {
            reviewStatus,

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
// MARK OFFLINE / NOTEBOOK HOMEWORK
// SCHOOL ADMIN + TEACHER
// ======================================================

export const markOfflineHomeworkController =
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

      const {
        studentId,
        reviewStatus,
        remarks,
        marks,
      } = req.body;

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

      if (
        !isAllowedReviewStatus(
          reviewStatus
        )
      ) {
        return res.status(
          400
        ).json({
          success: false,

          message:
            "Review status must be COMPLETED, INCOMPLETE or REDO_REQUIRED",
        });
      }

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

      const actorTeacherId =
        getActorTeacherId(
          req
        );

      const submission =
        await markOfflineHomework(
          schoolId,
          homeworkId,
          userId,
          {
            studentId,

            reviewStatus,

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
          "Offline homework marked successfully",

        data: {
          submission,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark offline homework";

      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// BULK REVIEW
// SCHOOL ADMIN + TEACHER
// ======================================================

export const bulkReviewHomeworkController =
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

      const {
        students,
      } = req.body;

      if (
        !Array.isArray(
          students
        ) ||
        students.length === 0
      ) {
        return res.status(
          400
        ).json({
          success: false,

          message:
            "Students array is required",
        });
      }

      if (
        students.length >
        100
      ) {
        return res.status(
          400
        ).json({
          success: false,

          message:
            "Maximum 100 students can be reviewed at once",
        });
      }

      const normalizedStudents =
        [];

      for (
        const item of
        students
      ) {
        if (
          !item ||
          typeof item.studentId !==
            "string"
        ) {
          return res.status(
            400
          ).json({
            success: false,

            message:
              "Every student must have a valid studentId",
          });
        }

        if (
          !isAllowedReviewStatus(
            item.reviewStatus
          )
        ) {
          return res.status(
            400
          ).json({
            success: false,

            message:
              "Every student must have COMPLETED, INCOMPLETE or REDO_REQUIRED reviewStatus",
          });
        }

        if (
          item.marks !==
            undefined &&
          (
            Number.isNaN(
              Number(
                item.marks
              )
            ) ||
            Number(
              item.marks
            ) < 0
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

        normalizedStudents.push({
          studentId:
            item.studentId,

          reviewStatus:
            item.reviewStatus,

          ...(item.remarks !==
          undefined
            ? {
                remarks:
                  String(
                    item.remarks
                  ),
              }
            : {}),

          ...(item.marks !==
          undefined
            ? {
                marks:
                  Number(
                    item.marks
                  ),
              }
            : {}),
        });
      }

      const actorTeacherId =
        getActorTeacherId(
          req
        );

      const result =
        await bulkReviewHomework(
          schoolId,
          homeworkId,
          userId,
          {
            students:
              normalizedStudents,
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
          "Homework reviewed successfully",

        data:
          result,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to review homework";

      return res.status(
        400
      ).json({
        success: false,
        message,
      });
    }
  };


// ======================================================
// DELETE SUBMISSION
// SCHOOL ADMIN ONLY
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
// GET STUDENT SUBMISSION
// SCHOOL ADMIN + TEACHER
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
                  submissionText:
                    String(
                      submissionText
                    ),
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
                  submissionText:
                    String(
                      submissionText
                    ),
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