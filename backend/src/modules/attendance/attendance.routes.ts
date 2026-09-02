// import {
//   Router,
// } from "express";

// import {
//   markBulkAttendanceController,
//   getAttendanceController,
//   updateAttendanceController,
//   getMonthlyAttendanceSummaryController,
//   getStudentAttendanceSummaryController,
// } from "./attendance.controller";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";


// const router =
//   Router();


// // ============================================
// // AUTH + SCHOOL ADMIN ONLY
// // ============================================

// router.use(
//   authenticate,

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// // ============================================
// // BULK MARK ATTENDANCE
// //
// // POST /api/v1/attendance/bulk
// // ============================================

// router.post(
//   "/bulk",
//   markBulkAttendanceController
// );


// // ============================================
// // MONTHLY SUMMARY
// //
// // GET /api/v1/attendance/monthly-summary
// //
// // IMPORTANT:
// // Specific routes :attendanceId se pehle rakho.
// // ============================================

// router.get(
//   "/monthly-summary",
//   getMonthlyAttendanceSummaryController
// );


// // ============================================
// // STUDENT ATTENDANCE SUMMARY
// //
// // GET
// // /api/v1/attendance/student/:studentId/summary
// // ============================================

// router.get(
//   "/student/:studentId/summary",
//   getStudentAttendanceSummaryController
// );


// // ============================================
// // GET ATTENDANCE
// //
// // GET /api/v1/attendance
// // ============================================

// router.get(
//   "/",
//   getAttendanceController
// );


// // ============================================
// // UPDATE SINGLE ATTENDANCE
// //
// // PUT /api/v1/attendance/:attendanceId
// // ============================================

// router.put(
//   "/:attendanceId",
//   updateAttendanceController
// );


// export default router;









// import {
//   Router,
// } from "express";

// import {
//   markBulkAttendanceController,
//   getAttendanceController,
//   updateAttendanceController,
//   getMonthlyAttendanceSummaryController,
//   getStudentAttendanceSummaryController,
//   getMyAttendanceSummaryController,
// } from "./attendance.controller";

// import {
//   authenticate,
// } from "../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../constants/roles";


// const router =
//   Router();


// // ============================================
// // AUTHENTICATION
// // ALL ATTENDANCE ROUTES
// // ============================================

// router.use(
//   authenticate
// );


// // ============================================
// // STUDENT - MY ATTENDANCE
// //
// // GET /api/v1/attendance/me
// //
// // Student ID comes from JWT
// // ============================================

// router.get(
//   "/me",

//   authorize(
//     UserRole.STUDENT
//   ),

//   getMyAttendanceSummaryController
// );


// // ============================================
// // SCHOOL ADMIN - BULK MARK ATTENDANCE
// //
// // POST /api/v1/attendance/bulk
// // ============================================

// router.post(
//   "/bulk",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   markBulkAttendanceController
// );


// // ============================================
// // SCHOOL ADMIN - MONTHLY SUMMARY
// //
// // GET /api/v1/attendance/monthly-summary
// // ============================================

// router.get(
//   "/monthly-summary",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getMonthlyAttendanceSummaryController
// );


// // ============================================
// // SCHOOL ADMIN - STUDENT SUMMARY
// //
// // GET
// // /api/v1/attendance/student/:studentId/summary
// // ============================================

// router.get(
//   "/student/:studentId/summary",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getStudentAttendanceSummaryController
// );


// // ============================================
// // SCHOOL ADMIN - GET ATTENDANCE
// //
// // GET /api/v1/attendance
// // ============================================

// router.get(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getAttendanceController
// );


// // ============================================
// // SCHOOL ADMIN - UPDATE ATTENDANCE
// //
// // PUT /api/v1/attendance/:attendanceId
// // ============================================

// router.put(
//   "/:attendanceId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   updateAttendanceController
// );


// export default router;








import {
  Router,
} from "express";

import {
  markBulkAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  getMonthlyAttendanceSummaryController,
  getStudentAttendanceSummaryController,
  getMyAttendanceSummaryController,
} from "./attendance.controller";

import {
  authenticate,
} from "../../middlewares/auth.middleware";

import {
  authorize,
} from "../../middlewares/role.middleware";

import {
  UserRole,
} from "../../constants/roles";


const router =
  Router();


// ============================================
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// STUDENT - MY ATTENDANCE
//
// GET /api/v1/attendance/me
// ============================================

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMyAttendanceSummaryController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// BULK MARK ATTENDANCE
//
// POST /api/v1/attendance/bulk
//
// Teacher:
// SubjectAssignment validation required
// ============================================

router.post(
  "/bulk",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  markBulkAttendanceController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// MONTHLY SUMMARY
//
// GET /api/v1/attendance/monthly-summary
//
// Teacher:
// exact assigned class/section only
// ============================================

router.get(
  "/monthly-summary",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getMonthlyAttendanceSummaryController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// STUDENT SUMMARY
//
// GET
// /api/v1/attendance/student/:studentId/summary
//
// Teacher:
// student must belong to teacher's
// assigned class/section
// ============================================

router.get(
  "/student/:studentId/summary",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getStudentAttendanceSummaryController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// GET ATTENDANCE
//
// GET /api/v1/attendance
//
// Teacher must send:
// sessionId + classId + sectionId
// ============================================

router.get(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  getAttendanceController
);


// ============================================
// SCHOOL ADMIN + TEACHER
// UPDATE ATTENDANCE
//
// PUT /api/v1/attendance/:attendanceId
//
// Teacher assignment is checked from
// attendance record context.
// ============================================

router.put(
  "/:attendanceId",

  authorize(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER
  ),

  updateAttendanceController
);


export default router;