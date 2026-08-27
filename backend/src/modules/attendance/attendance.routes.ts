import {
  Router,
} from "express";

import {
  markBulkAttendanceController,
  getAttendanceController,
  updateAttendanceController,
  getMonthlyAttendanceSummaryController,
  getStudentAttendanceSummaryController,
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
// AUTH + SCHOOL ADMIN ONLY
// ============================================

router.use(
  authenticate,

  authorize(
    UserRole.SCHOOL_ADMIN
  )
);


// ============================================
// BULK MARK ATTENDANCE
//
// POST /api/v1/attendance/bulk
// ============================================

router.post(
  "/bulk",
  markBulkAttendanceController
);


// ============================================
// MONTHLY SUMMARY
//
// GET /api/v1/attendance/monthly-summary
//
// IMPORTANT:
// Specific routes :attendanceId se pehle rakho.
// ============================================

router.get(
  "/monthly-summary",
  getMonthlyAttendanceSummaryController
);


// ============================================
// STUDENT ATTENDANCE SUMMARY
//
// GET
// /api/v1/attendance/student/:studentId/summary
// ============================================

router.get(
  "/student/:studentId/summary",
  getStudentAttendanceSummaryController
);


// ============================================
// GET ATTENDANCE
//
// GET /api/v1/attendance
// ============================================

router.get(
  "/",
  getAttendanceController
);


// ============================================
// UPDATE SINGLE ATTENDANCE
//
// PUT /api/v1/attendance/:attendanceId
// ============================================

router.put(
  "/:attendanceId",
  updateAttendanceController
);


export default router;