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
  getMyTeacherAttendanceController,
  getSingleTeacherAttendanceSummaryController,
  getTeacherAttendanceController,
  getTeacherAttendanceMonthlySummaryController,
  markBulkTeacherAttendanceController,
  updateTeacherAttendanceController,
} from "./teacherAttendance.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/me",
  authorize(UserRole.TEACHER),
  getMyTeacherAttendanceController,
);

router.post(
  "/bulk",
  authorize(UserRole.SCHOOL_ADMIN),
  markBulkTeacherAttendanceController,
);

router.get(
  "/monthly-summary",
  authorize(UserRole.SCHOOL_ADMIN),
  getTeacherAttendanceMonthlySummaryController,
);

router.get(
  "/teacher/:teacherId/summary",
  authorize(UserRole.SCHOOL_ADMIN),
  getSingleTeacherAttendanceSummaryController,
);

router.get(
  "/",
  authorize(UserRole.SCHOOL_ADMIN),
  getTeacherAttendanceController,
);

router.put(
  "/:attendanceId",
  authorize(UserRole.SCHOOL_ADMIN),
  updateTeacherAttendanceController,
);

export default router;

