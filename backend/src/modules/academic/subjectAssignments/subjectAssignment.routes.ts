// import {
//   Router,
// } from "express";

// import {
//   createSubjectAssignmentController,
//   getSubjectAssignmentsController,
//   getSubjectAssignmentByIdController,
//   updateSubjectAssignmentController,
//   updateSubjectAssignmentStatusController,
// } from "./subjectAssignment.controller";

// import {
//   authenticate,
// } from "../../../middlewares/auth.middleware";

// import {
//   authorize,
// } from "../../../middlewares/role.middleware";

// import {
//   UserRole,
// } from "../../../constants/roles";


// const router =
//   Router();


// router.use(
//   authenticate,

//   authorize(
//     UserRole.SCHOOL_ADMIN
//   )
// );


// // CREATE
// router.post(
//   "/",
//   createSubjectAssignmentController
// );


// // GET ALL
// router.get(
//   "/",
//   getSubjectAssignmentsController
// );


// // STATUS
// router.patch(
//   "/:assignmentId/status",
//   updateSubjectAssignmentStatusController
// );


// // GET ONE
// router.get(
//   "/:assignmentId",
//   getSubjectAssignmentByIdController
// );


// // UPDATE
// router.put(
//   "/:assignmentId",
//   updateSubjectAssignmentController
// );


// export default router;





import {
  Router,
} from "express";

import {
  createSubjectAssignmentController,
  getSubjectAssignmentsController,
  getMySubjectAssignmentsController,
  getSubjectAssignmentByIdController,
  updateSubjectAssignmentController,
  updateSubjectAssignmentStatusController,
} from "./subjectAssignment.controller";

import {
  authenticate,
} from "../../../middlewares/auth.middleware";

import {
  authorize,
} from "../../../middlewares/role.middleware";

import {
  UserRole,
} from "../../../constants/roles";


const router =
  Router();


// ============================================
// AUTHENTICATE ALL ROUTES
// ============================================

router.use(
  authenticate
);


// ============================================
// TEACHER - MY SUBJECTS / CLASSES
// IMPORTANT: BEFORE /:assignmentId
// ============================================

router.get(

  "/teacher/me",

  authorize(
    UserRole.TEACHER
  ),

  getMySubjectAssignmentsController
);


// ============================================
// CREATE
// SCHOOL ADMIN ONLY
// ============================================

router.post(

  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  createSubjectAssignmentController
);


// ============================================
// GET ALL
// SCHOOL ADMIN ONLY
// ============================================

router.get(

  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getSubjectAssignmentsController
);


// ============================================
// STATUS
// SCHOOL ADMIN ONLY
// ============================================

router.patch(

  "/:assignmentId/status",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateSubjectAssignmentStatusController
);


// ============================================
// GET ONE
// SCHOOL ADMIN ONLY
// ============================================

router.get(

  "/:assignmentId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getSubjectAssignmentByIdController
);


// ============================================
// UPDATE
// SCHOOL ADMIN ONLY
// ============================================

router.put(

  "/:assignmentId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateSubjectAssignmentController
);


export default router;