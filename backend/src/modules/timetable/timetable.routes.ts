import {
  Router,
} from "express";

import {
  createTimetableController,
  getTimetableController,
  getTimetableByIdController,
  updateTimetableController,
  deleteTimetableController,
  copyTimetableController,
} from "./timetable.controller";

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
// CREATE TIMETABLE PERIOD
//
// POST /api/v1/timetable
// ============================================

router.post(
  "/",
  createTimetableController
);


// ============================================
// COPY TIMETABLE
//
// POST /api/v1/timetable/copy
//
// IMPORTANT:
// /copy ko /:timetableId se pehle rakho.
// ============================================

router.post(
  "/copy",
  copyTimetableController
);


// ============================================
// GET TIMETABLE
//
// Weekly:
// GET /api/v1/timetable
// ?sessionId=
// &classId=
// &sectionId=
//
// Daily:
// + day=MONDAY
//
// Teacher:
// ?sessionId=
// &teacherId=
//
// Subject:
// ?sessionId=
// &subjectId=
// ============================================

router.get(
  "/",
  getTimetableController
);


// ============================================
// GET SINGLE PERIOD
//
// GET /api/v1/timetable/:timetableId
// ============================================

router.get(
  "/:timetableId",
  getTimetableByIdController
);


// ============================================
// UPDATE PERIOD
//
// PUT /api/v1/timetable/:timetableId
// ============================================

router.put(
  "/:timetableId",
  updateTimetableController
);


// ============================================
// DELETE PERIOD
//
// DELETE /api/v1/timetable/:timetableId
// ============================================

router.delete(
  "/:timetableId",
  deleteTimetableController
);


export default router;