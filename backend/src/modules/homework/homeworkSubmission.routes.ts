// import { Router } from "express";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";

// import {
//   createHomeworkSubmissionController,
//   deleteHomeworkSubmissionController,
//   getHomeworkSubmissionByIdController,
//   getHomeworkSubmissionsController,
//   getHomeworkSubmissionStatsController,
//   getStudentHomeworkSubmissionController,
//   reviewHomeworkSubmissionController,
//   updateHomeworkSubmissionController,
// } from "./homeworkSubmission.controller";

// const router = Router();

// router.use(
//   authenticate,
//   authorize(UserRole.SCHOOL_ADMIN)
// );


// // Create submission
// router.post(
//   "/",
//   createHomeworkSubmissionController
// );


// // Homework-wise stats
// router.get(
//   "/homework/:homeworkId/stats",
//   getHomeworkSubmissionStatsController
// );


// // Homework-wise submissions list
// router.get(
//   "/homework/:homeworkId",
//   getHomeworkSubmissionsController
// );


// // Particular student submission
// router.get(
//   "/homework/:homeworkId/student/:studentId",
//   getStudentHomeworkSubmissionController
// );


// // Single submission
// router.get(
//   "/:submissionId",
//   getHomeworkSubmissionByIdController
// );


// // Update submission
// router.put(
//   "/:submissionId",
//   updateHomeworkSubmissionController
// );


// // Review submission
// router.patch(
//   "/:submissionId/review",
//   reviewHomeworkSubmissionController
// );


// // Delete submission
// router.delete(
//   "/:submissionId",
//   deleteHomeworkSubmissionController
// );


// export default router;






// import {
//   Router,
// } from "express";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";

// import {
//   createHomeworkSubmissionController,
//   createMyHomeworkSubmissionController,
//   deleteHomeworkSubmissionController,
//   getHomeworkSubmissionByIdController,
//   getHomeworkSubmissionsController,
//   getHomeworkSubmissionStatsController,
//   getMyHomeworkSubmissionsController,
//   getStudentHomeworkSubmissionController,
//   reviewHomeworkSubmissionController,
//   updateHomeworkSubmissionController,
//   updateMyHomeworkSubmissionController,
// } from "./homeworkSubmission.controller";


// const router =
//   Router();


// // ============================================
// // AUTHENTICATION
// // ============================================

// router.use(
//   authenticate
// );


// // ============================================
// // STUDENT ROUTES
// //
// // IMPORTANT:
// // /me routes must stay before /:submissionId
// // ============================================

// router.post(
//   "/me",

//   authorize(
//     UserRole.STUDENT
//   ),

//   createMyHomeworkSubmissionController
// );


// router.get(
//   "/me",

//   authorize(
//     UserRole.STUDENT
//   ),

//   getMyHomeworkSubmissionsController
// );


// router.put(
//   "/me/:submissionId",

//   authorize(
//     UserRole.STUDENT
//   ),

//   updateMyHomeworkSubmissionController
// );


// // ============================================
// // SCHOOL ADMIN - CREATE SUBMISSION
// // ============================================

// router.post(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   createHomeworkSubmissionController
// );


// // ============================================
// // SCHOOL ADMIN - HOMEWORK-WISE STATS
// // ============================================

// router.get(
//   "/homework/:homeworkId/stats",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworkSubmissionStatsController
// );


// // ============================================
// // SCHOOL ADMIN - HOMEWORK-WISE SUBMISSIONS
// // ============================================

// router.get(
//   "/homework/:homeworkId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworkSubmissionsController
// );


// // ============================================
// // SCHOOL ADMIN - PARTICULAR STUDENT SUBMISSION
// // ============================================

// router.get(
//   "/homework/:homeworkId/student/:studentId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getStudentHomeworkSubmissionController
// );


// // ============================================
// // SCHOOL ADMIN - SINGLE SUBMISSION
// // ============================================

// router.get(
//   "/:submissionId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getHomeworkSubmissionByIdController
// );


// // ============================================
// // SCHOOL ADMIN - UPDATE SUBMISSION
// // ============================================

// router.put(
//   "/:submissionId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   updateHomeworkSubmissionController
// );


// // ============================================
// // SCHOOL ADMIN - REVIEW SUBMISSION
// // ============================================

// router.patch(
//   "/:submissionId/review",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   reviewHomeworkSubmissionController
// );


// // ============================================
// // SCHOOL ADMIN - DELETE SUBMISSION
// // ============================================

// router.delete(
//   "/:submissionId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   deleteHomeworkSubmissionController
// );


// export default router;









import {
  Router,
} from "express";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";

import {
  createHomeworkSubmissionController,
  createMyHomeworkSubmissionController,
  deleteHomeworkSubmissionController,
  getHomeworkSubmissionByIdController,
  getHomeworkSubmissionsController,
  getHomeworkSubmissionStatsController,
  getMyHomeworkSubmissionsController,
  getStudentHomeworkSubmissionController,
  reviewHomeworkSubmissionController,
  updateHomeworkSubmissionController,
  updateMyHomeworkSubmissionController,
} from "./homeworkSubmission.controller";


const router =
  Router();


// ============================================
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// STUDENT ROUTES
//
// IMPORTANT:
// /me routes must stay before /:submissionId
// ============================================

router.post(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  createMyHomeworkSubmissionController
);


router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMyHomeworkSubmissionsController
);


router.put(
  "/me/:submissionId",

  authorize(
    UserRole.STUDENT
  ),

  updateMyHomeworkSubmissionController
);


// ============================================
// SCHOOL ADMIN - CREATE SUBMISSION
//
// Teacher ko manually student ki
// submission create nahi karni.
// ============================================

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  createHomeworkSubmissionController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// HOMEWORK SUBMISSION STATS
// ============================================

router.get(
  "/homework/:homeworkId/stats",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworkSubmissionStatsController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// HOMEWORK-WISE SUBMISSIONS
// ============================================

router.get(
  "/homework/:homeworkId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworkSubmissionsController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// PARTICULAR STUDENT SUBMISSION
// ============================================

router.get(
  "/homework/:homeworkId/student/:studentId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getStudentHomeworkSubmissionController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// SINGLE SUBMISSION
// ============================================

router.get(
  "/:submissionId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getHomeworkSubmissionByIdController
);


// ============================================
// SCHOOL ADMIN - UPDATE SUBMISSION
//
// Teacher student ka submitted answer
// edit nahi karega.
// ============================================

router.put(
  "/:submissionId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateHomeworkSubmissionController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// REVIEW SUBMISSION
// ============================================

router.patch(
  "/:submissionId/review",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  reviewHomeworkSubmissionController
);


// ============================================
// SCHOOL ADMIN - DELETE SUBMISSION
//
// Teacher delete nahi karega.
// ============================================

router.delete(
  "/:submissionId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  deleteHomeworkSubmissionController
);


export default router;