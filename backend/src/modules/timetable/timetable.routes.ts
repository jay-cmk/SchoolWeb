



// import {
//   Router,
// } from "express";

// import {
//   createTimetableController,
//   getTimetableController,
//   getTimetableByIdController,
//   updateTimetableController,
//   deleteTimetableController,
//   copyTimetableController,
//   getMyTimetableController,
//   getMyTeacherTimetableController,
// } from "./timetable.controller";

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
// // ============================================

// router.use(
//   authenticate
// );


// // ============================================
// // STUDENT - MY TIMETABLE
// //
// // GET /api/v1/timetable/me
// //
// // Optional:
// // GET /api/v1/timetable/me?day=MONDAY
// //
// // IMPORTANT:
// // /me must come before /:timetableId
// // ============================================

// router.get(
//   "/me",

//   authorize(
//     UserRole.STUDENT
//   ),

//   getMyTimetableController
// );


// // ============================================
// // SCHOOL ADMIN - CREATE TIMETABLE PERIOD
// //
// // POST /api/v1/timetable
// // ============================================

// router.post(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   createTimetableController
// );


// // ============================================
// // SCHOOL ADMIN - COPY TIMETABLE
// //
// // POST /api/v1/timetable/copy
// //
// // IMPORTANT:
// // /copy must come before /:timetableId
// // ============================================

// router.post(
//   "/copy",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   copyTimetableController
// );


// // ============================================
// // SCHOOL ADMIN - GET TIMETABLE
// //
// // Weekly:
// // GET /api/v1/timetable
// // ?sessionId=
// // &classId=
// // &sectionId=
// //
// // Daily:
// // + day=MONDAY
// //
// // Teacher:
// // ?sessionId=
// // &teacherId=
// //
// // Subject:
// // ?sessionId=
// // &subjectId=
// // ============================================

// router.get(
//   "/",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getTimetableController
// );


// // ============================================
// // SCHOOL ADMIN - GET SINGLE PERIOD
// //
// // GET /api/v1/timetable/:timetableId
// // ============================================

// router.get(
//   "/:timetableId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   getTimetableByIdController
// );


// // ============================================
// // SCHOOL ADMIN - UPDATE PERIOD
// //
// // PUT /api/v1/timetable/:timetableId
// // ============================================

// router.put(
//   "/:timetableId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   updateTimetableController
// );


// // ============================================
// // SCHOOL ADMIN - DELETE PERIOD
// //
// // DELETE /api/v1/timetable/:timetableId
// // ============================================

// router.delete(
//   "/:timetableId",

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   ),

//   deleteTimetableController
// );


// export default router;






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
  getMyTimetableController,
  getMyTeacherTimetableController,
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
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// STUDENT - MY TIMETABLE
//
// GET /api/v1/timetable/me
//
// Optional:
// GET /api/v1/timetable/me?day=MONDAY
//
// IMPORTANT:
// /me must come before /:timetableId
// ============================================

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMyTimetableController
);


// ============================================
// TEACHER - MY TIMETABLE
//
// GET /api/v1/timetable/teacher/me
//
// Optional:
// GET /api/v1/timetable/teacher/me?day=MONDAY
//
// Teacher identity:
// schoolId + teacherId + userId
// JWT se aayega.
//
// IMPORTANT:
// /teacher/me must come before /:timetableId
// ============================================

router.get(
  "/teacher/me",

  authorize(
    UserRole.TEACHER
  ),

  getMyTeacherTimetableController
);


// ============================================
// SCHOOL ADMIN - CREATE TIMETABLE PERIOD
//
// POST /api/v1/timetable
// ============================================

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  createTimetableController
);


// ============================================
// SCHOOL ADMIN - COPY TIMETABLE
//
// POST /api/v1/timetable/copy
//
// IMPORTANT:
// /copy must come before /:timetableId
// ============================================

router.post(
  "/copy",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  copyTimetableController
);


// ============================================
// SCHOOL ADMIN - GET TIMETABLE
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

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getTimetableController
);


// ============================================
// SCHOOL ADMIN - GET SINGLE PERIOD
//
// GET /api/v1/timetable/:timetableId
// ============================================

router.get(
  "/:timetableId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getTimetableByIdController
);


// ============================================
// SCHOOL ADMIN - UPDATE PERIOD
//
// PUT /api/v1/timetable/:timetableId
// ============================================

router.put(
  "/:timetableId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateTimetableController
);


// ============================================
// SCHOOL ADMIN - DELETE PERIOD
//
// DELETE /api/v1/timetable/:timetableId
// ============================================

router.delete(
  "/:timetableId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  deleteTimetableController
);


export default router;