// import {
//   Router,
// } from "express";

// import {
//   createSubjectController,
//   getSubjectsController,
//   getSubjectByIdController,
//   updateSubjectController,
//   updateSubjectStatusController,
// } from "./subject.controller";

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
//   createSubjectController
// );


// // GET ALL
// router.get(
//   "/",
//   getSubjectsController
// );


// // STATUS
// router.patch(
//   "/:subjectId/status",
//   updateSubjectStatusController
// );


// // GET ONE
// router.get(
//   "/:subjectId",
//   getSubjectByIdController
// );


// // UPDATE
// router.put(
//   "/:subjectId",
//   updateSubjectController
// );


// export default router;









import {
  Router,
} from "express";

import {
  createSubjectController,
  getSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  updateSubjectStatusController,
  getMySubjectsController,
} from "./subject.controller";

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
// AUTHENTICATION
// ============================================

router.use(
  authenticate
);


// ============================================
// STUDENT - MY SUBJECTS
//
// GET /api/v1/subjects/me
//
// IMPORTANT:
// /me must be before /:subjectId
// ============================================

router.get(
  "/me",

  authorize(
    UserRole.STUDENT
  ),

  getMySubjectsController
);


// ============================================
// SCHOOL ADMIN - CREATE
// ============================================

router.post(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  createSubjectController
);


// ============================================
// SCHOOL ADMIN - GET ALL
// ============================================

router.get(
  "/",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getSubjectsController
);


// ============================================
// SCHOOL ADMIN - STATUS
// ============================================

router.patch(
  "/:subjectId/status",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateSubjectStatusController
);


// ============================================
// SCHOOL ADMIN - GET ONE
// ============================================

router.get(
  "/:subjectId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  getSubjectByIdController
);


// ============================================
// SCHOOL ADMIN - UPDATE
// ============================================

router.put(
  "/:subjectId",

  authorize(
    UserRole.SCHOOL_ADMIN
  ),

  updateSubjectController
);


export default router;
